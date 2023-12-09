<script setup>
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import auctionService from '@/services/auction.service'
import { onMounted, ref, watch, computed } from 'vue'
import imageHelper from '@/utils/image-helper'
import { immediateScriptBoughtPage } from '@/common/commonStaticState'
import { Icon } from '@iconify/vue'
import { buyerTabs } from '@/common/constant'
import SideBarLayout from '../../../../layouts/BuyerSideBarLayout.vue'
import TwoOptionsTab from '@/components/TwoOptionsTab.vue'
import { AuctionModelType } from '@/common/contract'
import AuctionCard from '@/components/AuctionCard.vue'
import { Tooltip } from 'ant-design-vue';
import Loading from '@/components/common-components/Loading.vue'

const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Thắng đấu giá',
    to: '/bought/immediate',
    disabled: true,
  },
]

const isLoading = ref(false)
const auctionWins = ref([])
const auctionWinFiltered = ref([])

const filterData = () => {
  auctionWinFiltered.value = auctionWins?.value
    ?.filter(
      v =>
        v.informationAuction.modelType === AuctionModelType.immediate && v.informationAuction.product.status !== 'PAID',
    )
    .sort((a, b) => {
      return new Date(b.winAt).getTime() - new Date(a.winAt).getTime()
    })
}
const fetchAuctionWinData = async () => {
  isLoading.value = true
  const response = await auctionService.getListAuctionWin()
  isLoading.value = false
  auctionWins.value = response.data
  auctionWinFiltered.value = JSON.parse(JSON.stringify(auctionWins.value))
  filterData()
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
    auctionWinFiltered.value.filter(product =>
      product?.informationAuction?.product?.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    ).length / itemsPerPage,
  )
})
const paginatedProducts = computed(() => {
  // Move startIndex and endIndex calculation here
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return auctionWinFiltered.value
    .filter(product =>
      product?.informationAuction?.product?.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
    .slice(startIndex, endIndex)
})
onMounted(async () => {
  fetchAuctionWinData()
})
</script>

<template>
  <div class="w-full">
    <div class="pt-2 pb-2 container mx-auto">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
    <SideBarLayout :cur-tab="buyerTabs.bought.value">
      <div class="bg-white container mx-auto rounded w-full min-h-[80vh]">
        <!-- Header -->
        <div class="pt-3 px-3 pb-1 flex items-center justify-between">
          <div class="font-bold text-2xl text-black text-blue-800 flex">
            <div>
              Sản phẩm thắng đấu giá
            </div>
            <Tooltip class="relative ml-3" placement="rightBottom">
              <template #title>{{ immediateScriptBoughtPage }}</template>
              <Icon icon="ooui:notice" class="text-[15px] text-yellow-300" />
            </Tooltip>
          </div>
          <div>
            <TwoOptionsTab
              immediate-option-nav="/bought/immediate"
              intermediate-option-nav="/bought/intermediate"
              :cur-tab="AuctionModelType.immediate" />
          </div>
        </div>

        <!-- Filter -->
        <div class="mb-2 mx-3 pt-3">
          <div class="flex items-center gap-5">
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
        <div v-else class="bg-white grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-2 pt-6 pb-5 w-full px-3">
          <AuctionCard
            v-for="auction in paginatedProducts"
            :key="auction.id"
            :image-url="imageHelper.getPrimaryImageFromList(auction.informationAuction.product.imageUrls)"
            :product-name="auction.informationAuction.product.name"
            :auction-type="auction.informationAuction.modelType"
            :price="auction.finalPrice"
            :catched-at="auction.winAt"
            @action-triggered="openPaymentModel(auction.informationAuction.id)" />
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
    <!-- Main section -->
  </div>
</template>
