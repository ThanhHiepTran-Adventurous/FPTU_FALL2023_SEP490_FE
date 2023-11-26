<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import moment from 'moment'
import formatCurrency from '@/utils/currency-output-formatter'
import { WithdrawRequestStatus, WithdrawRequestType } from '@/common/contract'
import Dropdown from '@/components/common-components/Dropdown.vue'
import withdrawService from '@/services/withdraw.service'
import { useUserStore } from '@/stores/user.store'
import WithdrawStatusComponent from '@/components/common-components/badge/WithdrawStatusComponent.vue'
import { SIMPLE_TABLE_ITEMS_PER_PAGE } from '@/common/commonStaticState'

//filter
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

const userStore = useUserStore()

const records = ref([])
const filteredRecords = ref([])

const itemsPerPage = SIMPLE_TABLE_ITEMS_PER_PAGE
const currentPage = ref(1)
const getAllRecords = async () => {
  try {
    const response = await withdrawService.getWithDrawsByUserId(1, 1000, userStore.getUserIdAndGetFromLocalStorageIfNotExist())
    records.value = response.data
    filterRecords()
  } catch (e) {
    console.error(e)
  }
}

const filterRecords = () => {
    filteredRecords.value = records.value
        .filter(f => 
        (!selected.value.type.value || f.type === selected.value.type.value) 
        && (!selected.value.status.value || f.status === selected.value.status.value))
        .sort((a,b) => {
            return new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        })
}

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredRecords.value.length / itemsPerPage)
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
const paginatedRecords = computed(() => {
  // Move startIndex and endIndex calculation here
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredRecords.value.slice(startIndex, endIndex)
})

onMounted(() => {
  getAllRecords()
})
</script>

<template>
  <div class="bg-white container mx-auto rounded w-full min-h-[80vh]">
    <!-- Header -->
    <div class="pt-3 px-3 pb-1 flex items-center justify-between">
      <div class="font-bold text-2xl text-black text-blue-800">
        Yêu cầu rút tiền</div>
    </div>

    <!-- Filter section -->
    <div class="mt-4 px-12 flex items-center">
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
    <section class="bg-white mt-12">
      <div class="mx-auto px-4">
        <!-- Start coding here -->
        <div class="bg-white relative">
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-4 py-3 whitespace-nowrap">Tên tài khoản</th>
                  <th scope="col" class="px-4 py-3">Số tài khoản</th>
                  <th scope="col" class="px-4 py-3">Tên ngân hàng</th>
                  <th scope="col" class="px-4 py-3 text-right">Số tiền</th>
                  <th scope="col" class="px-4 py-3 text-center">Trạng thái</th>
                  <th scope="col" class="px-4 py-3">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(withdraw, index) in paginatedRecords" :key="index" class="border-b dark:border-gray-700">
                  <td class="px-4 py-3">
                    {{ withdraw?.bankOwnerName }}
                  </td>
                  <td class="px-4 py-3">
                    {{ withdraw?.bankAccountNumber }}
                  </td>
                  <td class="px-4 py-3">
                    {{ withdraw?.bankInformation }}
                  </td>
                  <td class="px-4 py-3 text-right font-semibold text-blue-700">
                    {{ formatCurrency(withdraw?.amount) }}
                  </td>
                  <td class="px-4 py-3 flex justify-center">
                    <WithdrawStatusComponent :status="withdraw?.status" />
                  </td>
                  <td class="px-4 py-3">
                    {{ withdraw?.createAt ? moment.utc(withdraw?.createAt).format('DD/MM/YYYY HH:mm:ss') : '' }}
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
  </div>
</template>