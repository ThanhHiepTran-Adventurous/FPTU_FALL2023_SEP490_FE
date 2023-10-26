<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import SearchInput from '../common-components/SearchInput.vue'
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
import constant from '@/common/constant'
import urlConstant from '@/common/urlConstant'
import { useRoute, useRouter } from 'vue-router'
import paymentService from '@/services/payment.service'
import Loading from '../common-components/Loading.vue'

const itemsPerPage = 12
const searchQuery = ref('')
const route = useRoute()
const router = useRouter()
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

  responeCode = queryParams.vnp_ResponseCode
  transactionStatus = queryParams.vnp_TransactionStatus
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
  auctions.value = response.data
  filterData()
  isLoading.value = false
}
const filterData = () => {
  auctionsFiltered.value = auctions.value.filter(
    v => v.modelType === selected.value.value && v.product.status !== 'PAID',
  )
}

const calculateIsInvalidSold = auction => {
  return auction?.product.status === ProductStatus.NOT_REACH_NUM_AUCTIONEER.value
}

const activateInfoAuction = auction => {
  isModalVisible.value = true
  detail.value = auction
}

function closeModal() {
  isModalVisible.value = false
}

function handleConfirm() {
  closeModal()
}

const handlePayment = async () => {
  const returnUrl = `${urlConstant.domain}${route.fullPath}`

  isPaymentLoading.value = true
  const response = await paymentService.paymentForChat(detail.value.id, returnUrl)
  isPaymentLoading.value = false
  const redirectURL = response.data
  window.location.href = redirectURL
}

const closeModalPayment = () => {
  router.push('/manage/product-sold').then(() => {
    location.reload()
  })
}

onMounted(() => {
  fetchAuctions()
  getQueryParameters()
})
</script>

<template>
  <div class="container my-[20px] py-2 mx-auto bg-white rounded-md min-h-[80vh]">
    <div class="mb-4 mx-5 mt-4">
      <div class="mt-3 flex items-center gap-3">
        <Dropdown v-model="selected" :data="options" class="!w-[300px]" />
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
    <div v-else class="flex flex-wrap items-center mt-10 mx-5 gap-3 py-10">
      <ItemSold
        v-for="item in paginatedProducts"
        :key="item.id"
        @click="activateInfoAuction(item)"
        :product-name="item.product.name"
        :price="item.highestPrice"
        :mainImage="imageHelper.getPrimaryImageFromList(item.product.imageUrls)"
        :secondaryImage="imageHelper.getSecondaryImageFromList(item.product.imageUrls)"
        :auction-type="item.modelType"
        :is-invalid-sold="calculateIsInvalidSold(item)" />
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
                      {{ detail?.endDate ? moment(detail?.endDate).format('DD/MM/YYYY HH:mm:ss') : 'N/A' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="p-2 rounded-xl w-full">
            <div class="text-red-500 text-lg">
              Để biết thông tin và tiến hành trao đổi với người thắng cuộc, vui lòng thanh toán phí cho phiên đấu giá.
            </div>
          </div>
        </div>
        <template v-slot:button>
          <div>
            <Button :type="constant.buttonTypes.OUTLINE" @on-click="closeModal"> Hủy </Button>
          </div>
          <div>
            <Button @on-click="handlePayment" v-if="isPaymentLoading === false">
              <div class="flex items-center w-[120px]">
                <Icon icon="streamline:money-wallet-money-payment-finance-wallet" class="text-[18px] mr-3" />
                <div>Thanh toán</div>
              </div>
            </Button>
            <Button v-else disabled>
              <div class="flex items-center text-white w-[120px]">
                <svg class="animate-spin h-5 w-5 mr-3 !text-white" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path
                    class="opacity-100"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div>Thanh toán</div>
              </div>
            </Button>
          </div>
        </template>
      </Modal>
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
                <td class="py-2 px-4 border-b border-grey-light">{{ detail?.endDate ? moment.utc(detail?.endDate).format("DD/MM/YYYY HH:mm:ss") : 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="p-2 rounded-xl w-full">
        <div class="text-red-500 text-lg">
          Để biết thông tin và tiến hành trao đổi với người thắng cuộc, vui lòng thanh toán phí cho phiên đấu giá.
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
          @click="closeModalPayment"
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
          @click="closeModalPayment"
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
