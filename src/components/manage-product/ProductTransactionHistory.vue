<script setup>
import PaymentService from '@/services/payment.service'
import { onMounted, ref, computed, watch } from 'vue'
import moment from 'moment'
import formatCurrency from '@/utils/currency-output-formatter'
import { sellerTabs } from '@/common/constant'
import SellerSideBarLayout from '@/layouts/SellerSideBarLayout.vue'
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import { SIMPLE_TABLE_ITEMS_PER_PAGE } from '@/common/commonStaticState'
import TransactionStatusBadgeVue from '../common-components/badge/TransactionStatusBadge.vue'
import { useUserStore } from '@/stores/user.store'

const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Giao dịch',
    to: '',
    disabled: true,
  },
]

const transactionList = ref([])
const itemsPerPage = SIMPLE_TABLE_ITEMS_PER_PAGE
const currentPage = ref(1)
const getAllTransaction = async () => {
  try {
    const response = await PaymentService.getTransactionBuyerSeller()
    transactionList.value = response.data
  } catch (e) {
    console.error(e)
  }
}
onMounted(() => {
  getAllTransaction()
})

const totalPages = computed(() => {
  return Math.ceil(transactionList.value.length / itemsPerPage)
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
const paginatedTransactionList = computed(() => {
  // Move startIndex and endIndex calculation here
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return transactionList.value.slice(startIndex, endIndex)
})

const userStore = useUserStore()
const isSelf = (id) => {
  return userStore.getUserIdAndGetFromLocalStorageIfNotExist() === id;
}
</script>

<template>
  <div class="w-full">
    <!-- Breadcrumb -->
    <div class="pt-2 pb-2 container mx-auto">
      <Breadcrumb :items="breadcrumbItems" />
    </div>

    <!-- Main content -->
    <SellerSideBarLayout :cur-tab="sellerTabs.transactions.value">
      <div class="bg-white container mx-auto rounded w-full min-h-[80vh]">
        <!-- Header -->
        <div class="pt-3 px-3 pb-1 flex items-center justify-between">
          <div class="font-bold text-2xl text-black text-blue-800">Lịch sử giao dịch</div>
        </div>
        <section class="sm:p-5">
          <div class="bg-white relative">
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Bên gửi</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Bên nhận</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Số tiền</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Thể loại</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Trạng thái</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(trans, index) in paginatedTransactionList"
                    :key="index"
                    class="border-b dark:border-gray-700">
                    <td class="px-6 py-4 font-normal text-gray-500 dark:text-white" :class="isSelf(trans.userPayment.id) ? '!text-blue-500 !font-semibold' : ''">
                      {{ isSelf(trans.userPayment.id) ? 'Tôi' : trans.userPayment.fullname }}
                    </td>
                    <td class="px-6 py-4 font-normal text-gray-500 dark:text-white" :class="{
                      '!text-blue-500 !font-semibold': isSelf(trans.userReceiveMoney?.id),
                      '!text-red-500 !font-semibold': !trans.userReceiveMoney
                    }">
                      {{ trans.userReceiveMoney ? (isSelf(trans.userReceiveMoney?.id) ? 'Tôi' : trans.userReceiveMoney?.fullname) : 'Hệ thống' }}
                    </td>
                    <td class="px-4 py-3">
                      <div class="font-normal text-gray-500">{{ formatCurrency(trans?.amount) }}</div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="font-normal text-gray-500">
                        {{
                          trans?.type === 'SELLER_PAY_FOR_MESSAGING'
                            ? 'Thanh toán cho việc nhắn tin tự trao đổi'
                            : trans?.type === 'SELLER_REQUEST_REFUND'
                            ? 'Người bán yêu cầu hoàn tiền'
                            : trans?.type === 'BUYER_REQUEST_REFUND'
                            ? 'Người mua yêu cầu hoàn tiền'
                            : trans?.type === 'BUYER_PAY_FOR_AUCTION'
                            ? 'Thanh toán qua hệ thống cho phiên đấu giá'
                            : trans?.type === 'SELLER_WITHDRAW_FROM_HOLDING'
                            ? 'Người bán yêu cầu rút tiền cho sản phẩm đã bán thành công'
                            : ''
                        }}
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="font-normal text-gray-500"><TransactionStatusBadgeVue :status="trans?.status" /></div>
                    </td>

                    <td class="px-4 py-3">
                      {{
                        trans?.transactionDate ? moment.utc(trans?.transactionDate).format('DD/MM/YYYY HH:mm:ss') : ''
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>

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
        </section>
      </div>
    </SellerSideBarLayout>
  </div>
</template>
