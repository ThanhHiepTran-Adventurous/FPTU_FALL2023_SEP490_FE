<script setup>
import AdminHeader from '@/views/admin/common/AdminHeader.vue'
import loginService from '../../services/login.service'
import { onMounted, ref, computed, watch } from 'vue'
import { Carousel } from 'flowbite-vue'
import { initFlowbite } from 'flowbite'
import VueDatePicker from '@vuepic/vue-datepicker'
import adminService from '../../services/admin.service'
import '@vuepic/vue-datepicker/dist/main.css'
const autionsList = ref([])
const searchQuery = ref('')
const openDropdowns = ref([])
const itemsPerPage = 4
const currentPage = ref(1)
const showUpdateModal = ref(false)
const date = ref(new Date())
const convertedImages = ref([])
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
  // console.log(selectedAution.value)
  showUpdateModal.value = true // Show the modal
}
const getAllAuctions = async () => {
  try {
    const response = await adminService.getAllAuctions(1, 100)
    autionsList.value = response.data
    autionsList.value = autionsList.value.filter(auction => auction.status === 'NEW')
  } catch (e) {
    console.error(e)
  }
}

const toggleDropdown = index => {
  const isOpen = openDropdowns.value.includes(index)
  console.log(index)
  if (isOpen) {
    // If the dropdown is already open, close it
    openDropdowns.value = openDropdowns.value.filter(i => i !== index)
  } else {
    // If the dropdown is closed, open it
    openDropdowns.value.push(index)
  }
}

// Computed property for paginated users
const paginatedUsers = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return userList.value
    .filter(user => user.fullname.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .slice(startIndex, endIndex)
})

// Watch for changes in searchQuery and reset currentPage when searching
watch(searchQuery, () => {
  currentPage.value = 1
})

// Computed property for total pages
const totalPages = computed(() => {
  return Math.ceil(
    autionsList.value.filter(user => user.fullname.toLowerCase().includes(searchQuery.value.toLowerCase())).length /
      itemsPerPage,
  )
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
    console.log('Auction approved:', response)
  } catch (error) {
    console.error('Error approving auction:', error)
    // Handle the error
  }
}
const handleRejectAuction = async auctionId => {
  try {
    const rejectReason = {
      rejectReason: 'test',
    }

    const response = await adminService.rejectAuction(auctionId, rejectReason)
    // Handle the response as needed
    console.log('Auction rejected:', response)
  } catch (error) {
    console.error('Error rejecting auction:', error)
    // Handle the error
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
          <div class="w-full md:w-1/2">
            <!-- <form class="flex items-center">
              <label for="simple-search" class="sr-only"></label>
              <div class="relative w-full">
                <input
                  v-model="searchQuery"
                  type="text"
                  id="simple-search"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Tìm thương hiệu theo tên"
                  required="" />
              </div>
            </form> -->
          </div>
          <div
            class="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
            <!-- <button
              type="button"
              @click="openCreatebrandModal()"
              class="flex items-center justify-center flex-shrink-0 px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              Thêm thương hiệu
            </button> -->
            <!-- <button
              id="filterDropdownButton"
              data-dropdown-toggle="filterDropdown"
              class="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                class="h-4 w-4 mr-2 text-gray-400"
                viewbox="0 0 20 20"
                fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clip-rule="evenodd" />
              </svg>
              Lọc theo trạng thái
              <svg
                class="-mr-1 ml-1.5 w-5 h-5"
                fill="currentColor"
                viewbox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true">
                <path
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button> -->
            <!-- <div id="filterDropdown" class="z-10 hidden w-48 p-3 bg-white rounded-lg shadow dark:bg-gray-700">
              <h6 class="text-sm font-medium text-gray-900 dark:text-white">Chọn trạng thái</h6>
              <ul class="space-y-2 text-sm" aria-labelledby="filterDropdownButton">
                <li class="flex items-center">
                  <input
                    id="option"
                    v-model="selectedStatusFilter"
                    type="radio"
                    value="ALL"
                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                  <label for="fitbit" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">ALL </label>
                </li>
                <li class="flex items-center">
                  <input
                    id="option"
                    v-model="selectedStatusFilter"
                    type="radio"
                    value="ACTIVE"
                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                  <label for="fitbit" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">ACTIVE </label>
                </li>
                <li class="flex items-center">
                  <input
                    id="option"
                    v-model="selectedStatusFilter"
                    type="radio"
                    value="INACTIVE"
                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                  <label for="fitbit" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >INACTIVE
                  </label>
                </li>
              </ul>
            </div> -->
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-5 py-3">Người bán</th>

                <th scope="col" class="px-4 py-3">Tên sản phẩm</th>
                <th scope="col" class="px-4 py-3">Mô tả</th>
                <th scope="col" class="px-4 py-3">Ngày tạo</th>
                <th scope="col" class="px-4 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(auction, index) in autionsList" :key="index" class="border-b dark:border-gray-700">
                <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <img
                    class="w-10 h-10 rounded-full"
                    :src="auction?.product?.seller?.avatarUrl"
                    :alt="auction?.product?.seller?.fullname + ' image'" />
                  <div class="pl-3">
                    <div class="text-base font-semibold">{{ auction?.product?.seller?.fullname }}</div>
                  </div>
                </th>
                <td class="px-4 py-3" style="white-space: pre-line; word-wrap: break-word">
                  {{ auction?.product?.name }}
                </td>
                <td class="px-4 py-3" style="white-space: pre-line; word-wrap: break-word">
                  {{ auction?.product?.description }}
                </td>
                <td class="px-4 py-3">{{ new Date(auction?.product?.createAt).toLocaleString() }}</td>
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
            <!-- <li>
              <button
                type="button"
                class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                @click="goToPreviousPage">
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
            </li> -->
            <!-- Generate pagination links -->
            <!-- <li v-for="pageNumber in totalPages" :key="pageNumber">
              <button
                type="button"
                class="flex items-center justify-center text-sm py-2 px-3 leading-tight"
                :class="{
                  'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white':
                    pageNumber !== currentPage,
                  'text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white':
                    pageNumber === currentPage,
                }"
                @click="goToPage(pageNumber)">
                {{ pageNumber }}
              </button>
            </li> -->
            <!-- <li>
              <button
                type="button"
                class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
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
            </li> -->
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
    <div class="relative p-4 w-full max-w-2xl md:h-auto">
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
        <!-- {{ selectedAution?.product?.imageUrls }} -->
        <!-- Modal body -->
        <div class="max-h-[600px] overflow-y-auto mt-2">
          <form action="#">
            <Carousel :pictures="convertedImages"></Carousel>

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
            <div class="flex items-center mt-2 space-x-4">
              <button
                @click="handleApproveAuction(selectedAution.id)"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Duyệt
              </button>
              <button
                @click="handleRejectAuction(selectedAution.id)"
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
</template>
