<script setup>
import Dropdown from '@/components/common-components/Dropdown.vue'
import ItemBox from '@/components/common-components/item-box/ItemBox.vue'
import { onMounted, ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Slider from '@vueform/slider'
import brandService from '@/services/brand.service'
import categoryService from '@/services/category.service'
import auctionService from '@/services/auction.service'
import imageHelper from '@/utils/image-helper'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import Loading from '@/components/common-components/Loading.vue'
import { AuctionModelType } from '@/common/contract'
import CurrencyInput from '@/components/common-components/CurrencyInput.vue'
import currencyFormatter from '@/utils/currencyFormatter'

const DEFAULT_MIN_PRICE_FILTER = 0
const DEFAULT_MAX_PRICE_FILTER = 20000000
const DEFAULT_MAX_PRICE_FILTER_STRING = '20,000,000'

const route = useRoute()
const router = useRouter()

const isDataLoading = ref(false)

const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Đấu giá',
    to: '/auctions',
    disabled: true,
  },
]
const orderOptions = ref([
  {
    label: 'Số lượng lượt đấu giá tăng dần',
    data: 'numberOfBids:asc',
  },
  {
    label: 'Số lượng lượt đấu giá giảm dần',
    data: 'numberOfBids:desc',
  },
  {
    label: 'Thời gian đấu giá còn lại dài nhất',
    data: 'timeLeft:desc',
  },
  {
    label: 'Thời gian đấu giá còn lại ngắn nhất',
    data: 'timeLeft:asc',
  },
  {
    label: 'Giá tăng dần',
    data: 'startPrice:asc',
  },
  {
    label: 'Giá giảm dần',
    data: 'startPrice:desc',
  },
])
const orderSelected = ref({
  label: 'Số lượng lượt đấu giá tăng dần',
  data: 'numberOfBids:asc',
})
const priceSelected = ref([DEFAULT_MIN_PRICE_FILTER, DEFAULT_MAX_PRICE_FILTER])

const brandOptions = ref([])
const categoryOptions = ref([])
const brandSelected = ref('')
const cateSelected = ref('')
const modelTypeSelected = ref('')
const minPriceSelected = ref(DEFAULT_MIN_PRICE_FILTER)
const maxPriceSelected = ref(DEFAULT_MAX_PRICE_FILTER_STRING)

const auctions = ref([])
const AUCTIONS_PER_PAGE = 8
const currentPage = ref(1)
const totalAuctions = ref(1)

const initBrandsData = async () => {
  const brands = await brandService.getAllBrandsGuest()

  brandOptions.value.push({
    label: "Tất cả",
    value: ""
  })

  for(const d of brands.data){
    brandOptions.value.push({
      label: d.name,
      value: d.id
    })
  }
  brandSelected.value = brandOptions.value[0].value
}
const initCategoriesData = async () => {
  const categories = await categoryService.getAllCategoriesGuest()

  categoryOptions.value.push({
    label: "Tất cả",
    value: "",
  })

  for(const d of categories.data){
    categoryOptions.value.push({
      label: d.name,
      value: d.id
    })
  }
  cateSelected.value = categoryOptions.value[0].value
}

onMounted(async () => {
  await initBrandsData()
  await initCategoriesData()
  syncQueryParams()
  onFilter()
})

watch(orderSelected, () => {
  onFilter()
})
watch(currentPage, () => {
  onFilter()
})
watch(priceSelected, () => {
  minPriceSelected.value = currencyFormatter.fromNumberToStyledString(priceSelected.value[0])
  maxPriceSelected.value = currencyFormatter.fromNumberToStyledString(priceSelected.value[1])
}, {deep: true})
watch(minPriceSelected, () => {
  priceSelected.value[0] = currencyFormatter.fromStyledStringToNumber(minPriceSelected.value)
})
watch(maxPriceSelected, () => {
  priceSelected.value[1] = currencyFormatter.fromStyledStringToNumber(maxPriceSelected.value)
})

const syncQueryParams = () => {
  const queryParams = route.query
  if(queryParams['brand']){
    brandSelected.value = queryParams['brand']
  }
  if(queryParams['category']){
    cateSelected.value = queryParams['category']
  }
  if(queryParams['priceStart']){
    minPriceSelected.value = currencyFormatter.fromNumberToStyledString(queryParams['priceStart'])
    priceSelected.value[0] = currencyFormatter.fromStyledStringToNumber(queryParams['priceStart'])
  }
  if(queryParams['priceEnd']){
    maxPriceSelected.value = currencyFormatter.fromNumberToStyledString(queryParams['priceEnd'])
    priceSelected.value[1] = currencyFormatter.fromStyledStringToNumber(queryParams['priceEnd'])

  }
  if(queryParams['sort']){
    const selected = orderOptions.value.filter(f => f.data === queryParams['sort'])
    if(selected && selected.length > 0){
      orderSelected.value = selected[0]
    }
  }
  if(queryParams['page']){
    currentPage.value = queryParams['page']
  }
  if(queryParams['modelType']){
    modelTypeSelected.value = queryParams['modelType']
  }
}
const pushQueryParams = () => {
  const queryPayload = {
    brand: brandSelected.value,
    category: cateSelected.value,
    priceStart: minPriceSelected.value,
    priceEnd: maxPriceSelected.value,
    sort: orderSelected.value.data,
    page: currentPage.value,
    modelType: modelTypeSelected.value
  }
  router.push({
    query: {... queryPayload}
  })
}

const onClear = async () => {
  brandSelected.value = ''
  cateSelected.value = ''
  modelTypeSelected.value = ''
  minPriceSelected.value = DEFAULT_MIN_PRICE_FILTER
  maxPriceSelected.value = DEFAULT_MAX_PRICE_FILTER_STRING
  priceSelected.value = [DEFAULT_MIN_PRICE_FILTER, DEFAULT_MAX_PRICE_FILTER]
  orderSelected.value = {
    label: 'Số lượng lượt đấu giá tăng dần',
    data: 'numberOfBids:asc',
  }
  currentPage.value = 1
  modelTypeSelected.value = ''
}

const onFilter = async () => {
  const queryFilters = []
  queryFilters.push('status:IN_PROCESS')

  // Selected brand IDs
  if(brandSelected.value){
    queryFilters.push(`auctionProduct_brandId:${brandSelected.value}`)
  }

  // Selected category IDs
  if (cateSelected.value) {
    queryFilters.push(`auctionProduct_categoryId:${cateSelected.value}`)
  }

  // Selected model type
  if (modelTypeSelected.value) {
    queryFilters.push(`modelType:${modelTypeSelected.value}`)
  }

  // Price range filter
  queryFilters.push(`highestPrice%2B${currencyFormatter.fromStyledStringToNumber(minPriceSelected.value)};highestPrice-${currencyFormatter.fromStyledStringToNumber(maxPriceSelected.value)}`)

  // Combine all query filters
  const query = queryFilters.join(';')

  // Sorting criteria
  const sort = orderSelected.value.data || ''

  // Call the API with the selected filters
  isDataLoading.value = true
  const auctionsData = await auctionService.getAllActiveAuctions(query, sort, currentPage.value, AUCTIONS_PER_PAGE)
  isDataLoading.value = false

  // Update the 'auctions' value with the filtered results
  auctions.value = auctionsData.data
  totalPages.value = auctionsData.pagination.totalPage

  // You can also update 'totalAuctions' to reflect the total count of filtered auctions.
  totalAuctions.value = auctionsData.length
  pushQueryParams()
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
    <div class="px-4 mx-auto max-w-screen-xxl">
      <div class="flex gap-2">
        <!-- Sort sidebar -->
        <article class="p-6 bg-white rounded-lg border border-gray-200 shadow lg:w-1/5 min-h-[751.2px]">
          <div>
            <div class="font-bold text-lg text-black uppercase">Bộ lọc</div>
            <!-- Auction model type -->
            <div class="mb-1.5 mt-4">
              <div class="flex items-center justify-between hover:cursor-pointer mb-2">
                <div class="font-bold text-black">Loại</div>
              </div>
              <div class="transition-all duration-500 opacity-1 p-2'">
                <div class="flex items-center mb-2">
                  <input
                    id="all"
                    type="radio"
                    value=""
                    v-model="modelTypeSelected"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 hover:cursor-pointer" />
                  <label for="all" class="ml-2 text-sm font-medium text-gray dark:text-gray-300">
                    Tất cả
                  </label>
                </div>
                <div class="flex items-center mb-2">
                  <input
                    id="immediate"
                    type="radio"
                    :value="AuctionModelType.immediate"
                    v-model="modelTypeSelected"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 hover:cursor-pointer" />
                  <label for="immediate" class="ml-2 text-sm font-medium text-gray dark:text-gray-300">
                    Tự trao đổi
                  </label>
                </div>
                <div class="flex items-center mb-1">
                  <input
                    id="intermediate"
                    type="radio"
                    :value="AuctionModelType.intermediate"
                    v-model="modelTypeSelected"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 hover:cursor-pointer" />
                  <label for="intermediate" class="ml-2 text-sm font-medium text-gray dark:text-gray-300">
                    Trung gian qua hệ thống
                  </label>
                </div>
              </div>
            </div>
            <!-- Brands -->
            <div class="mb-1.5 mt-4">
              <div class="flex items-center justify-between hover:cursor-pointer mb-2">
                <div class="font-bold text-black">Thương hiệu</div>
              </div>
              <div class="transition-all duration-500 opacity-1 p-2'">
                <div v-for="brand in brandOptions" :key="brand.id" class="flex items-center mb-2">
                  <input
                    :id="brand.value"
                    type="radio"
                    :value="brand.value"
                    v-model="brandSelected"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 hover:cursor-pointer" />
                  <label :for="brand.value" class="ml-2 text-sm font-medium text-gray dark:text-gray-300">{{
                    brand.label
                  }}</label>
                </div>
              </div>
            </div>
            <!-- Price -->
            <div class="mb-1.5 mt-4">
              <div class="flex items-center justify-between hover:cursor-pointer">
                <div class="font-bold text-black">Giá</div>
              </div>
              <div class="transition-all duration-500 opacity-1">
                <div class="mt-5">
                  <Slider
                    v-model="priceSelected"
                    :max="20000000"
                    :step="10000"
                    :format="{thousand: '.'}"
                    class="slider-blue"
                  />
                  <div class="flex items-center gap-1 mt-3">
                    <div>Từ </div>
                    <CurrencyInput v-model="minPriceSelected" w="w-[7rem] !pl-1"/>
                    <div>đến </div>
                    <CurrencyInput v-model="maxPriceSelected" w="w-[7rem] !pl-1"/>
                  </div>
                </div>
              </div>
            </div>
            <!-- Categories -->
            <div class="mb-1.5 mt-4">
              <div class="flex items-center justify-between hover:cursor-pointer mb-1.5">
                <div class="font-bold text-black">Chủng loại</div>
              </div>
              <div class="transition-all duration-500 opacity-1 p-2'">
                <div v-for="cate in categoryOptions" :key="cate.id" class="flex items-center mb-2">
                  <input
                    :id="cate.value"
                    type="radio"
                    :value="cate.value"
                    v-model="cateSelected"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 hover:cursor-pointer" />
                  <label :for="cate.value" class="ml-2 text-sm font-medium text-gray dark:text-gray-300">{{
                    cate.label
                  }}</label>
                </div>
              </div>
            </div>
            <!-- Buttons -->
            <div class="w-full flex justify-center gap-3 mt-12">
              <button
                class="p-2 border-blue-600 border text-md flex items-center justify-center gap-3 text-black hover:bg-gray-200 rounded-lg w-[100px]"
                @click="onClear()">
                <div>Clear</div>
              </button>
              <button
                class="p-2 bg-blue-600 text-md flex items-center justify-center gap-3 text-white rounded-lg w-[100px]"
                @click="onFilter()">
                <div>
                  <Icon icon="clarity:filter-solid" class="text-[20px]"/>
                </div>
                <div>Lọc</div>
              </button>
            </div>
          </div>
        </article>
        <article
          class="p-4 bg-white rounded-lg border border-gray-200 shadow lg:w-full">
          <div class="h-full flex flex-col justify-between">
            <!-- Header, sort -->
            <div class="flex items-center justify-between">
              <!-- Header -->
              <div class="px-3 pb-1 flex items-center justify-between">
                <div class="font-bold text-2xl text-black text-blue-800">
                  Lịch sử trả hàng</div>
              </div>
              <div class="flex items-center justify-center gap-3">
                <p class="mt-3">Sắp xếp theo:</p>
                <div>
                  <Dropdown v-model="orderSelected" :data="orderOptions" class="!w-[300px]" />
                </div>
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
