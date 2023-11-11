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

const transactionList = ref([])
const itemsPerPage = 4
const currentPage = ref(1)
const selectedWithdraw = ref(null)
const showWithdrawModal = ref(false)

const getAllTransaction = async () => {
  try {
    const response = await PaymentService.getTransactionAdmin()
    transactionList.value = response.data
    console.log(response.data)
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
    const response = await withdraw.adminConfirmSellerwithdrawOpt2(withdrawId)
    toastOption.toastSuccess('Xác nhận đã thanh toán thành công')
    console.log(response)
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  } catch (error) {
    toastOption.toastError('Xác nhận đã thanh toán thất bại')
    console.error('withdrawId:', error)
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
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3 whitespace-nowrap">Họ và tên</th>
                <th scope="col" class="px-6 py-3 whitespace-nowrap">Số tiền</th>
                <th scope="col" class="px-6 py-3 whitespace-nowrap">Thể loại</th>
                <th scope="col" class="px-6 py-3 whitespace-nowrap">Trạng thái</th>
                <th scope="col" class="px-6 py-3 whitespace-nowrap">Ngày tạo</th>
                <th scope="col" class="px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(trans, index) in paginatedTransactionList" :key="index" class="border-b dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-normal text-gray-500 dark:text-white">
                  {{ trans?.userPayment?.fullname }}
                </th>
                <td class="px-4 py-3">
                  <div class="font-normal text-gray-500">{{ formatCurrency(trans?.amount) }}</div>
                </td>
                <td class="px-4 py-3">
                  <div class="font-normal text-gray-500">{{ trans?.type }}</div>
                </td>
                <td class="px-4 py-3">
                  <div class="font-normal text-gray-500">{{ trans?.status }}</div>
                </td>

                <td class="px-4 py-3">
                  {{ trans?.transactionDate ? moment.utc(trans?.transactionDate).format('DD/MM/YYYY HH:mm:ss') : '' }}
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
              <!-- <button
                @click="showRejectReasonModal = true"
                type="button"
                class="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                <svg
                  class="mr-1 -ml-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"></path>
                </svg>
                Từ chối
              </button> -->
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
