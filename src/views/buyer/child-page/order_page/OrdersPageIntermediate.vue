<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import SearchInput from '@/components/common-components/SearchInput.vue'
import Modal from '@/components/common-components/Modal.vue'
import formatCurrency from '@/utils/currency-output-formatter'
import moment from 'moment'
import imageHelper from '@/utils/image-helper'
import { AuctionModelType, OrderStatus, ShipRequestType, StatusShipRequest } from '@/common/contract'
import { Icon } from '@iconify/vue'
import { base64Image } from '@/utils/imageFile'
import Button from '@/components/common-components/Button.vue'
import constant, { buyerTabs } from '@/common/constant'
import OrderService from '@/services/order.service'
import ItemOrder from '@/components/common-components/item-box/ItemOrder.vue'
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import SideBarLayout from '../../../../layouts/BuyerSideBarLayout.vue'
import TwoOptionsTab from '@/components/TwoOptionsTab.vue'
import ReportModal from '@/components/ReportModal.vue'
import toastOption from '@/utils/toast-option'
import ReportService from '@/services/report.service'
import ListImage from '@/components/ListEditableImage.vue'
import Dropdown from '@/components/common-components/Dropdown.vue'
import ShippingStatusIntermediate from '@/components/common-components/badge/ShippingStatusIntermediate.vue'
import shiprequestService from '@/services/shiprequest.service'
import feedbackService from '@/services/feedback.service'
import Loading from '@/components/common-components/Loading.vue'

const isLoading = ref(false)

const orders = ref([])
const ordersFiltered = ref([])

const detail = ref(null)
const isRefunable = ref(false)
const isConfirmable = ref(false)

const isModalVisible = ref(false)
const isRatingVisible = ref(false)
const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Đã mua',
    to: '/orders/intermediate',
    disabled: true,
  },
]

// Filter
const options = ref([
  {
    label: 'Đã có yêu cầu giao hàng',
    value: true,
  },
  {
    label: 'Chưa có yêu cầu giao hàng',
    value: false,
  },
])
const selectedStars = ref(0)
const maxStars = ref(5)

const selectRating = stars => {
  selectedStars.value = stars
}

const selected = ref({
  label: 'Đã có yêu cầu giao hàng',
  value: true,
})
watch(selected, newVal => {
  filterData()
})

const isReportModalOpen = ref(false)
const openReportModal = () => {
  isReportModalOpen.value = true
}
const closeReportModal = () => {
  isReportModalOpen.value = false
}
const filterData = () => {
  ordersFiltered.value = orders.value
    .filter(
      v => v.modelTypeAuctionOfOrder === AuctionModelType.intermediate && v.hasShipRequest === selected.value.value,
    )
    .sort((a, b) => {
      return new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
    })
}

const activateInfoAuction = order => {
  detail.value = order
  isRefunable.value = order.sellerShipRequest?.status === StatusShipRequest.delivered.value && !order.haveBuyerReturn
  isConfirmable.value = order.sellerShipRequest?.status === StatusShipRequest.delivered.value && !order.haveBuyerReturn
  isModalVisible.value = true
}
const activateRatingModel = () => {
  isRatingVisible.value = true
  isModalVisible.value = false
}
function closeModal() {
  isConfirmable.value = false
  isRefunable.value = false
  isModalVisible.value = false
}
function closeRatingModal() {
  isRatingVisible.value = false
}
function handleConfirm() {
  closeModal()
}
const currentPage = ref(1)
const searchQuery = ref('')
const itemsPerPage = 10
const goToPage = page => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}
const totalPages = computed(() => {
  return Math.ceil(
    ordersFiltered.value.filter(product =>
      product?.productResponse?.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    ).length / itemsPerPage,
  )
})
const paginatedProducts = computed(() => {
  // Move startIndex and endIndex calculation here
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return ordersFiltered.value
    .filter(product => product?.productResponse?.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .slice(startIndex, endIndex)
})
const fetchOrders = async () => {
  isLoading.value = true
  const response = await OrderService.getAllOrders('', 1, 1000, '')
  isLoading.value = false
  orders.value = response.data
    ? response.data.map(f => {
        if (!f.shipRequestList) {
          return f
        }
        if (f.shipRequestList.length === 1) {
          f.sellerShipRequest = f.shipRequestList[0]
        }
        if (f.shipRequestList.length === 2) {
          f.sellerShipRequest = f.shipRequestList.filter(data => data.type === ShipRequestType.SELLER_SHIP)[0]
          f.buyerShipRequest = f.shipRequestList.filter(data => data.type === ShipRequestType.BUYER_RETURN)[0]
        }
        return f
      })
    : []
  filterData()
}
const onReportModalDecline = () => {
  closeReportModal()
}
const onReportModalConfirm = async (listImg, text) => {
  if (!text) {
    toastOption.toastError('Bạn phải nhập nội dung tố cáo!')
  }
  // closeReportModal()
  if (!Array.isArray(listImg)) {
    toastOption.toastError('Invalid image list')
    return
  }
  // Prepare data
  const formData = new FormData()
  const jsonData = {
    content: text,
  }

  for (const imgData of listImg) {
    formData.append('reportImages', imgData)
  }
  formData.append('createReportRequest', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }))

  try {
    closeModal()
    closeReportModal()
    const toastId = toastOption.toastLoadingMessage('Đang gửi yêu cầu lên hệ thống...')
    await ReportService.buyerReportSellerOpt2(detail.value.id, formData)
    toastOption.updateLoadingToast(toastId, 'Gửi yêu cầu thành công', false)
    fetchOrders()
  } catch (error) {
    if (error.response.data.message.includes('already reported')) {
      toastOption.updateLoadingToast(
        toastId,
        'Bạn đã gửi yêu cầu cho đơn hàng này rồi, vui lòng không gửi lại yêu cầu.',
        true,
      )
      return
    }
    toastOption.toastError('Tố cáo thất bại')
    console.error('Error creating ship request:', error)
  }
}
const onConfirmOrder = async shipRequestId => {
  try {
    closeModal()
    await shiprequestService.buyerConfirmShipRequestDone(shipRequestId)
    toastOption.toastSuccess('Chấp nhận đơn hàng thành công')
    fetchOrders()
  } catch (error) {
    toastOption.toastError('Có lỗi khi xử lý, vui lòng thử lại sau.')
    console.log(error)
  }
}

onMounted(() => {
  fetchOrders()
})
const imgSrc = ref([])
const imgData = ref([])

const formData = ref({
  content: '',
  rate: '',
  productId: '',
})
const resetFormData = () => {
  formData.value = {
    content: '',
    rate: '',
    productId: '',
  }
  imgSrc.value = []
  imgData.value = []
  selectedStars.value = 0
}
const submitRating = async () => {
  if(!confirm("Bạn có chắc chắn muốn gửi đánh giá không?")){
    return
  }
  const request = {
    content: formData.value.content,
    rate: selectedStars.value,
    productId: detail.value?.productResponse?.id,
  }
  const toastId = toastOption.toastLoadingMessage("Đang gửi đánh giá...")
  try {
    await feedbackService.buyerCreateFeedBack(request).finally(() => {
      resetFormData()
      closeRatingModal()
    })
    toastOption.updateLoadingToast(toastId, 'Gửi đánh giá thành công', false)
  } catch (error) {
    toastOption.updateLoadingToast(toastId, error.response.data.message, true)
  }
}
</script>

<template>
  <div class="w-full">
    <div class="pt-2 pb-2 container mx-auto">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
    <SideBarLayout :cur-tab="buyerTabs.order.value">
      <div class="bg-white container mx-auto rounded min-h-[80vh] w-full">
        <!-- Header -->
        <div class="pt-3 px-3 pb-1 flex items-center justify-between">
          <div class="font-bold text-2xl text-black text-blue-800">Lịch sử đơn hàng</div>
          <div>
            <TwoOptionsTab
              immediate-option-nav="/orders/immediate"
              intermediate-option-nav="/orders/intermediate"
              :cur-tab="AuctionModelType.intermediate" />
          </div>
        </div>

        <!-- Filter -->
        <div class="mb-2 mx-3 pt-3">
          <div class="flex items-center gap-3">
            <Dropdown v-model="selected" :data="options" class="!w-[300px]" />
            <div class="w-full">
              <input
                v-model="searchQuery"
                type="text"
                id="simple-search"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Tìm kiếm sản phẩm theo tên"
                required="" />
            </div>
          </div>
        </div>
        <Loading v-if="isLoading"/>
        <div v-else class="flex flex-wrap items-center mx-5 gap-3 py-6">
          <ItemOrder
            v-for="item in paginatedProducts"
            :key="item.id"
            @click="activateInfoAuction(item)"
            :product-name="item.productResponse.name"
            :price="item.price"
            :mainImage="imageHelper.getPrimaryImageFromList(item.productResponse.imageUrls)"
            :secondaryImage="imageHelper.getSecondaryImageFromList(item.productResponse.imageUrls)"
            :auction-type="item.modelTypeAuctionOfOrder"
            :orderId="item.id"
            :statusShipRequest="item.sellerShipRequest?.status"
            :is-completed="item.statusOrder === OrderStatus.DONE.value"
            :statusReturnRequest="item.buyerShipRequest?.status"
            :chatGroupId="item.chatGroupDTOs.id"
            :created-at="item?.createAt ? moment.utc(item?.createAt).format('DD/MM/YYYY HH:mm:ss') : 'N/A'" />
        </div>
        <nav
          class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
          aria-label="Table navigation">
          <ul class="inline-flex items-stretch -space-x-px">
            <li>
              <button
                type="button"
                class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                @click="goToPreviousPage"
                :disabled="currentPage === 1"
                aria-label="Previous Page">
                <span class="sr-only">Previous</span>
                <svg
                  class="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </li>
            <!-- Generate pagination links -->
            <li v-for="pageNumber in totalPages" :key="pageNumber">
              <button
                type="button"
                class="flex items-center justify-center text-sm py-2 px-3 leading-tight"
                :class="{
                  'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white':
                    pageNumber !== currentPage,
                  'text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white':
                    pageNumber === currentPage,
                }"
                @click="goToPage(pageNumber)"
                aria-label="Page {{ pageNumber }}">
                {{ pageNumber }}
              </button>
            </li>
            <li>
              <button
                type="button"
                @click="goToNextPage"
                class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                :disabled="currentPage === totalPages"
                aria-label="Next Page">
                <span class="sr-only">Next</span>
                <svg
                  class="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewbox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </SideBarLayout>
    <Modal
      :hidden="!isRatingVisible"
      :widthClass="'w-[500px]'"
      :hasOverFlowVertical="true"
      :hasButton="true"
      button-label="Gửi"
      :title="`Đánh giá sản phẩm ${detail?.productResponse?.name}`"
      @decline-modal="closeRatingModal"
      @confirm-modal="submitRating">
      <div class="bg-gray rounded-lg mx-1 my-1">
        <div class="relative mb-2 px-2">
          <div class="mx-auto container align-middle">
            <form class="max-w-sm mx-auto">
              <div class="flex items-center">
                <template v-for="index in maxStars" :key="index">
                  <svg
                    @click="selectRating(index)"
                    :class="{
                      'w-4 h-4 text-yellow-300 cursor-pointer': index <= selectedStars,
                      'w-4 h-4 text-gray-300 cursor-pointer': index > selectedStars,
                    }"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20">
                    <path
                      d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                </template>
              </div>
              <textarea
                v-model="formData.content"
                id="message"
                rows="4"
                class="block p-2.5 mt-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Ghi đánh giá tại đây"></textarea>
            </form>
          </div>
        </div>
      </div>
    </Modal>

    <Modal
      :hidden="!isModalVisible"
      :widthClass="'w-[900px]'"
      :hasOverFlowVertical="true"
      :hasButton="true"
      title="Chi tiết"
      @decline-modal="closeModal"
      @confirm-modal="handleConfirm">
      <div class="bg-gray rounded-lg mx-1 my-1">
        <div class="relative mb-2 px-2">
          <div class="mx-auto container align-middle">
            <div class="flex items-center gap-3 mb-2">
              <div class="text-xl font-bold ml-5 underline mr-3">Thông tin đơn hàng</div>
              <div
                v-if="detail?.statusOrder === OrderStatus.DONE.value"
                class="bg-green-100 text-green-800 border-[1px] border-green-500 text-[20px] font-medium inline-flex items-center gap-2 px-2.5 py-0.5 rounded">
                <Icon icon="clarity:success-standard-solid" />
                <div>Đã hoàn tất</div>
              </div>
            </div>

            <table class="w-full table-auto text-lg">
              <tbody>
                <tr>
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Tên Sản Phẩm
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">{{ detail?.productResponse.name }}</td>
                </tr>
                <tr>
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Giá tiền
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">{{ formatCurrency(detail?.price) }}</td>
                </tr>
                <tr>
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Địa chỉ
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">{{ detail?.buyerAddress }}</td>
                </tr>
                <tr>
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Số điện thoại
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">
                    {{ detail?.buyerPhoneNumber }}
                  </td>
                </tr>
                <tr>
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Tạo lúc
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">
                    {{ detail?.createAt ? moment.utc(detail?.createAt).format('DD/MM/YYYY HH:mm:ss') : 'N/A' }}
                  </td>
                </tr>
                <tr>
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Cập nhật lúc
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">
                    {{
                      detail?.lastUpdatedAt ? moment.utc(detail?.lastUpdatedAt).format('DD/MM/YYYY HH:mm:ss') : 'N/A'
                    }}
                  </td>
                </tr>
                <tr v-if="detail?.sellerShipRequest">
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Trạng thái giao hàng
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">
                    <ShippingStatusIntermediate :status="detail?.sellerShipRequest.status" />
                  </td>
                </tr>
                <tr v-if="detail?.buyerShipRequest">
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Trạng thái trả hàng
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">
                    <ShippingStatusIntermediate :status="detail?.buyerShipRequest.status" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <template #button>
        <div>
          <Button :type="constant.buttonTypes.OUTLINE" @on-click="closeModal"> Đóng </Button>
        </div>
        <div v-if="detail?.statusOrder === OrderStatus.DONE.value">
          <Button :type="constant.buttonTypes.OUTLINE" @click="activateRatingModel"> Đánh giá </Button>
        </div>
        <div>
          <Button :disabled="!isRefunable || detail?.statusOrder === OrderStatus.DONE.value" @on-click="openReportModal">
            <div class="flex items-center">
              <div>Yêu cầu trả hàng</div>
            </div>
          </Button>
        </div>
        <div>
          <Button
            :disabled="!isConfirmable || detail?.statusOrder === OrderStatus.DONE.value"
            @on-click="onConfirmOrder(detail?.sellerShipRequest.id)">
            <div class="flex items-center">
              <div>Chấp nhận đơn hàng</div>
            </div>
          </Button>
        </div>
        <div v-if="detail?.modelTypeAuctionOfOrder === AuctionModelType.immediate">
          <router-link :to="`/messenger/${detail?.chatGroupDTOs.id}`">
            <Button>
              <div class="flex items-center">
                <Icon icon="uiw:message" class="text-[18px] mr-3" />
                <div>Nhắn tin</div>
              </div>
            </Button>
          </router-link>
        </div>
      </template>
      <ReportModal :hidden="!isReportModalOpen" @confirm="onReportModalConfirm" @decline="onReportModalDecline" />
    </Modal>
  </div>
</template>
