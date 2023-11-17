<script setup>
import reportService from '@/services/report.service'
import { onMounted, ref, computed, watch } from 'vue'
import moment from 'moment'
import Modal from '@/components/common-components/Modal.vue'
import formatCurrency from '@/utils/currency-output-formatter'
import AuctionType from '@/components/common-components/badge/AuctionType.vue'
import ListExpandableImage from '@/components/ListExpandableImage.vue'
import { AuctionModelType, ReportStatus, Role } from '@/common/contract'
import TwoOptionsTab from '@/components/TwoOptionsTab.vue'
import { buyerTabs, sellerTabs, SIMPLE_TABLE_ITEMS_PER_PAGE } from '@/common/constant'
import Dropdown from '@/components/common-components/Dropdown.vue'
import ReportStatusBadge from '@/components/common-components/badge/ReportStatusBadge.vue'
import { Icon } from '@iconify/vue'
import SellerSideBarLayout from '@/layouts/SellerSideBarLayout.vue'
import Breadcrumb from '@/layouts/Breadcrumb.vue'

const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Tố cáo',
    to: '/reports/intermediate',
    disabled: true,
  },
]

//filter
const filterData = ref({
  fromRole: [
    {
      label: 'Tất cả',
      value: '',
    },
    {
      label: 'Người mua',
      value: Role.buyer.value,
    },
    {
      label: 'Người bán',
      value: Role.seller.value,
    },
  ],
  status: [
    {
      label: 'Tất cả',
      value: '',
    },
    {
      label: ReportStatus.PROCESSING.label,
      value: ReportStatus.PROCESSING.value,
    },
    {
      label: ReportStatus.PROCESSED.label,
      value: ReportStatus.PROCESSED.value,
    },
    {
      label: ReportStatus.REJECTED.label,
      value: ReportStatus.REJECTED.value,
    },
  ]
})
const selected = ref({
  fromRole: {
    label: 'Tất cả',
    value: '',
  },
  status: {
    label: 'Tất cả',
    value: '',
  }
})

watch(selected, () => {
  filterReports()
}, {deep: true})

const reportList = ref([])
const filteredReports = ref([])
const report = ref(null)
const isModalVisible = ref(false)

const openReportModal = (detail) => {
  report.value = detail
  isModalVisible.value = true
}
const closeReportModal = () => {
  isModalVisible.value = false
}

const itemsPerPage = SIMPLE_TABLE_ITEMS_PER_PAGE
const currentPage = ref(1)
const getAllReportStaff = async () => {
  try {
    const response = await reportService.getAllReportDataBuyerOrSeller()
    reportList.value = response.data.filter(f => f.aboutOrder.modelTypeAuctionOfOrder === AuctionModelType.immediate)
    filterReports()
  } catch (e) {
    console.error(e)
  }
}

const filterReports = () => {
  filteredReports.value = reportList.value
  .filter(f => 
  (!selected.value.fromRole.value || f.fromUserReport.role === selected.value.fromRole.value) 
  && (!selected.value.status.value || f.status === selected.value.status.value))
}

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredReports.value.length / itemsPerPage)
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
const paginatedReportList = computed(() => {
  // Move startIndex and endIndex calculation here
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredReports.value.slice(startIndex, endIndex)
})

onMounted(() => {
  getAllReportStaff()
})
</script>

<template>
  <div class="pt-2 pb-2 container mx-auto">
    <Breadcrumb :items="breadcrumbItems" />
  </div>
  <SellerSideBarLayout :cur-tab="sellerTabs.reported.value">
    <div class="bg-white container mx-auto rounded w-full min-h-[80vh]">
      <!-- Header -->
      <div class="pt-3 px-3 pb-1 flex items-center justify-between">
        <div class="font-bold text-2xl text-black text-blue-800">
          Lịch sử báo cáo</div>
        <TwoOptionsTab
          immediate-option-nav="/manage/report/immediate"
          intermediate-option-nav="/manage/report/intermediate"
          :cur-tab="AuctionModelType.immediate"
        />
      </div>

      <!-- Filter section -->
      <div class="mt-4 px-12 flex items-center">
        <div class="flex items-center gap-3 mr-[10%]">
          <label class="block text-gray-700 text-sm font-bold" for="jump">
            Tố cáo từ: 
          </label>
          <div class="flex gap-3 items-center">
            <Dropdown :data="filterData.fromRole" v-model="selected.fromRole" class="!w-[200px]" />
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

      <section class="sm:p-5">
        <div class="mx-auto px-4">
          <div class="bg-white relative sm:rounded-lg overflow-hidden">
            <div class="overflow-x-auto min-h-[632px]">
              <table class="w-full text-sm text-left text-black dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Người tố cáo</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Người bị tố cáo</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Lý do tố cáo</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Ngày tạo</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap text-center">Trạng thái</th>

                    <th scope="col" class="px-6 py-3">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(report, index) in paginatedReportList" :key="index" class="border-b dark:border-gray-700">
                    <th scope="row" class="px-6 py-4 font-normal text-black dark:text-white">
                      {{ report?.fromUserReport?.fullname }}
                    </th>
                    <td class="px-4 py-3">
                      <div class="font-normal text-black">{{ report?.toUserReport?.fullname }}</div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="font-normal text-black">{{ report?.content }}</div>
                    </td>
                    <td class="px-4 py-3">
                      {{ report?.createAt ? moment.utc(report?.createAt).format('DD/MM/YYYY HH:mm:ss') : '' }}
                    </td>
                    <td class="px-4 py-3">
                      <div class="font-normal text-black flex justify-center"><ReportStatusBadge :status="report?.status" /></div>
                    </td>
                    <td class="px-4 py-3 flex items-center justify-end">
                      <button
                        class="inline-flex items-center p-0.5 text-sm font-medium text-center text-black hover:text-gray-800 rounded-lg"
                        type="button" @click="openReportModal(report)">
                        <Icon icon="bxs:detail" class="font-bold text-[24px]"/>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <nav class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
              aria-label="Table navigation">
              <ul class="inline-flex items-stretch -space-x-px">
                <li>
                  <button type="button"
                    class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-black bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    @click="goToPreviousPage" :disabled="currentPage === 1" aria-label="Previous Page">
                    <span class="sr-only">Previous</span>
                    <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                </li>
                <!-- Generate pagination links -->
                <li v-for="pageNumber in totalPages" :key="pageNumber">
                  <button type="button" class="flex items-center justify-center text-sm py-2 px-3 leading-tight" :class="{
                    'text-black bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white':
                      pageNumber !== currentPage,
                    'text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white':
                      pageNumber === currentPage,
                  }" @click="goToPage(pageNumber)" aria-label="Page {{ pageNumber }}">
                    {{ pageNumber }}
                  </button>
                </li>
                <li>
                  <button type="button" @click="goToNextPage"
                    class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-black bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    :disabled="currentPage === totalPages" aria-label="Next Page">
                    <span class="sr-only">Next</span>
                    <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd"
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
  <Modal :hidden="!isModalVisible" :widthClass="'w-[900px]'" :hasOverFlowVertical="true" :hasButton="true"
    title="Chi tiết" @decline-modal="closeReportModal" @confirm-modal="closeReportModal" >
    <div class="relative px-2">
      <!-- Order detail -->
      <div class="mx-auto container align-middle border-[2px] border-blue-800 rounded-lg pl-3 py-1.5">
        <div class="font-bold mb-2 mt-2 text-xl text-black text-blue-800">
            Đơn hàng</div>
        <div class="flex px-8 my-2">
          <div class="flex items-center gap-3 text-lg mb-1 w-[400px]">
            <div class="min-w-[100px]">Tên sản phẩm: </div>
            <div class="text-black font-semibold">{{ report?.aboutOrder.productResponse.name }}</div>
          </div>
          <div class="flex items-center gap-3 text-lg mb-1">
            <div class="min-w-[100px]">Giá: </div>
            <div class="font-semibold text-red-600">{{ formatCurrency(report?.aboutOrder.price) }}</div>
          </div>
        </div>
        <div class="flex px-8">
          <div class="flex items-center gap-3 text-lg mb-1 w-[400px]">
            <div class="min-w-[100px]">Phương thức: </div>
            <div><AuctionType :type="report?.aboutOrder.modelTypeAuctionOfOrder"/></div>
          </div>
          <div class="flex items-center gap-3 text-lg mb-1">
            <div class="min-w-[100px]">Tạo lúc: </div>
            <div>{{ moment.utc(report?.aboutOrder.createAt).format('DD/MM/YYYY HH:mm:ss') }}</div>
          </div>
        </div>
        <div class="py-1.5">
          <div class="min-w-[100px]">Hình ảnh: </div>
          <ListExpandableImage :img-src="report?.aboutOrder.productResponse.imageUrls"/>
        </div>
      </div>

      <!-- Report detail -->
      <div class="mx-auto container align-middle border-[2px] border-blue-800 rounded-lg pl-3 py-1.5 mt-3">
        <div class="font-bold mb-2 mt-2 text-xl text-black text-blue-800">
            Thông tin tố cáo</div>
        <div class="flex px-8 my-2">
          <div class="flex items-center gap-3 text-lg mb-1 w-[400px]">
            <div class="min-w-[100px]">Người tố cáo: </div>
            <div class="text-black font-semibold">{{ report?.fromUserReport.fullname }}</div>
          </div>
          <div class="flex items-center gap-3 text-lg mb-1">
            <div class="min-w-[100px]">Vai trò: </div>
            <div class="font-semibold text-red-600">{{ report?.fromUserReport.role === Role.seller.value ? 'Người bán' : 'Người mua' }}</div>
          </div>
        </div>
        <div class="flex px-8 my-2">
          <div class="flex items-center gap-3 text-lg mb-1 w-[400px]">
            <div class="min-w-[100px]">Người bị tố cáo: </div>
            <div class="text-black font-semibold">{{ report?.toUserReport.fullname }}</div>
          </div>
          <div class="flex items-center gap-3 text-lg mb-1">
            <div class="min-w-[100px]">Vai trò: </div>
            <div class="font-semibold text-red-600">{{ report?.toUserReport.role === Role.seller.value ? 'Người bán' : 'Người mua' }}</div>
          </div>
        </div>
        <div class="flex px-8 my-2">
          <div class="flex items-center gap-3 text-lg mb-1 w-[400px]">
            <div class="min-w-[100px]">Tạo lúc: </div>
            <div>{{ moment.utc(report?.createAt).format('DD/MM/YYYY HH:mm:ss') }}</div>
          </div>
          <div class="flex items-center gap-3 text-lg mb-1">
            <div class="min-w-[100px]">Trạng thái: </div>
            <div><ReportStatusBadge :status="report?.status" /></div>
          </div>
        </div>
        <div class="flex px-8">
          <div class="flex items-center gap-3 text-lg mb-1 w-[400px]">
            <div class="min-w-[100px]">Nội dung: </div>
            <div>{{ report?.content }}</div>
          </div>
        </div>
        <div class="py-1.5">
          <div class="min-w-[100px]">Hình ảnh: </div>
          <ListExpandableImage :img-src="report?.reportImages"/>
        </div>
      </div>
    </div>
    <template #button>
      <div>
        <button
          @click="closeReportModal()"
          class="bg-white hover:!bg-blue-200 text-black font-bold py-2 px-4 rounded border focus:outline-none focus:shadow-outline"
          type="button">
            Đóng
        </button>
      </div>
    </template>
  </Modal>
</template>
