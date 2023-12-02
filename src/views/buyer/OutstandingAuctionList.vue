<script setup>
import ItemBox from '@/components/common-components/item-box/ItemBox.vue'
import { onMounted, ref, watch } from 'vue'
import auctionService from '@/services/auction.service'
import imageHelper from '@/utils/image-helper'
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import Loading from '@/components/common-components/Loading.vue'

const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Đấu giá',
    to: '/auctions',
    disabled: false,
  },
  {
    text: 'Nổi bật',
    to: '/auctions/outstanding',
    disabled: true,
  },
]

const isDataLoading = ref(false)

const auctions = ref([])
const AUCTIONS_PER_PAGE = 8
const currentPage = ref(1)

onMounted(async () => {
    fetchAuctions()
})

watch(currentPage, () => {
    fetchAuctions()
})

const fetchAuctions = async () => {
  isDataLoading.value = true
  const auctionsData = await auctionService.getHotAuctionsDesc(currentPage.value, AUCTIONS_PER_PAGE)
  isDataLoading.value = false

  // Update the 'auctions' value with the filtered results
  auctions.value = auctionsData.data
  totalPages.value = auctionsData.pagination.totalPage
}

const totalPages = ref(0)
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
</script>
<template>
  <div class="pt-2 pb-2 px-4 max-w-screen-xxl mx-auto">
    <Breadcrumb :items="breadcrumbItems" />
  </div>
  <section>
    <div class="px-4 mx-auto max-w-screen-xxl mb-3">
      <div class="flex gap-2">
        <article
          class="p-4 bg-white rounded-lg border border-gray-200 shadow lg:w-full min-h-[80vh]">
          <div class="h-full flex flex-col justify-between">
            <!-- Header, sort -->
            <div class="flex items-center justify-between">
              <!-- Header -->
              <div class="px-3 pb-1 flex items-center justify-start">
                <div class="font-bold text-2xl text-black text-blue-800">
                  Sản phẩm đấu giá</div>
              </div>
            </div>
            <!-- Auctions -->
            <div class="w-full flex justify-center">
              <div class="w-full" v-if="isDataLoading">
                <Loading />
              </div>
              <div v-else class="grid grid-cols-4 gap-2 mt-3">
                <ItemBox
                  v-for="auction in auctions"
                  :key="auction.id"
                  :product-name="auction.product?.name"
                  :main-image="imageHelper.getPrimaryImageFromList(auction.product?.imageUrls)"
                  :secondary-image="imageHelper.getSecondaryImageFromList(auction.product?.imageUrls)"
                  :floor-price="auction.highestPrice ? auction.highestPrice : auction.startPrice"
                  :time-remain="auction.timeLeft"
                  :item-id="auction.id"
                  :auction-type="auction.modelType"
                  class="border border-gray-300 rounded-lg shadow px-4 py-3 mx-1.5 mb-2" />
              </div>
            </div>
            <!-- Pagination -->
            <div class="w-full">
              <nav
                v-if="totalPages != 0"
                class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                aria-label="Table navigation">
                <ul class="inline-flex items-stretch -space-x-px">
                  <li>
                    <button
                      type="button"
                      class="flex items-center justify-center h-full py-1.5 px-1 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      @click="goToPreviousPage"
                      :disabled="currentPage == 1"
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
                      :class="currentPage == pageNumber
                        ? 'text-blue-600 bg-blue-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800'"
                      @click="goToPage(pageNumber)"
                      aria-label="Page {{ pageNumber }}">
                      {{ pageNumber }}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      @click="goToNextPage"
                      class="flex items-center justify-center h-full py-1.5 px-1 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      :disabled="currentPage == totalPages"
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
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
<style src="@vueform/slider/themes/default.css"></style>