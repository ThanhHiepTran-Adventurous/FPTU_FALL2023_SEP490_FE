<script setup>
import ListProductImage from '@/components/product-detail/ListProductImage.vue'
import ProductInfo from '@/components/product-detail/ProductInfo.vue'
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import AuctionHistoryBid from '@/components/product-detail/AuctionHistoryBid.vue'
import ItemBox from '@/components/common-components/item-box/ItemBox.vue'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'
import auctionService from '@/services/auction.service'
import feedbackService from '@/services/feedback.service'

import moment from 'moment'
import toastOption from '@/utils/toast-option'
import { Carousel } from 'flowbite-vue'
import { AuctionModelType } from '@/common/contract'
const itemsPerPage = ref(3)
const currentPage = ref(1)
const route = useRoute()
const router = useRouter()
const convertedImages = ref([])
const bidHistoryInfo = ref([])
const numOfUsers = ref(0)
const numOfBids = ref(0)
const showDes = ref(true)
const showReview = ref(false)

const toggleSections = (showDesired, showReviewDesired) => {
  showDes.value = showDesired
  showReview.value = showReviewDesired
}

let isFirstTime = true
let interval

const auction = ref(null)
const feedbacks = ref([])
const productName = ref(null)
const description = ref(null)
const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Đấu giá',
    to: '/auctions',
    disabled: false,
  },
  {
    text: productName,
    to: '/product-detail',
    disabled: true,
  },
]
const averageRating = ref(0)

const fechFeedback = async sellerId => {
  const feedbackData = await feedbackService.getFeedbackBySellerId(sellerId)
  feedbacks.value = feedbackData.data
  console.log(feedbacks.value)
  calculateAverageRating()
}
const calculateAverageRating = () => {
  if (feedbacks.value && feedbacks.value.length > 0) {
    const totalRating = feedbacks.value.reduce((acc, feedback) => {
      return acc + (feedback.rate || 0) // Access the rate field from feedbackData
    }, 0)

    const average = totalRating / feedbacks.value.length
    averageRating.value = Math.round(average * 10) / 10 // Round to 1 decimal place
  } else {
    averageRating.value = 0 // Set to default value if no feedbacks available
  }
}

const fetchDetail = async () => {
  const auctionDetailData = await auctionService.getAuctionDetail(route.params['id'])
  const autionData = auction.value

  try {
    fechFeedback(auctionDetailData.data?.product?.seller.id)
  } catch (error) {
    console.log(error)
  }
  productName.value = auctionDetailData.data?.product?.name
  description.value = auctionDetailData.data?.product?.description
  console.log(auctionDetailData.data?.product)
  auction.value = { ...autionData, ...auctionDetailData.data, numOfUsers: numOfUsers.value }
  convertedImages.value =
    auction.value?.product?.imageUrls.map(url => ({
      src: url,
      alt: 'Image Alt Text', // You can set the alt text as per your requirements
    })) || []
}
const fetchBidHistory = async () => {
  const response = await auctionService.getHistoryBid(route.params['id'])
  const data = response.data
  numOfUsers.value = data.bidders || 0
  numOfBids.value = data.bids || 0

  const newData = data.informationBidderDTOS
    ? data.informationBidderDTOS
        .map(d => {
          const isExisted = bidHistoryInfo.value.filter(
            inf => inf.bidAmount === d.bidAmount && inf.idBidder === d.idBidder,
          )
          const isNew = !(isExisted && isExisted.length > 0)
          return {
            idBidder: d.idBidder,
            bidAmount: d.bidAmount,
            createAt: moment.utc(d.bidTime).format('DD/MM/YYYY HH:mm:ss'),
            bidType: d.auctionType,
            isNew: isFirstTime ? false : isNew,
          }
        })
        .sort((d1, d2) => {
          return d2.bidAmount - d1.bidAmount
        })
    : []
  bidHistoryInfo.value = [...newData]
  if (bidHistoryInfo.value.length > 0) {
    const topBidderData = bidHistoryInfo.value[0]
    const latestBidderInfo = {
      identifier: topBidderData.idBidder,
      createdAt: topBidderData.createAt,
    }
    if (auction.value && auction.value.latestBidderInfo) {
      auction.value.latestBidderInfo.identifier = latestBidderInfo.identifier
      auction.value.latestBidderInfo.createdAt = latestBidderInfo.createdAt
    } else {
      auction.value = { ...auction.value, latestBidderInfo }
    }
    auction.value.highestPrice = topBidderData.bidAmount
  }
}

const fetchPageData = async () => {
  await fetchBidHistory()
  isFirstTime = false
  fetchDetail()
}
const onBuyNowSuccess = () => {
  toastOption.toastSuccess('Mua ngay thành công')
  if (auction.value.modelType === AuctionModelType.immediate) {
    router.push('/bought/immediate')
  } else {
    router.push('/bought/intermediate')
  }
}

onMounted(async () => {
  fetchPageData()

  // NEED TO REPLACE SET INTERVAL WITH FIREBASE MESSAGE TRIGGER!!!!!
  interval = setInterval(() => {
    fetchBidHistory()
  }, 10000)
})
const totalPages = computed(() => {
  return Math.ceil(feedbacks.value.length / itemsPerPage.value)
})
// Function to go to a specific page
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
const paginatedFeedbacks = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return feedbacks.value.slice(startIndex, endIndex)
})
onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<template>
  <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xxl py-2 px-2">
      <Breadcrumb :items="breadcrumbItems" />
      <div class="flex gap-2">
        <article
          class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 lg:w-full">
          <div>
            <div>
              <ProductInfo
                :auction-info="auction"
                @place-bid-success="fetchPageData()"
                @buy-now-success="onBuyNowSuccess()" />
            </div>
          </div>
        </article>
        <article
          class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 lg:w-2/3">
          <div>
            <AuctionHistoryBid :auctionHistory="bidHistoryInfo" :numOfUsers="numOfUsers" :numOfBids="numOfBids" />
          </div>
        </article>
      </div>
    </div>
  </section>
  <section class="bg-white dark:bg-gray-900">
    <div class="mx-auto max-w-screen-xxl py-2 px-2 py-8 px-4">
      <article class="bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div
          class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <ul class="flex flex-wrap -mb-px">
            <li class="me-2">
              <a
                @click.prevent="toggleSections(true, false)"
                href="#"
                :class="{
                  'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300':
                    !showDes,
                  'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500':
                    showDes,
                }"
                >Mô tả</a
              >
            </li>
            <li class="me-2">
              <button
                @click="toggleSections(false, true)"
                href="#"
                :class="{
                  'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500':
                    showReview,
                  'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300':
                    !showReview,
                }">
                Đánh giá cửa hàng
              </button>
            </li>
          </ul>
        </div>

        <section v-if="showReview" class="bg-white dark:bg-gray-900 rounded-lg border-r">
          <div class="mx-auto max-w-screen-xxl">
            <div class="flex gap-2">
              <article
                class="bg-white rounded-lg border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 lg:w-full">
                <div v-if="feedbacks !== null && feedbacks.length > 0">
                  <section
                    v-for="(feedback, index) in paginatedFeedbacks"
                    :key="index"
                    class="bg-white border-b dark:bg-gray-900 antialiased">
                    <div class="max-w-2xl">
                      <article
                        class="text-base bg-white p-3 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                        <div class="flex">
                          <div class="">
                            <div class="text-center">
                              <img
                                class="w-16 h-16 mx-auto rounded-full"
                                :src="feedback.buyer.avatarUrl"
                                :alt="feedback?.buyer?.fullname" />
                            </div>

                            <p class="text-sm text-center dark:text-gray-400">
                              <span class="block text-gray-600 whitespace-nowrap mt-2 font-bold">{{
                                feedback?.buyer?.fullname
                              }}</span>
                              <time
                                class="block text-gray-400"
                                pubdate
                                datetime="2022-03-12"
                                title="March 12th, 2022"
                                >{{
                                  feedback?.createAt ? moment.utc(feedback?.createAt).format('DD/MM/YYYY HH:mm:ss') : ''
                                }}</time
                              >
                            </p>
                          </div>
                          <div class="ml-5 text-gray-500 dark:text-gray-400">
                            <div class="flex items-center mb-2">
                              <template v-for="i in 5">
                                <svg
                                  v-if="i <= feedback.rate"
                                  class="w-6 h-6 text-yellow-300 me-1"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20">
                                  <!-- SVG path for a filled star -->
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                                <svg
                                  v-else
                                  class="w-6 h-6 text-gray-300 me-1 dark:text-gray-500"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20">
                                  <!-- SVG path for an empty star -->
                                  <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                              </template>
                            </div>
                            <p>
                              {{ feedback?.content }}
                            </p>
                          </div>
                        </div>
                      </article>
                    </div>
                  </section>

                  <nav
                    v-if="feedbacks !== null && feedbacks.length > 0"
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
                <div v-else>
                  <div class="max-w-2xl">
                    <article
                      class="text-base bg-white p-6 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                      <div>
                        <p class="ml-5 text-gray-500 dark:text-gray-400">Hiện tại chưa có đánh giá</p>
                      </div>
                    </article>
                  </div>
                </div>
              </article>
              <article class="p-6 bg-white rounded-lg border-gray-200 dark:bg-gray-800 dark:border-gray-700 lg:w-2/3">
                <div v-if="feedbacks !== null && feedbacks.length > 0">
                  <div class="text-center">
                    <p class="text-3xl font-bold text-gray-500 dark:text-gray-400">{{ averageRating }}</p>

                    <div class="flex justify-center items-center">
                      <svg
                        class="w-8 h-8 ms-3 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20">
                        <path
                          d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        class="w-8 h-8 ms-3 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20">
                        <path
                          d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        class="w-8 h-8 ms-3 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20">
                        <path
                          d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        class="w-8 h-8 ms-3 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20">
                        <path
                          d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        class="w-8 h-8 ms-3 text-gray-300 dark:text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20">
                        <path
                          d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    </div>
                    <p class="text-md mt-3 text-gray-500 dark:text-gray-400">({{ feedbacks?.length }} đánh giá)</p>
                  </div>
                  <div class="text-center ml-28">
                    <div class="flex items-center mt-4">
                      <a href="#" class="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">5 </a>
                      <svg
                        class="w-4 h-4 text-yellow-300 ms-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20">
                        <path
                          d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <div class="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                        <div
                          class="h-5 bg-yellow-300 rounded"
                          :style="{
                            width:
                              (feedbacks.filter(feedback => feedback.rate === 5).length / feedbacks.length) * 100 + '%',
                          }"></div>
                      </div>
                      <span class="text-sm font-medium text-gray-500 dark:text-gray-400"
                        >{{
                          (feedbacks.filter(feedback => feedback.rate === 5).length / feedbacks.length) * 100
                        }}%</span
                      >
                    </div>
                    <div class="flex items-center mt-4">
                      <a href="#" class="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">4 </a>
                      <svg
                        class="w-4 h-4 text-yellow-300 ms-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20">
                        <path
                          d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <div class="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                        <div
                          class="h-5 bg-yellow-300 rounded"
                          :style="{
                            width:
                              (feedbacks.filter(feedback => feedback.rate === 4).length / feedbacks.length) * 100 + '%',
                          }"></div>
                      </div>
                      <span class="text-sm font-medium text-gray-500 dark:text-gray-400"
                        >{{
                          (feedbacks.filter(feedback => feedback.rate === 4).length / feedbacks.length) * 100
                        }}%</span
                      >
                    </div>
                    <div class="flex items-center mt-4">
                      <a href="#" class="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">3 </a>
                      <svg
                        class="w-4 h-4 text-yellow-300 ms-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20">
                        <path
                          d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <div class="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                        <div
                          class="h-5 bg-yellow-300 rounded"
                          :style="{
                            width:
                              (feedbacks.filter(feedback => feedback.rate === 3).length / feedbacks.length) * 100 + '%',
                          }"></div>
                      </div>
                      <span class="text-sm font-medium text-gray-500 dark:text-gray-400"
                        >{{
                          (feedbacks.filter(feedback => feedback.rate === 3).length / feedbacks.length) * 100
                        }}%</span
                      >
                    </div>
                    <div class="flex items-center mt-4">
                      <a href="#" class="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">2 </a>
                      <svg
                        class="w-4 h-4 text-yellow-300 ms-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20">
                        <path
                          d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <div class="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                        <div
                          class="h-5 bg-yellow-300 rounded"
                          :style="{
                            width:
                              (feedbacks.filter(feedback => feedback.rate === 2).length / feedbacks.length) * 100 + '%',
                          }"></div>
                      </div>
                      <span class="text-sm font-medium text-gray-500 dark:text-gray-400"
                        >{{
                          (feedbacks.filter(feedback => feedback.rate === 2).length / feedbacks.length) * 100
                        }}%</span
                      >
                    </div>
                    <div class="flex items-center mt-4">
                      <a href="#" class="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">1 </a>
                      <svg
                        class="w-4 h-4 text-yellow-300 ms-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20">
                        <path
                          d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <div class="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                        <div
                          class="h-5 bg-yellow-300 rounded"
                          :style="{
                            width:
                              (feedbacks.filter(feedback => feedback.rate === 1).length / feedbacks.length) * 100 + '%',
                          }"></div>
                      </div>
                      <span class="text-sm font-medium text-gray-500 dark:text-gray-400"
                        >{{
                          (feedbacks.filter(feedback => feedback.rate === 1).length / feedbacks.length) * 100
                        }}%</span
                      >
                    </div>
                  </div>

                  <div class="text-center">
                    <div class="flex items-center mt-4">
                      <!-- Your content for 5 star rating -->
                    </div>
                    <div class="flex items-center mt-4">
                      <!-- Your content for 4 star rating -->
                    </div>
                    <!-- Repeat similar div structures for 3, 2, 1 star ratings -->
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
        <section v-if="showDes" class="bg-white dark:bg-gray-900 rounded-lg border-r">
          <div class="mx-auto max-w-screen-xxl">
            <div class="flex gap-2">
              <article
                class="bg-white rounded-lg border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 lg:w-full">
                <div>
                  <section class="bg-white border-b dark:bg-gray-900 antialiased">
                    <div class="max-w-2xl">
                      <article
                        class="text-base bg-white p-6 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                        <div>
                          <p class="ml-5 text-gray-500 dark:text-gray-400">{{ description }}</p>
                        </div>
                      </article>
                    </div>
                  </section>
                </div>
              </article>
            </div>
          </div>
        </section>
      </article>
    </div>
  </section>
</template>
