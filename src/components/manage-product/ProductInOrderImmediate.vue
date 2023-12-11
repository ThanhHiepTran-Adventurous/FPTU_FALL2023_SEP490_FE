<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import Modal from '../common-components/Modal.vue'
import formatCurrency from '@/utils/currency-output-formatter'
import moment from 'moment'
import imageHelper from '@/utils/image-helper'
import { AuctionModelType, OrderStatus } from '@/common/contract'
import { Icon } from '@iconify/vue'
import Button from '@/components/common-components/Button.vue'
import constant, { sellerTabs } from '@/common/constant'
import OrderService from '@/services/order.service'
import ItemOrder from '../common-components/item-box/ItemOrder.vue'
import OrderTimeline from '../OrderTimeline.vue'
import { useRouter } from 'vue-router'
import SellerSideBarLayout from '@/layouts/SellerSideBarLayout.vue'
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import TwoOptionsTab from '../TwoOptionsTab.vue'
import Loading from '../common-components/Loading.vue'

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

const isLoading = ref(false)
const isModalVisible = ref(false)
const isUpdating = ref(false)
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

const filterData = () => {
  ordersFiltered.value = orders.value
    .filter(v => v.modelTypeAuctionOfOrder === AuctionModelType.immediate)
    .sort((a, b) => {
      return new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
    })
}

// Update status
const updateOrderStatus = async () => {
  isUpdating.value = true
  await OrderService.updateStatus(detail.value.statusOrder, detail.value.id)
  closeModal()
  fetchOrders()
  isUpdating.value = false
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
  isLoading.value = true
  const response = await OrderService.getAllOrders('', 1, 1000, '')
  isLoading.value = false
  orders.value = response.data ? response.data : []
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
        <!-- Header -->
        <div class="pt-3 px-5 pb-1 flex items-center justify-between">
          <div class="font-bold text-2xl text-black text-blue-800 flex">
            <div>
              Đơn hàng
            </div>
          </div>
          <TwoOptionsTab
            immediate-option-nav="/manage/orders/immediate"
            intermediate-option-nav="/manage/orders/intermediate"
            :cur-tab="AuctionModelType.immediate"
          />
        </div>
        <!-- Filter -->
        <div class="mb-4 mx-5 mt-4">
          <div class="mt-3 flex items-center gap-3">
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
        <Loading v-if="isLoading" />
        <div v-else class="mx-5 flex flex-wrap gap-2">
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
                      <td class="py-2 px-4 border-b border-grey-light">
                        {{ detail?.buyerAddress ? detail.buyerAddress : 'N/A' }}
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                        Số điện thoại :
                      </td>
                      <td class="py-2 px-4 border-b border-grey-light">
                        {{ detail?.buyerPhoneNumber ? detail.buyerPhoneNumber : 'N/A' }}
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
                        Cập nhật lúc :
                      </td>
                      <td class="py-2 px-4 border-b border-grey-light">
                        {{
                          detail?.lastUpdatedAt
                            ? moment.utc(detail?.lastUpdatedAt).format('DD/MM/YYYY HH:mm:ss')
                            : 'N/A'
                        }}
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
            <div v-if="detail?.modelTypeAuctionOfOrder === AuctionModelType.immediate">
              <Button
                :disabled="
                  isUpdating ||
                  detail?.statusOrder === OrderStatus.CONFIRM_DELIVERY.value ||
                  detail?.statusOrder === OrderStatus.DONE.value
                "
                @on-click="updateOrderStatus">
                <div class="flex items-center">
                  <div>Cập nhật trạng thái đơn hàng</div>
                </div>
              </Button>
            </div>
            <div v-else>
              <Button
                :disabled="
                  isUpdating ||
                  detail?.statusOrder === OrderStatus.CONFIRM_DELIVERY.value ||
                  detail?.statusOrder === OrderStatus.DONE.value
                "
                @on-click="updateOrderStatus">
                <div class="flex items-center">
                  <div>Yêu cầu rút tiền</div>
                </div>
              </Button>
            </div>
            <div>
              <Button
                v-if="detail?.modelTypeAuctionOfOrder !== AuctionModelType.immediate"
                :disabled="isUpdating || detail?.statusOrder === OrderStatus.CONFIRM_DELIVERY.value">
                <div class="flex items-center">
                  <div>Tạo yêu cầu giao hàng</div>
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
        </Modal>
      </div>
    </SellerSideBarLayout>
  </div>
</template>
