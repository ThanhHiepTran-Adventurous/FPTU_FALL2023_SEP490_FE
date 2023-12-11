<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import auctionService from '@/services/auction.service'
import Modal from '../common-components/Modal.vue'
import formatCurrency from '@/utils/currency-output-formatter'
import moment from 'moment'
import ItemSold from '../common-components/item-box/ItemSold.vue'
import imageHelper from '@/utils/image-helper'
import { AuctionModelType, ProductStatus } from '@/common/contract'
import { Icon } from '@iconify/vue'
import Dropdown from '../common-components/Dropdown.vue'
import Button from '@/components/common-components/Button.vue'
import constant, { sellerTabs } from '@/common/constant'
import { useRoute, useRouter } from 'vue-router'
import Loading from '../common-components/Loading.vue'
import SellerSideBarLayout from '@/layouts/SellerSideBarLayout.vue'
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import TwoOptionsTab from '../TwoOptionsTab.vue'
import { Tooltip } from 'ant-design-vue'
import { intermediateScriptBoughtPageSeller } from '@/common/commonStaticState'
import { useSystemStore } from '@/stores/system-config.store'

const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Đang đấu giá',
    to: '',
    disabled: true,
  },
]

const systemStore = useSystemStore()

const itemsPerPage = 15
const searchQuery = ref('')
const route = useRoute()
const currentPage = ref(1)
const auctions = ref([])
const auctionsFiltered = ref([])

const isLoading = ref(false)
const isModalVisible = ref(false)
const isPaymentLoading = ref(false)
const detail = ref(null)

let responeCode = ref('')
let transactionStatus = ref('')
const getQueryParameters = () => {
  const queryParams = route.query

  responeCode.value = queryParams.vnp_ResponseCode
  transactionStatus.value = queryParams.vnp_TransactionStatus
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
  label: 'Tự trao đổi',
  value: AuctionModelType.immediate,
})
watch(selected, newVal => {
  filterData()
})
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
// Computed property for total pages
const totalPages = computed(() => {
  return Math.ceil(
    auctionsFiltered.value.filter(product =>
      product.product.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    ).length / itemsPerPage,
  )
})
const paginatedProducts = computed(() => {
  // Move startIndex and endIndex calculation here
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return auctionsFiltered.value
    .filter(product => product.product.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .slice(startIndex, endIndex)
})
const fetchAuctions = async () => {
  isLoading.value = true
  const query = 'status:COMPLETED'
  const response = await auctionService.getAuctionBySeller(query)
  auctions.value = response.data ? response.data : []
  filterData()
  isLoading.value = false
}
const filterData = () => {
  auctionsFiltered.value = auctions.value.filter(
    v => v.modelType === AuctionModelType.intermediate
     && v.product.status !== ProductStatus.PAID.value
      && v.product.status !== ProductStatus.SOLD.value
  )
}

const calculateIsInvalidSold = auction => {
  return auction?.product.status === ProductStatus.NOT_REACH_NUM_AUCTIONEER.value
}

const activateInfoAuction = auction => {
  isModalVisible.value = true
  detail.value = auction
  detail.value.isExpired = calculateIsExpired(detail.value)
  detail.value.isInvalidSold = calculateIsInvalidSold(detail.value)
}

function closeModal() {
  isModalVisible.value = false
}

function handleConfirm() {
  closeModal()
}
const calculateIsExpired = auction => {
  return moment.utc(auction.endDate).add(systemStore.PaymentDeadline, 'days').isBefore(moment(new Date()))
}
onMounted(() => {
  fetchAuctions()
  getQueryParameters()
})
</script>

<template>
  <div class="w-full">
    <!-- Breadcrumb -->
    <div class="pt-2 pb-2 container mx-auto">
      <Breadcrumb :items="breadcrumbItems" />
    </div>

    <!-- Main content -->
    <SellerSideBarLayout :cur-tab="sellerTabs.onAuctioned.value">
      <div class="container py-2 mx-auto bg-white rounded-md min-h-[80vh]">
        <!-- Header -->
        <div class="pt-3 px-5 pb-1 flex items-center justify-between">
          <div class="font-bold text-2xl text-black text-blue-800 flex">
            <div>
              Đấu giá hoàn thành
            </div>
            <Tooltip class="relative ml-3" placement="rightBottom">
              <template #title>{{ intermediateScriptBoughtPageSeller }}</template>
              <Icon icon="ooui:notice" class="text-[15px] text-yellow-300" />
            </Tooltip>
          </div>
          <TwoOptionsTab
            immediate-option-nav="/manage/auctioned/immediate"
            intermediate-option-nav="/manage/auctioned/intermediate"
            :cur-tab="AuctionModelType.intermediate"
          />
        </div>
        <!-- Search -->
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
        <!-- Data -->
        <Loading v-if="isLoading" />
        <div v-else class="flex flex-wrap items-center mx-5 gap-2">
          <ItemSold
            v-for="item in paginatedProducts"
            :key="item.id"
            @click="activateInfoAuction(item)"
            :product-name="item.product.name"
            :price="item.highestPrice"
            :mainImage="imageHelper.getPrimaryImageFromList(item.product.imageUrls)"
            :secondaryImage="imageHelper.getSecondaryImageFromList(item.product.imageUrls)"
            :auction-type="item.modelType"
            :is-invalid-sold="calculateIsInvalidSold(item)"
            :is-expired="calculateIsExpired(item)" />
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
        <div>
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
                  <div
                    class="flex w-full justify-around p-2 rounded-xl border-[1px] border-solid border-blue-300 w-full min-h-[100px] my-3">
                    <div class="shadow rounded-lg py-3 px-5 bg-white">
                      <div class="flex flex-row justify-between items-center">
                        <div>
                          <h6
                            class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                            GIÁ ĐẠT ĐƯỢC
                          </h6>
                          <h4 class="py-2 mt-3 px-4 text-teal-500 text-center">
                            {{ formatCurrency(detail?.highestPrice) }}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div class="rounded-lg py-3 px-5 bg-white shadow">
                      <div class="flex flex-row justify-center items-center">
                        <div>
                          <h6
                            class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                            Lượt đấu giá
                          </h6>
                          <div class="flex items-center justify-center">
                            <h4 class="py-2 mr-1">{{ detail?.numberOfBids }}</h4>
                            <Icon icon="mdi:payment-clock" class="text-[28px] ml-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="relative mt-5 mb-2 px-2">
                <div class="mx-auto container align-middle">
                  <table class="w-full table-auto text-sm">
                    <tbody>
                      <tr>
                        <td
                          class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                          Tên Sản Phẩm :
                        </td>
                        <td class="py-2 px-4 border-b border-grey-light">{{ detail?.product.name }}</td>
                      </tr>
                      <tr>
                        <td
                          class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                          Giá khởi điểm :
                        </td>
                        <td class="py-2 px-4 border-b border-grey-light">{{ formatCurrency(detail?.startPrice) }}</td>
                      </tr>
                      <tr>
                        <td
                          class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                          giá mua ngay :
                        </td>
                        <td class="py-2 px-4 border-b border-grey-light">{{ formatCurrency(detail?.buyNowPrice) }}</td>
                      </tr>
                      <tr>
                        <td
                          class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                          bước nhảy tối thiểu :
                        </td>
                        <td class="py-2 px-4 border-b border-grey-light">{{ formatCurrency(detail?.jump) }}</td>
                      </tr>
                      <tr>
                        <td
                          class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                          thời gian kết thúc :
                        </td>
                        <td class="py-2 px-4 border-b border-grey-light">
                          {{ detail?.endDate ? moment.utc(detail?.endDate).format('DD/MM/YYYY HH:mm:ss') : 'N/A' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="p-2 rounded-xl w-full">
                <div v-if="detail?.isInvalidSold === true" class="text-red-500 text-lg">
                  Phiên đấu giá không đủ lượt đấu giá tối thiểu.
                </div>
                <div v-if="detail?.isInvalidSold === false && detail?.isExpired === true" class="text-red-500 text-lg">
                  Người mua đã không thanh toán đơn hàng này và đã bị +1 lần tố cáo!
                </div>
                <div v-if="detail?.isInvalidSold === false && detail?.isExpired === false" class="text-red-500 text-lg">
                  Phiên đấu giá hoàn thành. Đơn hàng đang chờ người mua thanh toán...
                </div>
              </div>
            </div>
            <template #button>
              <div>
                <Button :type="constant.buttonTypes.OUTLINE" @on-click="closeModal"> Đóng </Button>
              </div>
            </template>
          </Modal>
        </div>
      </div>
    </SellerSideBarLayout>
  </div>
</template>
