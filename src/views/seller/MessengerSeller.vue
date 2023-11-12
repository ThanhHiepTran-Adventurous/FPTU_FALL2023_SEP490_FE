<script setup>
import { Icon } from "@iconify/vue"
import { defaultRoute } from "@/common/constant";
import { computed, onBeforeUnmount, onMounted, ref, nextTick } from "vue";
import { OrderStatus, Role } from "@/common/contract";
import { useUserStore } from "@/stores/user.store";
import { useRoute } from "vue-router";
import { Client } from '@stomp/stompjs';
import urlConstant from "@/common/urlConstant";
import MessageBubble from "@/components/messenger/MessageBubble.vue";
import ChatService from "@/services/chat.service"
import UserMessageCard from "@/components/messenger/UserMessageCard.vue";
import { Tooltip } from 'ant-design-vue';
import SellerOrderDetailModal from "@/components/messenger/SellerOrderDetailModal.vue";
import orderService from "@/services/order.service";
import reportService from "@/services/report.service";
import toastOption from "@/utils/toast-option";
import ReportModal from "@/components/ReportModal.vue";
import ListEditableImage from "@/components/ListEditableImage.vue";
import ImageExtendModal from "@/components/ImageExtendModal.vue";

const userStore = useUserStore()
const route = useRoute()

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
const isSellerModalDetailShowing = ref(false)
const isBuyerUpdating = ref(false)
const isSellerUpdating = ref(false)
const isReportModalOpen = ref(false)

const imgData = ref([])
const imgSrc = ref([])

const handleFileUpload = async e => {
  imgData.value.push(e.target.files[0])
  imgSrc.value.push(await base64Image(e.target.files[0]))
}
const handleImageDeleted = (indx) => {
  imgData.value.splice(indx, 1)
  imgSrc.value.splice(indx, 1)
}

const curRole = computed(() => {
  return userStore.getRoleAndGetFromLocalStorageIfNotExist()
})
const closeSellerModal = () => {
  isSellerModalDetailShowing.value = false
}
const openSellerModal = () => {
  isSellerModalDetailShowing.value = true
}
const openReportModal = () => {
  isReportModalOpen.value = true
}
const closeReportModal = () => {
  isReportModalOpen.value = false
}

const onReportModalConfirm = (listImg, text) => {
  if(!text || !text.trim()){
    toastOption.toastError("Bạn phải nhập nội dung tố cáo!")
  }
  closeReportModal()

  // Prepare data
  const formData = new FormData()
  const jsonData = {
    content: text
  }

  for(const imgData of listImg){
    formData.append("reportImages", imgData)
  }
  formData.append("createReportRequest", new Blob([JSON.stringify(jsonData)], { type: 'application/json' }))

  if(curRole.value === Role.buyer.value){
    reportInBuyerRole(formData)
    return
  }
  if(curRole.value === Role.seller.value){
    reportInSellerRole(formData)
  }
}

const reportInBuyerRole = formData => {
  reportService.buyerReportSellerOption1(orderDetail.value.id, formData)
  .then(_ => toastOption.toastSuccess("Tố cáo thành công"))
  .catch(_ => toastOption.toastError("Tố cáo thất bại."))
}
const reportInSellerRole = formData => {
  reportService.sellerReportBuyerOption1(orderDetail.value.id, formData)
  .then(_ => toastOption.toastSuccess("Tố cáo thành công"))
  .catch(_ => toastOption.toastError("Tố cáo thất bại."))
}


const backLink = computed(() => {
  const role = userStore.getRoleAndGetFromLocalStorageIfNotExist()
  if (role === Role.admin.value) {
    return '/admin/dashboard'
  }
  if (role === Role.seller.value) {
    return '/manage/orders/immediate'
  }
  return '/orders/immediate'
})
const scrollMessageBoxToBottom = async () => {
  await nextTick()
  const message = document.getElementById('messageBox')
  message.scrollTop = message.scrollHeight
}


// business functions
const onChangeStatusClick = () => {
  if (confirm("Bạn có chắc chắn chuyển đơn hàng sang trạng thái tiếp theo không?")){
    onChangeStatus()
  }
}
const onChangeStatus = async () => {
  try {
    isBuyerUpdating.value = true
    await orderService.updateStatus(groupInfo.value.order.statusOrder, groupInfo.value.order.id)
    toastOption.toastSuccess('Cập nhật trạng thái đơn hàng thành công!')
    closeSellerModal()
    fetchChatInfo()
  } catch (_) {
    toastOption.toastError('Có lỗi hệ thống...')
  } finally {
    isBuyerUpdating.value = false
  }
}
const onUpdateDetail = async (messageData) => {
  if(confirm("Bạn có chắc chắn muốn cập nhật thông tin đơn hàng không?")){
    try {
      const payload = {
        buyerPhoneNumber: messageData.newPhone,
        buyerAddress: messageData.newAddress,
        sellerPhoneNumber: orderDetail.value.sellerPhoneNumber,
        sellerAddress: orderDetail.value.sellerAddress || ""
      }
      isSellerUpdating.value = true
      await orderService.updateAddressAndPhoneSellerOpt1(orderDetail.value.id, payload)
      toastOption.toastSuccess("Cập nhật thông tin đơn hàng thành công!")
      closeSellerModal()
      fetchChatInfo()
    } catch (_) {
    toastOption.toastError('Có lỗi hệ thống...')
    } finally {
      isSellerUpdating.value = false
    }
  }
}

// chat functions
const sendMessage = () => {
  const messageData = textMessage.value
  textMessage.value = ''
  if (messageData) {
    const payload = {
      fromUserId: userStore.getUserIdAndGetFromLocalStorageIfNotExist(),
      contentMessage: messageData,
    }
    stompClient.publish({
      destination: `/app/chatV2/${groupId}`,
      body: JSON.stringify(payload),
    })
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
    console.log('connected')
    subscription = stompClient.subscribe(`/topic/messages/group/${groupId}`, payload => {
      const response = JSON.parse(payload.body)
      const messageDtoAppend = {
        isFromSelf: response.fromUserId === userStore.getUserIdAndGetFromLocalStorageIfNotExist(),
        receiverRole: userStore.getRoleAndGetFromLocalStorageIfNotExist(),
        //senderRole: messData.fromUser.role,
        message: response.contentMessage,
        createAt: new Date().toString(),
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
        class="transition-all flex flex-col justify-between py-8 w-12 overflow-hidden bg-white flex-shrink-0 rounded-r-2xl my-6"
        :class="isSideBarShowing ? 'px-6 !w-96' : 'h-20 py-4 items-center'">
        <div class="h-full flex flex-col justify-between" v-if="isSideBarShowing">
          <div class="h-full">
            <div class="flex flex-col mt-8">
              <UserMessageCard />
            </div>
            <div class="flex flex-col mt-8">
              <div class="flex flex-row items-center justify-between">
                <span class="font-bold">Hành động</span>
              </div>
              <div class="flex flex-col space-y-1 mt-4">
                <!-- For seller only -->
                <button v-if="curRole === Role.seller.value" @click="openSellerModal()"
                  class="flex items-center justify-center text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mb-2">
                  Cập nhật thông tin đơn hàng
                </button>
                <button v-if="curRole === Role.seller.value" @click="onChangeStatusClick"
                  class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 hover:cursor-pointer">
                  Cập nhật trạng thái đơn hàng
                </button>
                <button
                  @click="openReportModal"
                  class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">
                  Tố cáo
                </button>
              </div>
            </div>
          </div>
          <div class="w-full">
            <button
              @click="isSideBarShowing = false"
              class="w-[328px] flex items-center justify-center text-blue-700 hover:text-white border border-blue-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
              <div>Ẩn</div>
            </button>
            <router-link
              :to="backLink"
              class="flex items-center justify-center text-blue-700 hover:text-white border border-blue-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
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
                  :createAt="mess.createAt" />
              </div>
            </div>
          </div>
          <div class="rounded-xl w-full px-4">
            <div class="flex items-center w-full">
              <!-- Attach icon -->
              <div>
                <Icon icon="teenyicons:attach-solid" class="text-[24px] mr-3"/>
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
                  @click="() => sendMessage()"
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
    <SellerOrderDetailModal
      :hidden="!(curRole === Role.seller.value && isSellerModalDetailShowing === true)"
      :detail="orderDetail"
      :isUpdating="isSellerUpdating"
      :status="sttChange"
      :address="curAddress"
      :phone="curPhone"
      @modal-declined="closeSellerModal"
      @update-status="onChangeStatus"
      @update-detail="onUpdateDetail"
    />
    <ReportModal :hidden="!isReportModalOpen" @confirm="onReportModalConfirm"/>
  </div>
</template>
