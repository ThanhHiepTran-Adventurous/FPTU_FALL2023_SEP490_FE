<script setup>
import AdminHeader from '@/views/admin/common/AdminHeader.vue'
import { onMounted, ref, computed, watch } from 'vue'
import { Carousel } from 'flowbite-vue'
import { initFlowbite } from 'flowbite'
import adminService from '../../services/admin.service'
import '@vuepic/vue-datepicker/dist/main.css'
import toastOption from '@/utils/toast-option'
import moment from 'moment'

const autionsList = ref([])
const itemsPerPage = 4
const currentPage = ref(1)
const showUpdateModal = ref(false)
const showRejectReasonModal = ref(false)
const convertedImages = ref([])
const rejectInput = ref('')
onMounted(() => {
  getAllAuctions()
  initFlowbite()
})
const selectedAution = ref(null)
const openAuctionModal = auction => {
  selectedAution.value = auction
  // Convert selectedAution's imageUrls to the desired format
  convertedImages.value =
    selectedAution.value?.product?.imageUrls.map(url => ({
      src: url,
      alt: 'Image Alt Text', // You can set the alt text as per your requirements
    })) || []
  showUpdateModal.value = true // Show the modal
}
const getAllAuctions = async () => {
  try {
    const response = await adminService.getAllAuctions(1, 100)
    autionsList.value = response.data
    autionsList.value = autionsList.value.filter(auction => auction.status === 'NEW')
    console.log(autionsList.value)
  } catch (e) {
    console.error(e)
  }
}

// Computed property for total pages
const totalPages = computed(() => {
  return Math.ceil(autionsList.value.length / itemsPerPage)
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
const handleApproveAuction = async auctionId => {
  try {
    const response = await adminService.approveAuction(auctionId)
    // Handle the response as needed
    toastOption.toastSuccess('Duyệt thành công')
    console.log('Auction approved:', response)
  } catch (error) {
    console.error('Error approving auction:', error)
    toastOption.toastError('Duyệt thất bại')
    // Handle the error
  } finally {
    showUpdateModal.value = false
    getAllAuctions()
  }
}
const handleRejectAuction = async auctionId => {
  try {
    const rejectReason = {
      rejectReason: rejectInput.value,
    }

    const response = await adminService.rejectAuction(auctionId, rejectReason)
    // Handle the response as needed
    console.log('Auction rejected:', response)
  } catch (error) {
    console.error('Error rejecting auction:', error)
    // Handle the error
  }
}

// Compute the start and end index for the current page
const startIndex = (currentPage.value - 1) * itemsPerPage
const endIndex = startIndex + itemsPerPage

// Compute paginated auctions
const paginatedAuctions = computed(() => {
  // Move startIndex and endIndex calculation here
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return autionsList.value.slice(startIndex, endIndex)
})
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
                <th scope="col" class="px-5 py-3">Người bán</th>

                <th scope="col" class="px-4 py-3">Tên sản phẩm</th>
                <th scope="col" class="px-4 py-3">Hình thức mua bán</th>
                <th scope="col" class="px-4 py-3">Ngày tạo</th>
                <th scope="col" class="px-4 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(auction, index) in paginatedAuctions" :key="index" class="border-b dark:border-gray-700">
                <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <div class="pl-3">
                    <div class="text-base font-semibold">{{ auction?.product?.seller?.id.split('-')[0] }}</div>
                  </div>
                </th>
                <td class="px-4 py-3" style="white-space: pre-line; word-wrap: break-word">
                  {{ auction?.product?.name }}
                </td>
                <td class="px-4 py-3" style="white-space: pre-line; word-wrap: break-word">
                  {{ auction?.modelType === 'IMMEDIATE' ? 'Tự trao đổi mua bán' : 'Trung gian qua hệ thống' }}
                </td>
                <td class="px-4 py-3">
                  {{
                    auction?.product?.createAt
                      ? moment.utc(auction?.product?.createAt).format('DD/MM/YYYY HH:mm:ss')
                      : ''
                  }}
                </td>
                <td class="px-4 py-3 flex items-center justify-end">
                  <button
                    class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                    type="button"
                    @click="openAuctionModal(auction)">
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
    v-if="showUpdateModal"
    id="updateAutionModal"
    tabindex="-1"
    aria-hidden="true"
    class="fixed inset-0 flex m items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="relative p-4 w-full max-w-4xl md:h-auto">
      <!-- Modal content -->
      <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
        <!-- Modal header -->
        <div class="flex justify-between items-center mb-2 rounded-t border-b sm:mb-5 dark:border-gray-600">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Thông tin sản phẩm đấu giá</h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-toggle="updateAutionModal"
            @click="showUpdateModal = false">
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
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Tên sản phẩm
                </label>
                <input
                  type="text"
                  name="name"
                  :value="selectedAution?.product?.name"
                  readonly
                  id="name"
                  class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
              </div>
              <div>
                <label for="modelType" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Hình thức mua bán</label
                >
                <input
                  type="text"
                  name="modelType"
                  id="modelType"
                  :value="selectedAution?.modelType === 'IMMEDIATE' ? 'Tự trao đổi mua bán' : 'Trung gian qua hệ thống'"
                  readonly
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
              </div>
              <div>
                <label for="startPrice" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Giá khởi điểm</label
                >
                <input
                  type="text"
                  name="startPrice"
                  id="startPrice"
                  :value="selectedAution?.startPrice ? selectedAution.startPrice.toLocaleString('vi-VN') + ' VND' : ''"
                  readonly
                  class="bg-gray-50 border border-gray-300 text-blue-600 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
              </div>
              <div>
                <label for="buyNowPrice" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Giá mua ngay</label
                >
                <input
                  type="text"
                  name="buyNowPrice"
                  id="buyNowPrice"
                  :value="
                    selectedAution?.buyNowPrice ? selectedAution.buyNowPrice.toLocaleString('vi-VN') + ' VND' : ''
                  "
                  readonly
                  class="bg-gray-50 border border-gray-300 text-blue-600 font-semibold text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
              </div>
              <div>
                <label for="jump" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Bước nhảy tối thiểu</label
                >
                <input
                  type="text"
                  name="jump"
                  id="jump"
                  :value="selectedAution?.jump ? selectedAution.jump.toLocaleString('vi-VN') + ' VND' : ''"
                  readonly
                  class="bg-gray-50 border border-gray-300 text-blue-600 font-semibold text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
              </div>
              <div>
                <label for="duration" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Thời gian đấu giá</label
                >
                <input
                  type="text"
                  name="duration"
                  id="duration"
                  :value="selectedAution?.duration / (1000 * 60 * 60) + ' tiếng'"
                  readonly
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
              </div>
            </div>
            <div>
              <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Mô tả</label
              >
              <textarea
                type="string"
                name="description"
                :value="selectedAution?.product?.description"
                readonly
                id="description"
                class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"></textarea>
            </div>
            <div class="mt-2">
              <Carousel :pictures="convertedImages"></Carousel>
            </div>
            <div class="flex items-center mt-2 space-x-4">
              <button
                @click="handleApproveAuction(selectedAution.id)"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Duyệt
              </button>
              <button
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
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="showRejectReasonModal"
    id="authentication-modal"
    tabindex="-1"
    aria-hidden="true"
    class="fixed inset-0 flex m items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="relative w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <button
          @click="showRejectReasonModal = false"
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
          <form class="space-y-6" @submit.prevent="handleRejectAuction(selectedAution.id)">
            <div>
              <label for="reject" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Lý do từ chối</label
              >
              <textarea
                v-model="rejectInput"
                type="string"
                name="reject"
                id="reject"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Điền lý do từ chối"
                required></textarea>
            </div>

            <button
              type="submit"
              class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Từ chối
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
