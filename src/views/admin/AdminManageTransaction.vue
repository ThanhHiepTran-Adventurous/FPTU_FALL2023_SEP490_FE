<script setup>
import AdminHeader from '@/views/admin/common/AdminHeader.vue'
import { onMounted, ref, computed, watch } from 'vue'
import { Carousel } from 'flowbite-vue'
import { initFlowbite } from 'flowbite'
import withdraw from '../../services/withdraw.service'
import '@vuepic/vue-datepicker/dist/main.css'
import toastOption from '@/utils/toast-option'
import moment from 'moment'
import formatCurrency from '@/utils/currency-output-formatter'
import PaymentService from '@/services/payment.service'
import { SIMPLE_TABLE_ITEMS_PER_PAGE } from '@/common/commonStaticState'

const transactionList = ref([])
const itemsPerPage = SIMPLE_TABLE_ITEMS_PER_PAGE
const currentPage = ref(1)
const selectedWithdraw = ref(null)
const showWithdrawModal = ref(false)

const getAllTransaction = async () => {
  try {
    const response = await PaymentService.getTransactionAdmin()
    transactionList.value = response.data
  } catch (e) {
    console.error(e)
  }
}
onMounted(() => {
  getAllTransaction()
  initFlowbite()
})
// Computed property for total pages
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
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return transactionList.value.slice(startIndex, endIndex)
})
const openWithdrawModal = withdraw => {
  selectedWithdraw.value = withdraw
  showWithdrawModal.value = true
}
const handleConfirmWithdraw = async withdrawId => {
  try {
    await withdraw.adminConfirmSellerwithdrawOpt2(withdrawId)
    toastOption.toastSuccess('Xác nhận đã thanh toán thành công')
  } catch (error) {
    toastOption.toastError('Xác nhận đã thanh toán thất bại')
    console.error('withdrawId:', error)
  }
}
const handleExportFileExcel = async () => {
  try {
    await PaymentService.exportFileExcel()
    console.log('File exported successfully!')
  } catch (error) {
    console.error('Error exporting file:', error)
  }
}
</script>

<template>
  <AdminHeader />
  <section class="bg-white ml-20 mt-5 p-3 sm:p-5">
    <div class="mx-auto max-w-screen-lg pl-5 px-4 lg:px-12">
      <!-- Start coding here -->
      <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div class="w-full md:w-1/2"></div>
          <div
            class="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3"></div>
          <button
            @click="handleExportFileExcel"
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Tải xuống lịch sử giao dịch
          </button>
        </div>

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
              </tr>
            </thead>
            <tbody>
              <tr v-for="(trans, index) in paginatedTransactionList" :key="index" class="border-b dark:border-gray-700">
                <th scope="row" class="px-6 whitespace-nowrap py-4 font-normal text-gray-500 dark:text-white">
                  {{ trans.userPaymentOption ? trans.userPaymentOption.fullname : 'Hệ thống' }}
                </th>
                <th scope="row" class="px-6 whitespace-nowrap py-4 font-normal text-gray-500 dark:text-white">
                  {{ trans.userReceiveMoney ? trans.userReceiveMoney.fullname : 'Hệ thống' }}
                </th>
                <td class="px-4 py-3">
                  <div class="font-normal text-blue-500 font-semibold text-right">
                    {{ formatCurrency(trans?.amount) }}
                  </div>
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
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    :class="{
                      'ml-2 border border-yellow-500 bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300':
                        trans?.status === 'PENDING',

                      'ml-2 border border-green-500 bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300':
                        trans?.status === 'SUCCESS',
                    }"
                    >{{
                      trans?.status === 'PENDING'
                        ? 'Đang chờ'
                        : trans?.status === 'SUCCESS'
                        ? 'Đã thanh toán'
                        : trans?.status
                    }}</span
                  >
                </td>

                <td class="px-4 py-3">
                  {{ trans?.transactionDate ? moment.utc(trans?.transactionDate).format('DD/MM/YYYY HH:mm:ss') : '' }}
                </td>
              </tr>
            </tbody>
          </table>
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
  </section>
  <div
    v-if="showWithdrawModal"
    id="WithdrawModal"
    tabindex="-1"
    aria-hidden="true"
    class="fixed inset-0 flex m items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="relative p-4 w-full max-w-4xl md:h-auto">
      <!-- Modal content -->
      <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
        <!-- Modal header -->
        <div class="flex justify-between items-center mb-2 rounded-t border-b sm:mb-5 dark:border-gray-600">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            Thông tin yêu cầu rút tiền
            <span
              :class="{
                'ml-2 border border-yellow-500 bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300':
                  selectedWithdraw?.status === 'PENDING',

                'ml-2 border border-green-500 bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300':
                  selectedWithdraw?.status === 'SUCCESS',
              }"
              >{{
                selectedWithdraw?.status === 'PENDING'
                  ? 'Đang chờ'
                  : selectedWithdraw?.status === 'SUCCESS'
                  ? 'Đã thanh toán'
                  : selectedWithdraw?.status
              }}</span
            >
          </h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-toggle="updateAutionModal"
            @click="showWithdrawModal = false">
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
        <div class="max-h-[600px] overflow-y-auto mt-2">
          <form action="#">
            <div class="grid mt-2 gap-4 mb-4 sm:grid-cols-2">
              <div>
                <label for="bankOwnerName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Tên tài khoản
                </label>
                <input
                  type="text"
                  name="bankOwnerName"
                  :value="selectedWithdraw?.bankOwnerName"
                  readonly
                  id="bankOwnerName"
                  class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
              </div>
              <div>
                <label for="bankAccountNumber" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Số tài khoản</label
                >
                <input
                  type="text"
                  name="bankAccountNumber"
                  id="bankAccountNumber"
                  :value="selectedWithdraw?.bankAccountNumber"
                  readonly
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
              </div>
              <div>
                <label for="bankInformation" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Tên ngân hàng</label
                >
                <input
                  type="text"
                  name="bankInformation"
                  id="bankInformation"
                  :value="selectedWithdraw?.bankInformation"
                  readonly
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
              </div>
              <div>
                <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Số tiền</label>
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  :value="formatCurrency(selectedWithdraw?.amount)"
                  readonly
                  class="bg-gray-50 border border-gray-300 text-blue-600 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
              </div>
            </div>

            <div class="flex items-center mt-2 space-x-4">
              <button
                v-if="selectedWithdraw?.status === 'PENDING'"
                @click="handleConfirmWithdraw(selectedWithdraw?.id)"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Xác nhận đã thanh toán
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
