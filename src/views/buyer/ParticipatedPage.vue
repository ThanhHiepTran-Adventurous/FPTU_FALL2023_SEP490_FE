<script setup>
import { onMounted, ref, computed } from 'vue';
import ItemStatic from '@/components/common-components/item-box/ItemStatic.vue';
import auctionService from '@/services/auction.service';
import imageHelper from '@/utils/image-helper';
import Loading from '@/components/common-components/Loading.vue';
import Breadcrumb from '@/layouts/Breadcrumb.vue';
import { buyerTabs } from '@/common/constant';
import { useRouter } from 'vue-router';
import BuyerSideBarLayout from '@/layouts/BuyerSideBarLayout.vue';

const router = useRouter()

const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Phiên đấu giá đã tham gia',
    to: '',
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
  router.push(`/auctions/${auctionInfo.id}`)
}

const isLoading = ref(false)
const products = ref([])
const detail = ref(null)
const history = ref(null)

const fetchProducts = async () => {
  isLoading.value = true
  const data = await auctionService.getParticipatedAuction()
  products.value = data.data ? data.data.sort((a,b) => {
    return b.timeLeft - a.timeLeft
  }) : []
  isLoading.value = false
}
const calculateCurrentPrice = auction => {
  const curr = auction?.highestPrice === 0 ? auction?.startPrice : auction?.highestPrice
  return curr
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
    <BuyerSideBarLayout :cur-tab="buyerTabs.participated.value">
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
          <div class="w-full flex justify-center" v-if="!paginatedProducts || paginatedProducts.length <= 0">Không có sản phẩm nào mà bạn đang tham gia</div>
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
        </div>
      </div>
    </BuyerSideBarLayout>
  </div>
</template>
