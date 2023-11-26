<script setup>
import AdminHeader from '@/views/admin/common/AdminHeader.vue'
import { onMounted, ref, computed, watch } from 'vue'
import { initFlowbite } from 'flowbite'
import withdrawService from '../../services/withdraw.service'
import '@vuepic/vue-datepicker/dist/main.css'
import toastOption from '@/utils/toast-option'
import moment from 'moment'
import formatCurrency from '@/utils/currency-output-formatter'
import { SIMPLE_TABLE_ITEMS_PER_PAGE } from '@/common/commonStaticState'
import WithdrawStatusComponent from '@/components/common-components/badge/WithdrawStatusComponent.vue'
import Dropdown from '@/components/common-components/Dropdown.vue'
import { WithdrawRequestStatus, WithdrawRequestType } from '@/common/contract'
import WithdrawTypeComponent from '@/components/common-components/badge/WithdrawTypeComponent.vue'

const filterData = ref({
  type: [
    {
      label: 'Tất cả',
      value: '',
    },
    {
      label: WithdrawRequestType.WITHDRAW.label,
      value: WithdrawRequestType.WITHDRAW.value,
    },
    {
      label: WithdrawRequestType.REFUND_TYPE_IMMEDIATE.label,
      value: WithdrawRequestType.REFUND_TYPE_IMMEDIATE.value,
    },
    {
      label: WithdrawRequestType.REFUND_TYPE_INTERMEDIATE.label,
      value: WithdrawRequestType.REFUND_TYPE_INTERMEDIATE.value,
    },
  ],
  status: [
    {
      label: 'Tất cả',
      value: '',
    },
    {
      label: WithdrawRequestStatus.PENDING.label,
      value: WithdrawRequestStatus.PENDING.value,
    },
    {
      label: WithdrawRequestStatus.SUCCESS.label,
      value: WithdrawRequestStatus.SUCCESS.value,
    },
  ]
})

const selected = ref({
  type: {
    label: 'Tất cả',
    value: '',
  },
  status: {
    label: 'Tất cả',
    value: '',
  }
})

watch(selected, () => {
  filterRecords()
}, {deep: true})


const withdrawsList = ref([])
const filteredWithdrawList = ref([])
const itemsPerPage = SIMPLE_TABLE_ITEMS_PER_PAGE
const currentPage = ref(1)
const selectedWithdraw = ref(null)
const showWithdrawModal = ref(false)

const getAllWithdraws = async () => {
  try {
    const response = await withdrawService.getAllWithdraws(1, 100)
    withdrawsList.value = response.data
    filterRecords()
  } catch (e) {
    console.error(e)
  }
}


const filterRecords = () => {
  filteredWithdrawList.value = withdrawsList.value
    .filter(f => 
    (!selected.value.type.value || f.type === selected.value.type.value) 
    && (!selected.value.status.value || f.status === selected.value.status.value))
    .sort((a,b) => {
        return new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
    })
}


onMounted(() => {
  getAllWithdraws()
  initFlowbite()
})
// Computed property for total pages
const totalPages = computed(() => {
  return Math.ceil(filteredWithdrawList.value.length / itemsPerPage)
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

const paginatedWithdraws = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredWithdrawList.value.slice(startIndex, endIndex)
})
const openWithdrawModal = withdrawDetail => {
  selectedWithdraw.value = withdrawDetail
  showWithdrawModal.value = true
}
const handleConfirmWithdraw = async withdrawId => {
  try {
    showWithdrawModal.value = false
    if(selectedWithdraw.value.type === WithdrawRequestType.WITHDRAW){
      await withdrawService.adminConfirmSellerWithdrawOpt1(withdrawId)
    } else if(selectedWithdraw.value.type === WithdrawRequestType.REFUND_TYPE_INTERMEDIATE){
      await withdrawService.adminConfirmBuyerWithdraw(withdrawId)
    } else {
      await withdrawService.adminConfirmSellerwithdrawOpt2(withdrawId)
    }
    getAllWithdraws()
    toastOption.toastSuccess('Xác nhận đã thanh toán thành công')
    
  } catch (error) {
    toastOption.toastError('Xác nhận đã thanh toán thất bại')
  }
}
</script>

<template>
  <AdminHeader />
  <section class="bg-white mt-5 p-3 sm:p-5">
    <div class="mx-auto pl-72">
      <!-- Header -->
      <div class="pt-3 px-3 pb-1 flex items-center justify-between">
        <div class="font-bold text-2xl text-black text-blue-800">
          Yêu cầu rút tiền</div>
      </div>

      <!-- Filter section -->
      <div class="my-4 px-12 flex items-center">
        <div class="flex items-center gap-3 mr-[10%]">
          <label class="block text-gray-700 text-sm font-bold" for="jump">
            Loại yêu cầu: 
          </label>
          <div class="flex gap-3 items-center">
            <Dropdown :data="filterData.type" v-model="selected.type" class="!w-[300px]" />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <label class="block text-gray-700 text-sm font-bold" for="jump">
            Trạng thái:
          </label>
          <div class="flex items-center gap-3">
            <Dropdown :data="filterData.status" v-model="selected.status" class="!w-[200px]" />
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="bg-white dark:bg-gray-800 relative">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-4 py-3 whitespace-nowrap">Tên tài khoản</th>
                <th scope="col" class="px-4 py-3">Số tài khoản</th>
                <th scope="col" class="px-4 py-3">Tên ngân hàng</th>
                <th scope="col" class="px-4 py-3 text-right">Số tiền</th>
                <th scope="col" class="px-4 py-3 text-center">Trạng thái</th>
                <th scope="col" class="px-4 py-3">Ngày tạo</th>
                <th scope="col" class="px-4 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(withdraw, index) in paginatedWithdraws" :key="index" class="border-b dark:border-gray-700">
                <td class="px-4 py-3">
                  {{ withdraw?.bankOwnerName }}
                </td>
                <td class="px-4 py-3">
                  {{ withdraw?.bankAccountNumber }}
                </td>
                <td class="px-4 py-3">
                  {{ withdraw?.bankInformation }}
                </td>
                <td class="px-4 py-3 font-semibold text-blue-700 text-right">
                  {{ formatCurrency(withdraw?.amount) }}
                </td>
                <td class="px-4 py-3 flex justify-center">
                  <WithdrawStatusComponent :status="withdraw?.status" />
                </td>
                <td class="px-4 py-3">
                  {{ withdraw?.createAt ? moment.utc(withdraw?.createAt).format('DD/MM/YYYY HH:mm:ss') : '' }}
                </td>
                <td class="px-4 py-3 flex items-center justify-end">
                  <button
                    class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                    type="button"
                    @click="openWithdrawModal(withdraw)">
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
          <div class="text-3xl pb-2 font-semibold text-gray-900 dark:text-white flex items-center">
            <div>Thông tin yêu cầu rút tiền</div>
          </div>
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
                  class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
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
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
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
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
              </div>
              <div>
                <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Số tiền</label>
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  :value="formatCurrency(selectedWithdraw?.amount)"
                  readonly
                  class="bg-gray-50 border border-gray-300 text-blue-600 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
              </div>
              <div>
                <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Loại yêu cầu</label>
                <div><WithdrawTypeComponent :status="selectedWithdraw?.type" /></div>
              </div>
              <div>
                <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Trạng thái</label>
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  :value="selectedWithdraw?.status === WithdrawRequestStatus.PENDING.value ? WithdrawRequestStatus.PENDING.label : WithdrawRequestStatus.SUCCESS.label"
                  readonly
                  class="bg-gray-50 border border-gray-300 text-blue-600 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
              </div>
            </div>

            <div class="flex items-center mt-2 space-x-4">
              <button
                v-if="selectedWithdraw?.status === WithdrawRequestStatus.PENDING.value"
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
