<script setup>
import { Icon } from "@iconify/vue"
import { defaultRoute } from "@/common/constant";
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref, nextTick } from "vue";
import { OrderStatus, Role } from "@/common/contract";
import { useUserStore } from "@/stores/user.store";
import { useRoute } from "vue-router";
import { Client } from '@stomp/stompjs';
import urlConstant from "@/common/urlConstant";
import MessageBubble from "@/components/messenger/MessageBubble.vue";
import ChatService from "@/services/chat.service"
import UserMessageCard from "@/components/messenger/UserMessageCard.vue";
import { Tooltip } from 'ant-design-vue';
import BuyerOrderDetailModal from "@/components/messenger/BuyerOrderDetailModal.vue";
import orderService from "@/services/order.service";
import reportService from "@/services/report.service";
import toastOption from "@/utils/toast-option";
import ReportModal from "@/components/ReportModal.vue";
import ListEditableImage from "@/components/ListEditableImage.vue";
import { useFirebaseStore } from "@/stores/firebase.store";
import { base64Image } from "@/utils/imageFile";
import moment from "moment";
import Loading from "@/components/common-components/Loading.vue";

const userStore = useUserStore()
const route = useRoute()
const firebaseStore = useFirebaseStore()

let stompClient
let groupId
let subscription

const messagesData = ref([])
const messageDtos = ref([])
const groupInfo = ref(undefined)
const orderDetail = ref(undefined)

const sttChange = ref('')
const curAddress = ref('')
const curPhone = ref('')
const textMessage = ref('')

const isSideBarShowing = ref(false)
const isBuyerModalDetailShowing = ref(false)
const isBuyerUpdating = ref(false)
const isReportModalOpen = ref(false)
const isImgUploading = ref(false)

const imgData = ref([])
const imgSrc = ref([])

const handleFileUpload = async e => {
  const imgSrcData = await base64Image(e.target.files[0])
  // only allow chat 1 image per time
  if(imgData.length === 0){
    imgData.value.push(e.target.files[0])
    imgSrc.value.push(imgSrcData)
  } else {
    imgData.value[0] = e.target.files[0]
    imgSrc.value[0] = imgSrcData
  }
}
const handleImageDeleted = (indx) => {
  imgData.value.splice(indx, 1)
  imgSrc.value.splice(indx, 1)
}

const curRole = computed(() => {
  return userStore.getRoleAndGetFromLocalStorageIfNotExist()
})

const closeBuyerModal = () => {
  isBuyerModalDetailShowing.value = false
}
const openBuyerModal = () => {
  isBuyerModalDetailShowing.value = true
}
const openReportModal = () => {
  isReportModalOpen.value = true
}
const closeReportModal = () => {
  isReportModalOpen.value = false
}

const onReportModalConfirm = (listImg, text) => {
  if (!text || !text.trim()) {
    toastOption.toastError('Bạn phải nhập nội dung tố cáo!')
  }
  closeReportModal()

  // Prepare data
  const formData = new FormData()
  const jsonData = {
    content: text,
  }

  for (const imgData of listImg) {
    formData.append('reportImages', imgData)
  }
  formData.append('createReportRequest', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }))

  if (curRole.value === Role.buyer.value) {
    reportInBuyerRole(formData)
    return
  }
  if (curRole.value === Role.seller.value) {
    reportInSellerRole(formData)
  }
}

const reportInBuyerRole = formData => {
  reportService
    .buyerReportSellerOption1(orderDetail.value.id, formData)
    .then(_ => toastOption.toastSuccess('Tố cáo thành công'))
    .catch(_ => toastOption.toastError('Tố cáo thất bại.'))
}
const reportInSellerRole = formData => {
  reportService
    .sellerReportBuyerOption1(orderDetail.value.id, formData)
    .then(_ => toastOption.toastSuccess('Tố cáo thành công'))
    .catch(_ => toastOption.toastError('Tố cáo thất bại.'))
}


const backLink = '/orders/immediate'
const scrollMessageBoxToBottom = async () => {
  await nextTick()
  const message = document.getElementById('messageBox')
  message.scrollTop = message.scrollHeight
}

// business functions
const onShippedClick = () => {
  if (confirm('Bạn có chắc chắn xác nhận đơn hàng đã giao tới bạn không?')) {
    onConfirmShipped()
  }
}

const onConfirmShipped = async () => {
  try {
    await orderService.updateStatus(groupInfo.value.order.statusOrder, groupInfo.value.order.id)
    toastOption.toastSuccess('Xác nhận đã nhận hàng thành công, đoạn chat sẽ được đóng.')
    closeBuyerModal()
    fetchChatInfo()
  } catch (_) {
    toastOption.toastError('Có lỗi hệ thống...')
  }
}

// chat functions
const sendMessage = async () => {
  try {
    let imageUrlIfExist
    if(imgData.value.length > 0){
      const imgFile = imgData.value[0]
      isImgUploading.value = true
      imageUrlIfExist = await firebaseStore.uploadImage(imgFile)
      isImgUploading.value = false
      imgData.value = []
      imgSrc.value = [] // reset the state
    }
  
    const messageData = textMessage.value
    textMessage.value = '' // reset the state
  
    if (messageData || imageUrlIfExist) {
      const payload = {
        fromUserId: userStore.getUserIdAndGetFromLocalStorageIfNotExist(),
        contentMessage: messageData,
        userRole: userStore.getRoleAndGetFromLocalStorageIfNotExist(),
        imageUrl: imageUrlIfExist
      }
      stompClient.publish({
        destination: `/app/chatV2/${groupId}`,
        body: JSON.stringify(payload),
      })
    }
  } catch (_) {
    toastOption.toastError("Có lỗi khi gửi tin nhắn, vui lòng tải lại trang và thử lại.")
  }
}

// init functions
const fetchAllMessages = async () => {
  groupId = route.params['groupId']
  const response = await ChatService.getAllChatMessage(groupId)
  messagesData.value = response.data
}
const fetchChatInfo = async () => {
  groupId = route.params['groupId']
  const response = await ChatService.getGroupInfo(groupId)
  groupInfo.value = response.data
  orderDetail.value = groupInfo.value.order
  sttChange.value = groupInfo.value.order.statusOrder
  curAddress.value = groupInfo.value.order.buyerAddress
  curPhone.value = groupInfo.value.order.buyerPhoneNumber
}
const initMessageDtos = async () => {
  await fetchAllMessages()
  messageDtos.value = messagesData.value.map(messData => {
    return {
      isFromSelf: messData.fromUser.id === userStore.getUserIdAndGetFromLocalStorageIfNotExist(),
      receiverRole: userStore.getRoleAndGetFromLocalStorageIfNotExist(),
      senderRole: messData.fromUser.role,
      message: messData.messageContent,
      img: messData.imageUrl,
      createAt: messData.createAt,
    }
  })
  scrollMessageBoxToBottom()
}
const initStompClient = () => {
  stompClient = new Client({
    brokerURL: urlConstant.ws.base,
    connectHeaders: {
      'X-Authorization': urlConstant.ws.authToken,
    },
    reconnectDelay: 100,
  })
  stompClient.onConnect = () => {
    //console.log('connected')
    subscription = stompClient.subscribe(`/topic/messages/group/${groupId}`, payload => {
      const response = JSON.parse(payload.body)
      const messageDtoAppend = {
        isFromSelf: response.fromUserId === userStore.getUserIdAndGetFromLocalStorageIfNotExist(),
        receiverRole: userStore.getRoleAndGetFromLocalStorageIfNotExist(),
        senderRole: response.userRole,
        message: response.contentMessage,
        img: response.imageUrl,
        createAt: moment().format("MM-DD-YYYY HH:mm:ss"),
      }
      messageDtos.value.push(messageDtoAppend)
      scrollMessageBoxToBottom()
    })
  }
  stompClient.onStompError = () => {
    console.log('Error')
  }
  stompClient.activate()
}

// Hook
onMounted(() => {
  initMessageDtos()
  initStompClient()
  fetchChatInfo()
  if (window.innerWidth < 800) {
    isSideBarShowing.value = false
  } else {
    isSideBarShowing.value = true
  }
})
onBeforeUnmount(() => {
  subscription?.unsubscribe()
  stompClient?.deactivate()
})
</script>

<template>
  <div class="flex h-screen antialiased text-gray-800">
    <div class="flex flex-row justify-between h-full w-full overflow-x-auto">
      <!-- Side bar -->
      <div
        class="transition-all flex flex-col justify-between py-4 w-12 overflow-hidden bg-white flex-shrink-0 rounded-r-2xl my-6"
        :class="isSideBarShowing ? 'px-6 !w-96' : 'h-20 py-4 items-center'">
        <div class="h-full flex flex-col justify-between" v-if="isSideBarShowing">
          <div class="h-full">
            <!-- User card -->
            <div class="flex flex-col">
              <UserMessageCard />
            </div>

            <!-- Actions -->
            <div class="flex flex-col mt-4">
              <div class="flex flex-row items-center justify-between">
                <span class="font-bold">Hành động</span>
              </div>
              <div class="flex flex-col space-y-1 mt-2">
                <!-- For buyer only -->
                <button
                  v-if="curRole === Role.buyer.value"
                  @click="openBuyerModal"
                  class="flex items-center justify-center text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mb-2">
                  Xem thông tin đơn hàng
                </button>
                <button
                  v-if="curRole === Role.buyer.value"
                  @click="onShippedClick"
                  class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 hover:cursor-pointer">
                  Đã nhận hàng
                </button>
                <button
                  @click="openReportModal"
                  class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">
                  Tố cáo
                </button>
              </div>
            </div>
            <!-- Helper -->
            <div class="border-[1px] rounded-lg py-2 mt-8 italic pl-2">
              <div class="mb-1">
                <span class="font-bold">Người bán: </span> khung avatar màu <span class="text-blue-800 font-bold">xanh dương</span>
              </div>
              <div class="mb-1">
                <span class="font-bold">Người mua: </span> khung avatar màu <span class="text-green-500 font-bold">xanh lá</span>
              </div>
              <div>
                <span class="font-bold">Người giải quyết (nếu có): </span> khung avatar màu <span class="text-red-500 font-bold">đỏ</span>
              </div>
            </div>
          </div>


          <!-- Back and hidden -->
          <div class="w-full">
            <button
              @click="isSideBarShowing = false"
              class="w-full flex items-center justify-center text-blue-700 hover:text-white border border-blue-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">
              <div>Ẩn</div>
            </button>
            <router-link
              :to="backLink"
              class="flex items-center justify-center text-blue-700 hover:text-white border border-blue-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">
              <div>
                <Icon icon="simple-line-icons:logout" class="text-[20px] mr-3" />
              </div>
              <div>Thoát</div>
            </router-link>
          </div>
        </div>
        <Tooltip placement="right" class="w-full h-full flex justify-center items-center mx-auto" v-else>
          <template #title>Mở rộng</template>
          <Icon icon="mingcute:right-fill" class="text-[24px]" @click="isSideBarShowing = true" />
        </Tooltip>
      </div>

      <div class="flex flex-col flex-auto h-full p-6">
        <div class="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
          <div class="flex flex-col h-full overflow-x-auto mb-4">
            <div class="flex flex-col h-full">
              <div class="grid grid-cols-12 gap-y-2 overflow-auto max-h-[90vh] scroll-smooth" id="messageBox">
                <MessageBubble
                  v-for="mess in messageDtos"
                  :key="mess.createAt"
                  :isSender="!mess.isFromSelf"
                  :message="mess.message"
                  :receiverRole="mess.receiverRole"
                  :senderRole="mess.senderRole"
                  :createAt="mess.createAt"
                  :img-src="mess.img"
                  />
              </div>
            </div>
          </div>
          <div v-if="isImgUploading" class="bg-white rounded-lg w-full h-[222px]">
            <Loading />
          </div>
          <div v-else class="rounded-xl w-full px-4">
            <div class="flex items-center w-full">
              <!-- Attach icon -->
              <div class="hover:cursor-pointer">
                <Icon
                  icon="teenyicons:attach-solid"
                  class="text-[24px] mr-3"
                  @click="() => $refs.file.click()"
                  @click.prevent/>
                <input type="file" hidden v-on:change="handleFileUpload($event)" ref="file" />
              </div>
              <!-- Input -->
              <div class="flex-grow">
                <input
                  v-model="textMessage"
                  @keypress.enter="sendMessage"
                  type="text"
                  class="flex w-full rounded-xl pl-4 h-10" />
              </div>
              <!-- Send icon -->
              <div class="ml-4">
                <button
                  @click="sendMessage"
                  class="flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-[50%] p-2 text-white flex-shrink-0">
                  <span class="ml-1">
                    <svg
                      class="w-4 h-4 transform rotate-45 -mt-px"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
            <div v-if="imgSrc.length > 0" class="mt-3">
              <ListEditableImage :img-src="imgSrc" @deleted="handleImageDeleted" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <BuyerOrderDetailModal
      :hidden="!(curRole === Role.buyer.value && isBuyerModalDetailShowing === true)"
      :detail="orderDetail"
      :isUpdating="isBuyerUpdating"
      :status="sttChange"
      @modal-declined="closeBuyerModal"
      @confirm-shipped="onConfirmShipped" />
    <ReportModal :hidden="!isReportModalOpen" @confirm="onReportModalConfirm" />
  </div>
</template>
