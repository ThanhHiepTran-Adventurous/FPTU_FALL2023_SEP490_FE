<script setup>
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import { buyerTabs } from '@/common/constant'
import { onMounted, ref, computed } from 'vue'
import moment from 'moment'
import PaymentService from '@/services/payment.service'
import formatCurrency from '@/utils/currency-output-formatter'
import BuyerSideBarLayout from '@/layouts/BuyerSideBarLayout.vue'
import { SIMPLE_TABLE_ITEMS_PER_PAGE } from '@/common/commonStaticState'

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
  return Math.ceil(transactionList.value?.length / itemsPerPage)
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
  return transactionList.value?.slice(startIndex, endIndex)
})
const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Đã mua',
    to: '/TransactionPage',
    disabled: true,
  },
]
</script>
<template>
  <div class="w-full">
    <div class="mt-2 mb-2 container mx-auto">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
    <BuyerSideBarLayout :cur-tab="buyerTabs.transaction.value">
      <div class="bg-white container mx-auto rounded w-full min-h-[80vh]">
        <!-- Header -->
        <div class="pt-3 px-3 pb-1 flex items-center justify-between">
          <div class="font-bold text-2xl text-black text-blue-800">Lịch sử giao dịch</div>
        </div>
        <section class="sm:p-5">
          <div class="bg-white relative">
            <!-- Start coding here -->
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Bên gửi</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Bên nhận</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap text-right">Số tiền</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Thể loại</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Trạng thái</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Ngày tạo</th>
                    <th scope="col" class="px-6 py-3">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(trans, index) in paginatedTransactionList"
                    :key="index"
                    class="border-b dark:border-gray-700">
                    <th scope="row" class="px-6 whitespace-nowrap py-4 font-normal text-gray-500 dark:text-white">
                      {{ trans.userPayment ? trans.userPayment.fullname : 'Hệ thống' }}
                    </th>
                    <th scope="row" class="px-6 whitespace-nowrap py-4 font-normal text-gray-500 dark:text-white">
                      {{ trans.userReceiveMoney ? trans.userReceiveMoney.fullname : 'Hệ thống' }}
                    </th>
                    <td class="px-4 py-3">
                      <div class="font-normal text-blue-500 font-semibold text-right">{{ formatCurrency(trans?.amount) }}</div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="font-normal text-gray-500">{{ trans?.type }}</div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="font-normal text-gray-500">{{ trans?.status }}</div>
                    </td>

                    <td class="px-4 py-3">
                      {{
                        trans?.transactionDate ? moment.utc(trans?.transactionDate).format('DD/MM/YYYY HH:mm:ss') : ''
                      }}
                    </td>
                    <td class="px-4 py-3 flex items-center justify-end">
                      <button
                        class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                        type="button"
                        @click="openShipModal(ship)">
                        <svg
                          class="w-6 h-6 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 18">
                          <path
                            d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z" />
                          <path
                            d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z" />
                        </svg>
                      </button>
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
    </BuyerSideBarLayout>
  </div>
</template>
