<script setup>
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import auctionService from '@/services/auction.service'
import paymentService from '@/services/payment.service'
import orderService from '@/services/order.service'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import imageHelper from '@/utils/image-helper'
import formatCurrency from '@/utils/currency-output-formatter'
import loginService from '../../../services/login.service'
import moment from 'moment'
import locationService from '../../../services/location.service'
import AuctionType from '@/components/common-components/badge/AuctionType.vue'
import SearchInput from '@/components/common-components/SearchInput.vue'
import { AuctionModelType } from '@/common/contract'
import { Icon } from '@iconify/vue'
import BoughtNav from '../BoughtNav.vue'
import Dropdown from '@/components/common-components/Dropdown.vue'
import urlConstant from '@/common/urlConstant'
import ComingSoonPage from '@/views/common/ComingSoonPage.vue'
const showPaymentModel = ref(false)
import { buyerTabs } from '@/common/constant'
import SideBarLayout from '../SideBarLayout.vue'

const route = useRoute()
const router = useRouter()
let responeCode = ref('')
let transactionStatus = ref('')
let autionIdd = ref('')

const isInEditMode = ref(false)
const getQueryParameters = () => {
  const queryParams = route.query
  responeCode = queryParams.vnp_ResponseCode
  transactionStatus = queryParams.vnp_TransactionStatus
}
const updateAddressOrderAfterPayment = async () => {
  const storedData = localStorage.getItem('paymentAddressData')
  const storedPaymentData = JSON.parse(storedData)
  const retrievedAuctionId = storedPaymentData?.auctionId
  const buyerPhoneNumber = storedPaymentData?.phone
  const buyerAddress = `${storedPaymentData?.address}, ${storedPaymentData?.district}, ${storedPaymentData?.province}, ${storedPaymentData?.ward}`
  localStorage.removeItem('paymentAddressData')
  const updatedAddressData = {
    buyerPhoneNumber,
    buyerAddress,
  }
  if (responeCode === '00' && transactionStatus === '00') {
    const response = await orderService.getOrdersByAuctionId(retrievedAuctionId)
    const orderId = response.data.id
    if (orderId) {
      const ress = await orderService.updateAddressBuyerOpt2(orderId, updatedAddressData)
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
    text: 'Đã mua',
    to: '/bought',
    disabled: true,
  },
]
const auctionWins = ref([])
const auctionWinFiltered = ref([])

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
const OpenPaymentModel = autionId => {
  showPaymentModel.value = true
  autionIdd = autionId
}

const closeModal = () => {
  router.push('/bought').then(() => {
    location.reload()
  })
}
const filterData = () => {
  auctionWinFiltered.value = auctionWins?.value
    ?.filter(
      v => v.informationAuction.modelType === selected.value.value && v.informationAuction.product.status !== 'PAID',
    )
    .sort((a, b) => {
      return new Date(b.winAt).getTime() - new Date(a.winAt).getTime()
    })
}
const fetchAuctionWinData = async () => {
  const response = await auctionService.getListAuctionWin()
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
    const returnUrl = `${urlConstant.domain}${route.fullPath}`

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
    <div class="mt-3 mb-3 container mx-auto">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
    <BoughtNav :cur-tab="buyerTabs.bought.value" />

    <!-- Main section -->
    <div class="bg-white container mx-auto">
      <div class="mb-4 mr-5 ml-5 mt-2 pt-2">
        <div class="mt-3 flex items-center gap-3">
          <Dropdown v-model="selected" :data="options" class="!w-[300px]" />
          <div class="w-full">
            <SearchInput placeholder="       Search a product" addOnInputClass="w-full" />
          </div>
        </div>
      </div>

      <div class="bg-white grid grid-cols-3 gap-2 pt-2 pb-5 w-full px-5">
        <div
          v-for="auction in auctionWinFiltered"
          :key="auction.id"
          class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <div class="pl-2">
            <img
              class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
              :src="imageHelper.getPrimaryImageFromList(auction.informationAuction.product.imageUrls)"
              alt="" />
          </div>
          <div class="flex flex-col justify-between p-4 leading-normal">
            <div class="text-xl font-semibold mb-1 tracking-tight text-gray-900 dark:text-white">
              {{ auction.informationAuction.product.name }}
            </div>
            <AuctionType :type="auction.informationAuction.modelType" />
            <div class="font-normal text-gray-700 dark:text-gray-400 mt-6 flex items-center">
              <span>Giá đạt được: </span>
              <span class="text-blue-600 text-2xl font-semibold ml-3">{{ formatCurrency(auction.finalPrice) }}</span>
            </div>
            <div class="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Đạt được lúc:
              <span class="text-blue-600">{{ moment.utc(auction.winAt).format('DD/MM/YYYY HH:mm:ss') }}</span>
            </div>
            <div
              v-if="auction.informationAuction.modelType === AuctionModelType.immediate"
              class="bg-blue-600 text-white rounded-lg px-6 py-2 flex items-center !w-[180px]">
              <div><Icon icon="ic:outline-chat" class="text-[24px] mr-3" /></div>
              <div class="text-lg">Liên hệ</div>
            </div>
            <div v-else>
              <button
                type="button"
                @click="OpenPaymentModel(auction.informationAuction.id)"
                class="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover-bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                <Icon icon="streamline:money-wallet-money-payment-finance-wallet" class="text-[24px] mr-3" />
                <span class="text-lg w-max">Thanh toán</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="showPaymentModel"
    id="authentication-modal"
    aria-hidden="true"
    class="fixed inset-0 flex m items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="relative w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <button
          @click="showPaymentModel = false"
          type="button"
          class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-hide="authentication-modal">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="px-6 py-6 lg:px-8">
          <form class="space-y-6" @submit.prevent="payment(autionIdd)">
            <div class="flex-1 bg-white rounded-lg p-8">
              <div class="flex items-center">
                <div class="text-xl text-gray-900 font-bold mr-3">Thông tin giao hàng</div>
                <Icon
                  icon="iconamoon:edit-duotone"
                  class="text-[26px] text-blue-500 hover:cursor-pointer hover:text-blue-600"
                  @click="isInEditMode = true" />
              </div>
              <ul class="mt-2 text-gray-700">
                <li class="flex border-b py-2">
                  <label for="phone" class="font-bold mr-1">Điện thoại:</label>
                  <input
                    v-model="profileModelData.phone"
                    type="text"
                    name="phone"
                    id="phone"
                    required
                    class="bg-white focus:bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block py-1 w-[63%]" />
                </li>

                <li class="flex border-b py-2">
                  <label for="address" class="font-bold whitespace-nowrap">Địa chỉ:</label>

                  <div v-if="isInEditMode" class="w-full ml-4">
                    <input
                      v-model="profileModelData.address"
                      type="text"
                      name="address"
                      id="address"
                      required
                      class="bg-white focus:bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block py-1 w-[63%]" />
                    <div class="flex flex-col w-[full] gap-3 mt-3">
                      <div class="flex flex-col items-left gap-1">
                        <div>Tỉnh / Thành phố:</div>
                        <Dropdown required v-model="selectedProvince" :data="provinces" class="!w-[300px]" />
                      </div>
                      <div class="flex flex-col items-left gap-1">
                        <div>Quận / Huyện:</div>
                        <Dropdown required v-model="selectedDistrict" :data="districts" class="!w-[300px]" />
                      </div>
                      <div class="flex flex-col items-left gap-1">
                        <div>Phường / Xã:</div>
                        <Dropdown required v-model="selectedWard" :data="wards" class="!w-[300px]" />
                      </div>
                    </div>
                  </div>
                  <span v-else class="text-gray-700">{{ profileModelData.address || 'N/A' }}</span>
                </li>
              </ul>
              <div class="flex items-center" v-if="isInEditMode"></div>
            </div>

            <button
              type="submit"
              class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Thanh toán
            </button>
          </form>
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
