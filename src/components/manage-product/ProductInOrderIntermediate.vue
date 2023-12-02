<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import SearchInput from '../common-components/SearchInput.vue'
import Modal from '../common-components/Modal.vue'
import formatCurrency from '@/utils/currency-output-formatter'
import moment from 'moment'
import imageHelper from '@/utils/image-helper'
import { AuctionModelType, OrderStatus, ShipRequestType } from '@/common/contract'
import { Icon } from '@iconify/vue'
import Dropdown from '../common-components/Dropdown.vue'
import Button from '@/components/common-components/Button.vue'
import constant, { sellerTabs } from '@/common/constant'
import OrderService from '@/services/order.service'
import ItemOrder from '../common-components/item-box/ItemOrder.vue'
import OrderTimeline from '../OrderTimeline.vue'
import { useRouter } from 'vue-router'
import ShipRequestService from '@/services/shiprequest.service'
import toastOption from '@/utils/toast-option'
import withdraw from '../../services/withdraw.service'
import ReportService from '@/services/report.service'
import ReportModal from '@/components/ReportModal.vue'
import ShippingStatusIntermediate from '../common-components/badge/ShippingStatusIntermediate.vue'
import SellerSideBarLayout from '@/layouts/SellerSideBarLayout.vue'
import Breadcrumb from '@/layouts/Breadcrumb.vue'

const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Đơn hàng',
    to: '',
    disabled: true,
  },
]

const router = useRouter()

const orders = ref([])
const ordersFiltered = ref([])
const detail = ref(null)

const isModalVisible = ref(false)
const isUpdating = ref(false)
const isReportModalOpen = ref(false)
const openReportModal = () => {
  isReportModalOpen.value = true
}
const closeReportModal = () => {
  isReportModalOpen.value = false
}
// Filter
const options = ref([
  {
    label: 'Tự trao đổi',
    value: AuctionModelType.immediate,
  },
  {
    label: 'Trung gian qua hệ thống',
    value: AuctionModelType.intermediate,
  },
])

const selected = ref({
  label: 'Trung gian qua hệ thống',
  value: AuctionModelType.intermediate,
})
watch(selected, newVal => {
  if (newVal.value === AuctionModelType.immediate) {
    router.push('/manage/orders/immediate')
  }
})
const filterData = async () => {
  ordersFiltered.value = orders.value
    .filter(v => v.modelTypeAuctionOfOrder === selected.value.value)
    .sort((a, b) => {
      return new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
    })
}
const currentPage = ref(1)
const searchQuery = ref('')
const itemsPerPage = 6
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
      product.productResponse?.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    ).length / itemsPerPage,
  )
})
const paginatedProducts = computed(() => {
  // Move startIndex and endIndex calculation here
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return ordersFiltered.value
    .filter(product => product.productResponse?.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .slice(startIndex, endIndex)
})
// Business functions
const handleDepositRequest = async orderId => {
  try {
    await withdraw.sellerWithdrwaOpt2(orderId)
    toastOption.toastSuccess('Tạo yêu cầu rút tiền thành công')
  } catch (error) {
    toastOption.toastError('Tạo yêu cầu rút tiền thất bại')
    console.error('Error creating ship request:', error)
  }
}
const handleCreateShipRequest = async orderId => {
  try {
    closeModal()
    await ShipRequestService.sellerCreateShipRequest(orderId)
    toastOption.toastSuccess('Tạo yêu cầu giao hàng thành công')
    fetchOrders()
  } catch (error) {
    toastOption.toastError('Tạo yêu cầu giao hàng thất bại')
    console.error('Error creating ship request:', error)
  }
}

// Page operations
const activateInfoAuction = order => {
  detail.value = order
  isModalVisible.value = true
}
function closeModal() {
  isModalVisible.value = false
}
function handleConfirm() {
  closeModal()
}

const fetchOrders = async () => {
  const response = await OrderService.getAllOrders('', 1, 1000, '')
  orders.value = response.data
    ? response.data.map(f => {
        if (!f.shipRequestList) {
          return f
        }
        if (f.shipRequestList.length === 1) {
          f.sellerShipRequest = f.shipRequestList[0]
          return f
        }
        if (f.shipRequestList.length === 2) {
          f.sellerShipRequest = f.shipRequestList.filter(d => d.type === ShipRequestType.SELLER_SHIP)[0]
          f.buyerShipRequest = f.shipRequestList.filter(d => d.type === ShipRequestType.BUYER_RETURN)[0]
        }
        return f
      })
    : []
  filterData()
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="w-full">
    <!-- Breadcrumb -->
    <div class="pt-2 pb-2 container mx-auto">
      <Breadcrumb :items="breadcrumbItems" />
    </div>

    <!-- Main content -->
    <SellerSideBarLayout :cur-tab="sellerTabs.orders.value">
      <div class="container py-2 mx-auto bg-white rounded-md min-h-[80vh]">
        <div class="mb-4 mx-5 mt-4">
          <div class="mt-3 flex items-center gap-3">
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
        <div class="flex flex-wrap items-center mx-5 gap-3">
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
            :statusReturnRequest="item.buyerShipRequest?.status"
            :is-completed="item.statusOrder === OrderStatus.DONE.value"
            :chatGroupId="item.chatGroupDTOs.id ? item.chatGroupDTOs.id : ''"
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
        <Modal
          :hidden="!isModalVisible"
          :widthClass="'w-[900px]'"
          :hasOverFlowVertical="true"
          :hasButton="true"
          title="Chi tiết"
          @decline-modal="closeModal"
          @confirm-modal="handleConfirm">
          <div class="flex-1 bg-gray rounded-lg mx-1 my-1">
            <div class="relative mx-2">
              <div class="mx-auto container align-middle">
                <div class="text-xl font-bold ml-5 underline mb-2">Thông tin đơn hàng</div>
                <table class="w-full table-auto text-lg">
                  <tbody>
                    <tr>
                      <td
                        class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                        Tên Sản Phẩm :
                      </td>
                      <td class="py-2 px-4 border-b border-grey-light">{{ detail?.productResponse.name }}</td>
                    </tr>
                    <tr>
                      <td
                        class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                        Giá tiền :
                      </td>
                      <td class="py-2 px-4 border-b border-grey-light">{{ formatCurrency(detail?.price) }}</td>
                    </tr>
                    <tr>
                      <td
                        class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                        Địa chỉ :
                      </td>
                      <td class="py-2 px-4 border-b border-grey-light">{{ detail?.buyerAddress }}</td>
                    </tr>
                    <tr>
                      <td
                        class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                        Số điện thoại :
                      </td>
                      <td class="py-2 px-4 border-b border-grey-light">
                        {{ detail?.buyerPhoneNumber }}
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                        Tạo lúc :
                      </td>
                      <td class="py-2 px-4 border-b border-grey-light">
                        {{ detail?.createAt ? moment.utc(detail?.createAt).format('DD/MM/YYYY HH:mm:ss') : 'N/A' }}
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                        Cập nhật lúc:
                      </td>
                      <td class="py-2 px-4 border-b border-grey-light">
                        {{
                          detail?.lastUpdatedAt
                            ? moment.utc(detail?.lastUpdatedAt).format('DD/MM/YYYY HH:mm:ss')
                            : 'N/A'
                        }}
                      </td>
                    </tr>
                    <tr v-if="detail?.sellerShipRequest">
                      <td
                        class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                        Trạng thái giao hàng:
                      </td>
                      <td class="py-2 px-4 border-b border-grey-light">
                        <ShippingStatusIntermediate :status="detail?.sellerShipRequest.status" />
                      </td>
                    </tr>
                    <tr v-if="detail?.buyerShipRequest">
                      <td
                        class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                        Trạng thái trả hàng:
                      </td>
                      <td class="py-2 px-4 border-b border-grey-light">
                        <ShippingStatusIntermediate :status="detail?.buyerShipRequest.status" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="mx-auto container align-middle mt-8">
                <div class="text-xl font-bold ml-5 underline mb-4">Trạng thái đơn hàng</div>
                <div class="ml-8">
                  <OrderTimeline :curStatus="detail?.statusOrder" />
                </div>
              </div>
            </div>
          </div>
          <template #button>
            <div>
              <Button :type="constant.buttonTypes.OUTLINE" @on-click="closeModal"> Hủy </Button>
            </div>
            <div>
              <Button
                :disabled="
                  isUpdating ||
                  detail?.statusOrder === OrderStatus.CONFIRM_DELIVERY.value ||
                  detail?.statusOrder !== OrderStatus.DONE.value
                "
                @on-click="handleDepositRequest(detail?.id)">
                <div class="flex items-center">
                  <div>Yêu cầu rút tiền</div>
                </div>
              </Button>
            </div>
            <div>
              <Button
                v-if="detail?.modelTypeAuctionOfOrder !== AuctionModelType.immediate && !detail?.hasShipRequest"
                :disabled="isUpdating || detail?.statusOrder === OrderStatus.CONFIRM_DELIVERY.value"
                @on-click="handleCreateShipRequest(detail?.id)">
                <div class="flex items-center">
                  <div>Tạo yêu cầu giao hàng</div>
                </div>
              </Button>
            </div>
          </template>
        </Modal>
      </div>
    </SellerSideBarLayout>
  </div>
</template>
