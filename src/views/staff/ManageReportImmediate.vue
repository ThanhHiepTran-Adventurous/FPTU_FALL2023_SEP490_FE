<script setup>
import StaffHeader from '@/views/staff/common/StaffHeader.vue'
import reportService from '@/services/report.service'
import { onMounted, ref, computed } from 'vue'
import moment from 'moment'
import StaffSideBarLayout from '@/layouts/StaffSideBarLayout.vue'
import Modal from '@/components/common-components/Modal.vue'
import formatCurrency from '@/utils/currency-output-formatter'
import AuctionType from '@/components/common-components/badge/AuctionType.vue'
import ListExpandableImage from '@/components/ListExpandableImage.vue'
import { AuctionModelType, Role } from '@/common/contract'
import chatService from '@/services/chat.service'
import { useRouter } from 'vue-router'
import TwoOptionsTab from '@/components/TwoOptionsTab.vue'
import { staffTabs } from '@/common/constant'
import toastOption from '@/utils/toast-option'

const router = useRouter()

const reportList = ref([])
const report = ref(null)
const isModalVisible = ref(false)

const openReportModal = (detail) => {
  report.value = detail
  isModalVisible.value = true
}
const closeReportModal = () => {
  isModalVisible.value = false
}

const itemsPerPage = 4
const currentPage = ref(1)
const getAllReportStaff = async () => {
  try {
    const response = await reportService.getAllReportDataStaff()
    reportList.value = response.data.filter(f => f.aboutOrder.modelTypeAuctionOfOrder === AuctionModelType.immediate)
  } catch (e) {
    console.error(e)
  }
}

const onJoinChat = async (groupId) => {
  await chatService.staffJoinChat(groupId)
  router.push(`/messenger/${groupId}`)
}

const onRejectReport = async (reportId) => {
  if(!confirm("Bạn có chắc chắn muốn từ chối tố cáo này không?")){
    return
  }
  try {
    await reportService.staffDeclineReportOpt1(reportId)
    toastOption.toastSuccess("Từ chối tố cáo thành công")
    getAllReportStaff()
    isModalVisible.value = false
  } catch (_) {
    toastOption.toastError("Có lỗi khi xử lý, vui lòng tải lại trang và thử lại.")
  }
}
const onConfirmReport = async (reportId) => {
  if(!confirm("Bạn có chắc chắn muốn xác nhận tố cáo này là chính xác không?")){
    return
  }
  try {
    await reportService.staffConfirmReportOpt1(reportId)
    toastOption.toastSuccess("Xác nhận tố cáo thành công")
    getAllReportStaff()
    isModalVisible.value = false
  } catch (_) {
    toastOption.toastError("Có lỗi khi xử lý, vui lòng tải lại trang và thử lại.")
  }
}


// Pagination
const totalPages = computed(() => {
  return Math.ceil(reportList.value.length / itemsPerPage)
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
  return reportList.value.slice(startIndex, endIndex)
})

onMounted(() => {
  getAllReportStaff()
})
</script>

<template>
  <StaffHeader />
  <StaffSideBarLayout :cur-tab="staffTabs.reports.value">
    <div class="bg-white container mx-auto rounded w-full min-h-[80vh]">
      <!-- Header -->
      <div class="pt-3 px-3 pb-1 flex items-center justify-between">
        <div class="font-bold text-2xl text-black text-blue-800">
          Lịch sử báo cáo</div>
        <TwoOptionsTab
          immediate-option-nav="/staff/report/immediate"
          intermediate-option-nav="/staff/report/intermediate"
          :cur-tab="AuctionModelType.immediate"
        />
      </div>
      <section class="bg-white sm:p-5">
        <div class="mx-auto px-4">
          <div class="bg-white relative sm:rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Người tố cáo</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Người bị tố cáo</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Lý do tố cáo</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Trạng thái</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Ngày tạo</th>

                    <th scope="col" class="px-6 py-3">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(report, index) in paginatedReportList" :key="index" class="border-b dark:border-gray-700">
                    <th scope="row" class="px-6 py-4 font-normal text-gray-500 dark:text-white">
                      {{ report?.fromUserReport?.fullname }}
                    </th>
                    <td class="px-4 py-3">
                      <div class="font-normal text-gray-500">{{ report?.toUserReport?.fullname }}</div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="font-normal text-gray-500">{{ report?.content }}</div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="font-normal text-gray-500">{{ report?.status }}</div>
                    </td>

                    <td class="px-4 py-3">
                      {{ report?.createAt ? moment.utc(report?.createAt).format('DD/MM/YYYY HH:mm:ss') : '' }}
                    </td>
                    <td class="px-4 py-3 flex items-center justify-end">
                      <button
                        class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                        type="button" @click="openReportModal(report)">
                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
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
            <nav class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
              aria-label="Table navigation">
              <ul class="inline-flex items-stretch -space-x-px">
                <li>
                  <button type="button"
                    class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
                    'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white':
                      pageNumber !== currentPage,
                    'text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white':
                      pageNumber === currentPage,
                  }" @click="goToPage(pageNumber)" aria-label="Page {{ pageNumber }}">
                    {{ pageNumber }}
                  </button>
                </li>
                <li>
                  <button type="button" @click="goToNextPage"
                    class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
  </StaffSideBarLayout>
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
            <div>{{ moment.utc(report?.createAt).format('DD/MM/YYYY HH:mm:ss') }}</div>
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
      <div>
        <button
          @click="onJoinChat(report?.aboutOrder.chatGroupDTOs.id)"
          class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded border focus:outline-none focus:shadow-outline"
          type="button">
            Vào nhóm chat
        </button>
      </div>
      <div>
        <button
          @click="onConfirmReport(report?.id)"
          class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded border focus:outline-none focus:shadow-outline"
          type="button">
            Xác nhận tố cáo chính xác
        </button>
      </div>
      <div>
        <button
          @click="onRejectReport(report?.id)"
          class="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded border focus:outline-none focus:shadow-outline"
          type="button">
            Bãi bỏ tố cáo
        </button>
      </div>
    </template>
  </Modal>
</template>
