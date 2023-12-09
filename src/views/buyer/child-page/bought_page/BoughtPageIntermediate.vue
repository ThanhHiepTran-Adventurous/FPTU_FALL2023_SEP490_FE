<script setup>
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import auctionService from '@/services/auction.service'
import paymentService from '@/services/payment.service'
import orderService from '@/services/order.service'
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import imageHelper from '@/utils/image-helper'
import loginService from '../../../../services/login.service'
import locationService from '../../../../services/location.service'
import { AuctionModelType } from '@/common/contract'
import { Icon } from '@iconify/vue'
import Dropdown from '@/components/common-components/Dropdown.vue'
const showPaymentModel = ref(false)
import { buyerTabs } from '@/common/constant'
import { intermediateScriptBoughtPage } from '@/common/commonStaticState'
import { Tooltip } from 'ant-design-vue';
import SideBarLayout from '../../../../layouts/BuyerSideBarLayout.vue'
import TwoOptionsTab from '@/components/TwoOptionsTab.vue'
import AuctionCard from '@/components/AuctionCard.vue'
import Loading from '@/components/common-components/Loading.vue'

const route = useRoute()
const router = useRouter()
let responeCode = ref('')
let transactionStatus = ref('')
let autionIdd = ref('')

const getQueryParameters = () => {
  const queryParams = route.query
  responeCode.value = queryParams.vnp_ResponseCode
  transactionStatus.value = queryParams.vnp_TransactionStatus
}
const updateAddressOrderAfterPayment = async () => {
  const storedData = localStorage.getItem('paymentAddressData')
  const storedPaymentData = JSON.parse(storedData)
  const retrievedAuctionId = storedPaymentData?.auctionId
  const buyerPhoneNumber = storedPaymentData?.phone
  const buyerAddress = `${storedPaymentData?.address}${
    storedPaymentData?.district ? ', ' + storedPaymentData?.district : ''
  }${storedPaymentData?.province ? ', ' + storedPaymentData?.province : ''}${
    storedPaymentData?.ward ? ', ' + storedPaymentData?.ward : ''
  }`
  localStorage.removeItem('paymentAddressData')
  const updatedAddressData = {
    buyerPhoneNumber,
    buyerAddress,
  }
  if (responeCode.value === '00' && transactionStatus.value === '00') {
    const response = await orderService.getOrdersByAuctionId(retrievedAuctionId)
    const orderId = response.data.id
    if (orderId) {
      await orderService.updateAddressBuyerOpt2(orderId, updatedAddressData)
    }
  }
}
const selectedDistrict = ref({
  label: '',
  data: '',
})
const selectedProvince = ref({
  label: '',
  data: '',
})
const selectedWard = ref({
  label: '',
  data: '',
})
const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Thắng đấu giá',
    to: '/bought/intermediate',
    disabled: true,
  },
]

const isLoading = ref(false)
const auctionWins = ref([])
const auctionWinFiltered = ref([])

const openPaymentModel = autionId => {
  showPaymentModel.value = true
  autionIdd.value = autionId
}

const closeModal = () => {
  router.push('/bought/intermediate').then(() => {
    location.reload()
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
const filterData = () => {
  auctionWinFiltered.value = auctionWins?.value
    ?.filter(
      v =>
        v.informationAuction.modelType === AuctionModelType.intermediate &&
        v.informationAuction.product.status !== 'PAID',
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
const profileModelData = ref({
  phone: '',
  address: '',
})
const setProfileModel = userInfo => {
  profileModelData.value.address = ''
  profileModelData.value.phone = userInfo.phoneNum
}
const fetchUserdata = async () => {
  const userInfo = await loginService.fetchUserInfo()
  setProfileModel(userInfo.data)
}
onMounted(async () => {
  fetchUserdata()
  fetchAuctionWinData()
  getQueryParameters()
  updateAddressOrderAfterPayment()
  const provincesFetch = await locationService.fetchAllProvinces()
  provinces.value = provincesFetch.data.map(p => {
    return {
      label: p.name,
      data: p.code,
    }
  })
})

const payment = async auctionId => {
  try {
    const curHost = `${window.location.protocol}//${window.location.host}/#`
    const returnUrl = `${curHost}${route.fullPath}`
    const paymentData = {
      auctionId: auctionId,
      address: profileModelData.value.address,
      district: selectedDistrict.value.label,
      province: selectedProvince.value.label,
      ward: selectedWard.value.label,
      phone: profileModelData.value.phone,
    }

    const jsonData = JSON.stringify(paymentData)
    localStorage.setItem('paymentAddressData', jsonData)
    const response = await paymentService.paymentOption2(auctionId, returnUrl)
    const redirectURL = response.data.paymentUrl

    window.location.href = redirectURL
  } catch (error) {
    console.error('Error during payment:', error)
  }
}

const provinces = ref([])
const wards = ref([])
const districts = ref([])

watch(selectedProvince, async () => {
  const districtsFetch = await locationService.fetchAllDistrictOfProvinces(selectedProvince.value.data)
  districts.value = districtsFetch.data.map(p => {
    return {
      label: p.name,
      data: p.code,
    }
  })
})

watch(selectedDistrict, async () => {
  const wardFetch = await locationService.fetchAllWardOfDistrict(selectedDistrict.value.data)
  wards.value = wardFetch.data.map(p => {
    return {
      label: p.name,
      data: p.code,
    }
  })
})
</script>

<template>
  <div class="w-full">
    <div class="pt-2 pb-2 container mx-auto">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
    <SideBarLayout :cur-tab="buyerTabs.bought.value">
      <div class="bg-white container mx-auto rounded min-h-[80vh] w-full">
        <!-- Header -->
        <div class="pt-3 px-3 pb-1 flex items-center justify-between">
          <div class="font-bold text-2xl text-black text-blue-800 flex">
            <div>Sản phẩm thắng đấu giá</div>
            <Tooltip class="relative ml-3" placement="rightBottom">
              <template #title>{{ intermediateScriptBoughtPage }}</template>
              <Icon icon="ooui:notice" class="text-[15px] text-yellow-300" />
            </Tooltip>
          </div>
          <div>
            <TwoOptionsTab
              immediate-option-nav="/bought/immediate"
              intermediate-option-nav="/bought/intermediate"
              :cur-tab="AuctionModelType.intermediate" />
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

        <div class="flex flex-col justify-between min-h-[60vh]">
          <Loading v-if="isLoading"/>
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

      </div>
    </SideBarLayout>

    <!-- Main section -->
  </div>
  <div
    v-if="showPaymentModel"
    id="authentication-modal"
    aria-hidden="true"
    class="fixed inset-0 flex m items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="relative w-full max-w-md max-h-full">
      <div
        id="updateProductModal"
        aria-hidden="true"
        class="fixed inset-0 flex top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
        <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
          <!-- Modal content -->
          <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            <!-- Modal header -->
            <div class="flex justify-between items-center rounded-t border-b sm:mb-5 dark:border-gray-600">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Thông tin giao hàng</h3>
              <button
                @click="showPaymentModel = false"
                type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="updateProductModal">
                <svg
                  aria-hidden="true"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"></path>
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            <!-- Modal body -->
            <div>
              <div class="grid gap-4 mb-4 sm:grid-cols-2">
                <div>
                  <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Số điện thoại</label
                  >
                  <input
                    name="phone"
                    type="text"
                    v-model="profileModelData.phone"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                </div>
                <div>
                  <label for="address" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Số nhà</label
                  >
                  <input
                    type="text"
                    name="address"
                    id="address"
                    v-model="profileModelData.address"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                </div>
                <div>
                  <label for="districts" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Tỉnh / Thành phố</label
                  >
                  <Dropdown
                    required
                    v-model="selectedProvince"
                    :data="provinces"
                    class="!w-[280px] block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                </div>
                <div>
                  <label for="districts" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Quận / Huyện</label
                  >
                  <Dropdown
                    required
                    v-model="selectedDistrict"
                    :data="districts"
                    class="!w-[280px] block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                </div>
                <div>
                  <label for="wards" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Phường / Xã</label
                  >
                  <Dropdown
                    required
                    v-model="selectedWard"
                    :data="wards"
                    class="!w-[280px] block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <button
                  type="submit"
                  @click="payment(autionIdd)"
                  class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="responeCode === '00' && transactionStatus === '00'"
    id="successModal"
    aria-hidden="true"
    class="bg-black bg-opacity-50 flex m items-center justify-cente overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
    <div class="relative p-4 w-full max-w-md h-full md:h-auto">
      <!-- Modal content -->
      <div class="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
        <button
          type="button"
          @click="closeModal"
          class="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"></path>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div
          class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5">
          <svg
            aria-hidden="true"
            class="w-8 h-8 text-green-500 dark:text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"></path>
          </svg>
          <span class="sr-only">Success</span>
        </div>
        <p class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Thanh toán thành công</p>
      </div>
    </div>
  </div>
  <div
    v-if="transactionStatus === '02'"
    id="deleteModal"
    aria-hidden="true"
    class="bg-black bg-opacity-50 flex m items-center justify-cente overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
    <div class="relative p-4 w-full max-w-md h-full md:h-auto">
      <!-- Modal content -->
      <div class="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
        <button
          @click="closeModal"
          type="button"
          class="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"></path>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <svg
          class="text-red-500 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Thanh toán thất bại. Vui lòng thử lại</p>
      </div>
    </div>
  </div>
</template>
