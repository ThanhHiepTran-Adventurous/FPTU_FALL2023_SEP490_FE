<script setup>
import Dropdown from '@/components/common-components/Dropdown.vue'
import ItemBox from '@/components/common-components/item-box/ItemBox.vue'
import { onMounted, ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Slider from '@vueform/slider'
import currencyFormat from '@/utils/currency-output-formatter.js'
import brandService from '@/services/brand.service'
import categoryService from '@/services/category.service'
import auctionService from '@/services/auction.service'
import imageHelper from '@/utils/image-helper'
import { Pagination } from 'flowbite-vue'
const orderOptions = ref([
  {
    label: 'Số lượng lượt đấu giá tăng dần',
    data: 'd1',
  },
  {
    label: 'Số lượng lượt đấu giá giảm dần',
    data: 'd2',
  },
  {
    label: 'Thời gian đấu giá còn lại dài nhất',
    data: 'd3',
  },
  {
    label: 'Thời gian đấu giá còn lại ngắn nhất',
    data: 'd4',
  },
  {
    label: 'Giá tăng dần',
    data: 'd5',
  },
  {
    label: 'Giá giảm dần',
    data: 'd6',
  },
])
const orderSelected = ref({
  label: 'Số lượng lượt đấu giá tăng dần',
  data: 'd1',
})
const priceSelected = ref([0, 5000000])
const isBrandTabOpen = ref(false)
const isCategoryTabOpen = ref(false)
const isPriceTabOpen = ref(false)

const brandOptions = ref([])
const categoryOptions = ref([])

const auctions = ref([])
const itemsPerPage = 10
const currentPage = ref(1)
const totalAuctions = ref(1)
const fetchBrandsData = async () => {
  const brands = await brandService.getAllBrandsGuest()
  brandOptions.value = brands.data.map(d => {
    return {
      label: d.name,
      value: d.id,
      isSelected: false,
    }
  })
}
const fetchCategoriesData = async () => {
  const categories = await categoryService.getAllCategoriesGuest()

  categoryOptions.value = await categories.data.map(d => {
    return {
      label: d.name,
      value: d.id,
      isSelected: false,
    }
  })
}
const fetchAuctions = async () => {
  const auctionsData = await auctionService.getAllActiveAuctions('status:IN_PROCESS', '')

  auctions.value = auctionsData.data
  totalAuctions.value = auctions.length
}
onMounted(async () => {
  fetchBrandsData()
  fetchCategoriesData()
  fetchAuctions()
})

watch(orderSelected, () => {
  onFilter()
})

const onFilter = async () => {
  const queryFilters = []
  queryFilters.push('status:IN_PROCESS')
  // Selected brand IDs
  const selectedBrandIds = brandOptions.value.filter(brand => brand.isSelected).map(brand => brand.value)
  if (selectedBrandIds.length > 0) {
    queryFilters.push(`auctionProduct_brandId:${selectedBrandIds.join(';')}`)
  }

  // Selected category IDs
  const selectedCategoryIds = categoryOptions.value
    .filter(category => category.isSelected)
    .map(category => category.value)
  if (selectedCategoryIds.length > 0) {
    queryFilters.push(`auctionProduct_categoryId:${selectedCategoryIds.join(';')}`)
  }

  // Price range filter
  const selectedPriceRange = priceSelected.value
  queryFilters.push(`startPrice>${selectedPriceRange[0]};highestPrice<${selectedPriceRange[1]}`)

  // Combine all query filters
  const query = queryFilters.join(';')
  // Sorting criteria
  const sortOptions = {
    d1: 'numberOfBids:asc',
    d2: 'numberOfBids:desc',
    d3: 'timeLeft:desc',
    d4: 'timeLeft:asc',
    d5: 'startPrice:asc',
    d6: 'startPrice:desc',
  }
  const sort = sortOptions[orderSelected.value.data] || ''
  // Call the API with the selected filters
  const auctionsData = await auctionService.getAllActiveAuctions(query, sort)
  // Update the 'auctions' value with the filtered results
  auctions.value = auctionsData.data

  // You can also update 'totalAuctions' to reflect the total count of filtered auctions.
  totalAuctions.value = auctionsData.length
}
const totalPages = computed(() => {
  if (auctions.value) {
    return Math.ceil(auctions.value?.length / itemsPerPage)
  } else {
    return 0
  }
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
</script>
<template>
  <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div class="container mx-auto bg-white mt-3 rounded-md px-5 pt-1 overflow-auto">
        <div class="flex items-center justify-between">
          <p class="text-3xl font-bold text-black">Sản phẩm</p>
          <div class="flex items-center justify-center gap-3">
            <p class="mt-3">Sắp xếp theo:</p>
            <div>
              <Dropdown v-model="orderSelected" :data="orderOptions" class="!w-[300px]" />
            </div>
          </div>
        </div>
        <div class="flex items-start justify-between mt-7">
          <!-- Filter section -->
          <div>
            <div>Bộ lọc</div>
            <div class="mb-1.5 mt-2">
              <div
                class="flex items-center justify-between hover:cursor-pointer"
                @click="() => (isBrandTabOpen = !isBrandTabOpen)">
                <div class="font-bold text-black">Thương hiệu</div>
                <Icon icon="ep:arrow-down" class="text-[18px]" />
              </div>
              <div
                :class="`transition-all duration-500 ${
                  isBrandTabOpen ? 'h-[10rem] opacity-1 p-2' : 'h-0 opacity-0 overflow-hidden'
                }`">
                <div v-for="brand in brandOptions" :key="brand.id" class="flex items-center mb-1">
                  <input
                    :id="brand.id"
                    type="checkbox"
                    :value="brand.value"
                    v-model="brand.isSelected"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                  <label for="default-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{
                    brand.label
                  }}</label>
                </div>
              </div>
            </div>
            <div class="mb-1.5">
              <div
                class="flex items-center justify-between hover:cursor-pointer"
                @click="() => (isPriceTabOpen = !isPriceTabOpen)">
                <div class="font-bold text-black">Giá</div>
                <Icon icon="ep:arrow-down" class="text-[18px]" />
              </div>
              <div
                :class="`transition-all duration-500 ${
                  isPriceTabOpen ? 'h-[10rem] opacity-1 p-2' : 'h-0 opacity-0 overflow-hidden'
                }`">
                <div class="mt-5">
                  <Slider v-model="priceSelected" :max="10000000" :step="10000" />
                  <p>Giá từ {{ currencyFormat(priceSelected[0]) }} đên {{ currencyFormat(priceSelected[1]) }}</p>
                </div>
              </div>
            </div>
            <div class="mb-1.5">
              <div
                class="flex items-center justify-between hover:cursor-pointer"
                @click="() => (isCategoryTabOpen = !isCategoryTabOpen)">
                <div class="font-bold text-black">Chủng loại</div>
                <Icon icon="ep:arrow-down" class="text-[18px]" />
              </div>
              <div
                :class="`transition-all duration-500 ${
                  isCategoryTabOpen ? 'h-[10rem] opacity-1 p-2' : 'h-0 opacity-0 overflow-hidden'
                }`">
                <div v-for="cate in categoryOptions" :key="cate.id" class="flex items-center mb-1">
                  <input
                    :id="cate.id"
                    type="checkbox"
                    :value="cate.value"
                    v-model="cate.isSelected"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                  <label for="default-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{
                    cate.label
                  }}</label>
                </div>
              </div>
            </div>
            <button
              class="p-2 mt-8 ml-4 bg-blue-600 text-md text-white rounded-lg w-[100px] text-center"
              @click="onFilter()">
              Lọc
            </button>
          </div>
          <!-- Auction section -->
          <div class="w-[75%]">
            <div class="flex flex-wrap gap-8">
              <ItemBox
                v-for="auction in auctions"
                :key="auction.id"
                :product-name="auction.product?.name"
                :main-image="imageHelper.getPrimaryImageFromList(auction.product?.imageUrls)"
                :secondary-image="imageHelper.getSecondaryImageFromList(auction.product?.imageUrls)"
                :floor-price="auction.highestPrice ? auction.highestPrice : auction.startPrice"
                :time-remain="auction.timeLeft"
                :item-id="auction.id"
                :auction-type="auction.modelType" />
            </div>
            <nav
              v-if="totalPages != 0"
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
        </div>
      </div>
    </div>
  </section>
</template>
<style src="@vueform/slider/themes/default.css"></style>
