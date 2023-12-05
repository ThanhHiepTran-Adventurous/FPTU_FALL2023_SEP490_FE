<script setup>
import { onMounted, ref, computed } from 'vue';
import ItemStatic from '../common-components/item-box/ItemStatic.vue';
import Modal from '../common-components/Modal.vue';
import auctionService from '@/services/auction.service';
import formatCurrency from '@/utils/currency-output-formatter';
import moment from 'moment';
import BidTypeBadge from '../common-components/badge/BidTypeBadge.vue';
import imageHelper from '@/utils/image-helper';
import Loading from '../common-components/Loading.vue';
import SellerSideBarLayout from '@/layouts/SellerSideBarLayout.vue';
import Breadcrumb from '@/layouts/Breadcrumb.vue';
import { sellerTabs } from '@/common/constant';
import { useGlobalStore } from '@/stores/global.store';

const globalStore = useGlobalStore()

const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Sản phẩm đang đấu giá',
    to: '/manage/on-selling',
    disabled: true,
  },
]
const currentPage = ref(1)
const itemsPerPage = 8
const searchQuery = ref('')
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
    products.value.filter(product => product.product.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
      .length / itemsPerPage,
  )
})
const paginatedProducts = computed(() => {
  // Move startIndex and endIndex calculation here
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return products.value
    .filter(product => product.product.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .slice(startIndex, endIndex)
})
const activateInfoAuction = async auctionInfo => {
  isModalVisible.value = true
  const dataFetched = await auctionService.getAuctionDetail(auctionInfo.id)
  detail.value = dataFetched.data
  const historyFetched = globalStore.isAlreadyLogin() === true ? await auctionService.getHistoryBidAuthorized(auctionInfo.id) : await auctionService.getHistoryBid(auctionInfo.id)
  history.value = historyFetched.data
}

const isModalVisible = ref(false)
const isLoading = ref(false)
const products = ref([])
const detail = ref(null)
const history = ref(null)

function closeModal() {
  isModalVisible.value = false
}

function handleConfirm() {
  closeModal()
}

const fetchProducts = async () => {
  isLoading.value = true
  const onSellingQuery = 'status:IN_PROCESS'
  const data = await auctionService.getAuctionBySeller(onSellingQuery)
  products.value = data.data ? data.data : []
  isLoading.value = false
}
const calculateCurrentPrice = auction => {
  const curr = auction?.highestPrice === 0 ? auction?.startPrice : auction?.highestPrice
  return curr
}
const formatCurrPrice = auction => {
  const curr = auction?.highestPrice === 0 ? auction?.startPrice : auction?.highestPrice
  return formatCurrency(curr)
}

onMounted(async () => {
  await fetchProducts()
})
</script>
<template>
  <div class="w-full">
    <!-- Breadcrumb -->
    <div class="pt-2 pb-2 container mx-auto">
      <Breadcrumb :items="breadcrumbItems" />
    </div>

    <!-- Main content -->
    <SellerSideBarLayout :cur-tab="sellerTabs.onAuctioning.value">
      <div class="container py-2 mx-auto bg-white rounded-md min-h-[80vh] mb-3">
        <div class="mb-4 flex items-center mx-5 mt-4">
          <div class="w-full ml-2">
            <input
              v-model="searchQuery"
              type="text"
              id="simple-search"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Tìm kiếm sản phẩm theo tên"
              required="" />
          </div>
        </div>
        <!-- Loading -->
        <Loading v-if="isLoading" />
        <!-- Data -->
        <div v-else class="flex flex-wrap mt-10 mx-5 gap-4 min-h-[50vh]">
          <div class="w-full flex justify-center" v-if="!paginatedProducts || paginatedProducts.length <= 0">Không có sản phẩm nào đang đấu giá</div>
          <ItemStatic
            v-for="item in paginatedProducts"
            :key="item.id"
            @click="activateInfoAuction(item)"
            :product-name="item.product.name"
            :time-remain="item.timeLeft"
            :price="calculateCurrentPrice(item)"
            :mainImage="imageHelper.getPrimaryImageFromList(item.product.imageUrls)"
            :secondaryImage="imageHelper.getSecondaryImageFromList(item.product.imageUrls)" />
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
            :hasButton="false"
            title="Chi tiết"
            @decline-modal="closeModal"
            @confirm-modal="handleConfirm">
            <div class="flex-1 bg-gray rounded-lg mx-1 my-1">
              <div class="relative mx-2">
                <div class="mx-auto container align-middle">
                  <div class="flex w-full justify-around mt-5">
                    <div class="shadow rounded-lg py-3 px-5 bg-white">
                      <div class="flex flex-row justify-between items-center">
                        <div>
                          <h6
                            class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                            GIÁ ĐẠT ĐƯỢC
                          </h6>
                          <h4 class="py-2 mt-3 px-4 text-teal-500 text-center">{{ formatCurrPrice(detail) }}</h4>
                        </div>
                      </div>
                    </div>
                    <div class="rounded-lg py-3 px-5 bg-white shadow">
                      <div class="flex flex-row justify-center items-center">
                        <div>
                          <h6
                            class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                            Tham Gia
                          </h6>
                          <div class="flex items-center justify-center">
                            <h4 class="py-2 mr-1">{{ history?.bidders }}</h4>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path
                                fill="currentColor"
                                d="M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5S5.5 6.57 5.5 8.5S7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35c.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="relative my-5 px-2">
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
              <div class="relative my-5 px-2">
                <div class="text-black font-bold text-xl text-blue-600 ml-3 mb-2">Quá trình đấu giá</div>
                <div class="h-[300px] overflow-auto">
                  <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th class="px-6 py-3">Tài khoản</th>
                        <th class="px-6 py-3">Giá đặt</th>
                        <th class="px-6 py-3">Thời gian</th>
                        <th class="px-6 py-3">Loại đấu giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="auction in history?.informationBidderDTOS"
                        :key="auction.id"
                        class="border-b transition-all duration-[2000ms]"
                        :class="{ 'bg-green-200': auction.isNew, 'bg-white': !auction.isNew }">
                        <td class="px-6 py-4">{{ auction.idBidder }}</td>
                        <td class="px-6 py-4 text-blue-600 font-semibold">{{ formatCurrency(auction.bidAmount) }}</td>
                        <td class="px-6 py-4">{{ moment.utc(auction.bidTime).format('DD/MM/YYYY HH:mm:ss') }}</td>
                        <!-- need to fix -->
                        <td class="px-6 py-4"><BidTypeBadge :type-bid="auction.bidType" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </SellerSideBarLayout>
  </div>
</template>
