<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import StaffHeader from '@/views/staff/common/StaffHeader.vue'
import ShipRequestService from '@/services/shiprequest.service'
import { initFlowbite } from 'flowbite'
import { Carousel } from 'flowbite-vue'
import moment from 'moment'
import toastOption from '@/utils/toast-option'
import StaffSideBarLayout from '@/layouts/StaffSideBarLayout.vue'
import { staffTabs } from '@/common/constant'

const selectedShip = ref(null)
const showUpdateModal = ref(false)
const shipRequestList = ref([])
const itemsPerPage = 4
const currentPage = ref(1)
const convertedImages = ref([])
const getAllShipRequest = async () => {
  try {
    const query = ''
    const response = await ShipRequestService.getAllShipRequest(query)
    shipRequestList.value = response.data
    console.log(shipRequestList.value)
  } catch (e) {
    console.error(e)
  }
}
const openShipModal = ship => {
  selectedShip.value = ship
  showUpdateModal.value = true
  convertedImages.value =
    selectedShip.value?.order?.productResponse?.imageUrls.map(url => ({
      src: url,
      alt: 'Image Alt Text', // You can set the alt text as per your requirements
    })) || []
}
const totalPages = computed(() => {
  return Math.ceil(shipRequestList.value.length / itemsPerPage)
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
const paginatedShipRequest = computed(() => {
  // Move startIndex and endIndex calculation here
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return shipRequestList.value.slice(startIndex, endIndex)
})
onMounted(() => {
  getAllShipRequest()
  initFlowbite()
})
const confirmToWaitingForDelivery = async shipRequestId => {
  try {
    showUpdateModal.value = false
    await ShipRequestService.staffConfirmShipRequest(shipRequestId)
    toastOption.toastSuccess('Xác nhận đơn hàng thành công')
    getAllShipRequest()
  } catch (e) {
    toastOption.toastError('Xác nhận đơn hàng thất bại')
    console.error(e)
  }
}
const staffChangeShipRequestToOnDelivery = async shipRequestId => {
  try {
    showUpdateModal.value = false
    await ShipRequestService.staffChangeShipRequestToOnDelivery(shipRequestId)
    toastOption.toastSuccess('Xác nhận đơn hàng đang vận chuyển thành công')
    getAllShipRequest()
  } catch (e) {
    toastOption.toastError('Xác nhận đơn hàng đang vận chuyển thất bại')
    console.error(e)
  }
}
const staffChangeShipRequestToDelivered = async shipRequestId => {
  try {
    showUpdateModal.value = false
    await ShipRequestService.staffChangeShipRequestToDelivered(shipRequestId)
    toastOption.toastSuccess('Xác nhận đơn hàng đã giao thành công')
    getAllShipRequest()
  } catch (e) {
    toastOption.toastError('Xác nhận đơn hàng đã giao thất bại')
    console.error(e)
  }
}
</script>

<template>
  <StaffHeader />
  <StaffSideBarLayout :curTab="staffTabs.shipRequests.value">
    <div class="bg-white container mx-auto rounded w-full min-h-[80vh]">
      <!-- Header -->
      <div class="pt-3 px-3 pb-1 flex items-center justify-between">
        <div class="font-bold text-2xl text-black text-blue-800">
          Yêu cầu giao hàng</div>
      </div>
      <section class="bg-white sm:p-5">
        <div class="mx-auto px-4">
          <div class="bg-white relative sm:rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Người tạo</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Tên sản phẩm</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Thông tin giao hàng</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Thông tin nhận hàng</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Trạng thái</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Ngày tạo</th>
                    <th scope="col" class="px-6 py-3">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(ship, index) in paginatedShipRequest" :key="index" class="border-b dark:border-gray-700">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {{ ship?.createBy?.fullname }}
                    </th>
                    <td class="px-4 py-3">
                      <div class="font-normal text-gray-500">{{ ship?.order?.productResponse?.name }}</div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="font-normal text-gray-500">{{ ship?.fromPhoneNum }}</div>
                      <div class="font-normal text-gray-500">{{ ship?.fromAddress }}</div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="font-normal text-gray-500">{{ ship?.toPhoneNum }}</div>
                      <div class="font-normal text-gray-500">{{ ship?.toAddress }}</div>
                    </td>
                    <td class="px-4 py-3">
                      {{
                        ship?.status === 'WAITING_FOR_CONFIRMATION'
                          ? 'Đang chờ xác nhận'
                          : ship?.status === 'WAITING_FOR_DELIVERY'
                          ? 'Đang chờ vận chuyển'
                          : ship?.status === 'ON_DELIVERY'
                          ? 'Vận chuyển'
                          : ship?.status === 'DELIVERED'
                          ? 'Đã giao hàng'
                          : ship?.status
                      }}
                    </td>
                    <td class="px-4 py-3">
                      {{ ship?.createAt ? moment.utc(ship?.createAt).format('DD/MM/YYYY HH:mm:ss') : '' }}
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
    </div>
  </StaffSideBarLayout>
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
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            Thông tin đơn hàng
            <span
              :class="{
                ' border border-gray-500 bg-gray-100 ml-2 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300':
                  selectedShip?.status === 'WAITING_FOR_CONFIRMATION',
                'ml-2 border border-yellow-500 bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300':
                  selectedShip?.status === 'WAITING_FOR_DELIVERY',
                'ml-2 border border-blue-500 bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300':
                  selectedShip?.status === 'ON_DELIVERY',
                'ml-2 border border-green-500 bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300':
                  selectedShip?.status === 'DELIVERED',
                'ml-2 border border-red-500 bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300':
                  selectedShip?.status === 'CANCELLED' || selectedShip?.status === 'RETURNS',
              }"
              >{{
                selectedShip?.status === 'WAITING_FOR_CONFIRMATION'
                  ? 'Đang chờ xác nhận'
                  : selectedShip?.status === 'WAITING_FOR_DELIVERY'
                  ? 'Đang chờ vận chuyển'
                  : selectedShip?.status === 'ON_DELIVERY'
                  ? 'Đang vận chuyển'
                  : selectedShip?.status === 'DELIVERED'
                  ? 'Đã giao hàng'
                  : selectedShip?.status === 'CANCELLED'
                  ? 'Đã hủy'
                  : selectedShip?.status === 'RETURNS'
                  ? 'Hoàn trả'
                  : selectedShip?.status
              }}</span
            >
          </h3>

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
          <form>
            <div class="grid mt-2 gap-4 mb-4 sm:grid-cols-2">
              <div>
                <label for="nameProduct" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Tên sản phẩm
                </label>
                <input
                  type="text"
                  name="nameProduct"
                  readonly
                  :value="selectedShip?.order?.productResponse?.name"
                  id="nameProduct"
                  class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
              </div>
              <div>
                <label for="createBy" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Người tạo</label
                >
                <input
                  type="text"
                  name="createBy"
                  id="createBy"
                  readonly
                  :value="selectedShip?.createBy?.fullname"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
              </div>
              <div>
                <label for="from" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Thông tin giao hàng</label
                >
                <textarea
                  type="text"
                  name="from"
                  id="from"
                  readonly
                  :value="selectedShip?.fromPhoneNum + ', ' + selectedShip?.fromAddress"
                  class="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"></textarea>
              </div>
              <div>
                <label for="to" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Thông tin nhận hàng</label
                >
                <textarea
                  type="text"
                  name="to"
                  id="to"
                  readonly
                  :value="selectedShip?.toPhoneNum + ', ' + selectedShip?.toAddress"
                  class="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"></textarea>
              </div>
              <div>
                <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Trọng lượng (gram)</label
                >
                <input
                  type="text"
                  name="price"
                  id="price"
                  :value="selectedShip?.order?.productResponse?.weight"
                  readonly
                  class="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
              </div>

              <div>
                <label for="date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ngày tạo</label>
                <input
                  type="text"
                  name="date"
                  id="date"
                  readonly
                  :value="selectedShip?.createAt ? moment.utc(ship?.createAt).format('DD/MM/YYYY HH:mm:ss') : ''"
                  class="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
              </div>
            </div>
            <div>
              <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Mô tả</label
              >
              <textarea
                type="string"
                name="description"
                readonly
                :value="selectedShip?.order?.productResponse?.description"
                id="description"
                class="border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"></textarea>
            </div>
            <div class="mt-2">
              <Carousel :pictures="convertedImages"></Carousel>
            </div>
            <div class="flex items-center mt-2 space-x-4">
              <button
                v-if="selectedShip?.status === 'WAITING_FOR_CONFIRMATION'"
                @click="confirmToWaitingForDelivery(selectedShip?.id)"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Xác nhận đơn hàng
              </button>
              <button
                v-if="selectedShip?.status === 'WAITING_FOR_DELIVERY'"
                @click="staffChangeShipRequestToOnDelivery(selectedShip?.id)"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Xác nhận đang vận chuyển
              </button>
              <button
                v-if="selectedShip?.status === 'ON_DELIVERY'"
                @click="staffChangeShipRequestToDelivered(selectedShip?.id)"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Xác nhận đơn hàng đã giao
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
