<script setup>
import AdminHeader from '@/views/admin/common/AdminHeader.vue'
import loginService from '../../services/login.service'
import { onMounted, ref, computed, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { SIMPLE_TABLE_ITEMS_PER_PAGE } from '@/common/commonStaticState'

const userList = ref([])
const searchQuery = ref('')
const openDropdowns = ref([])
const itemsPerPage = SIMPLE_TABLE_ITEMS_PER_PAGE
const currentPage = ref(1)
const showUpdateModal = ref(false)
const date = ref(new Date())
onMounted(() => {
  getAllUsers()
})
const selectedUser = ref(null)
const openUserModal = user => {
  selectedUser.value = user // Set the selected user data
  showUpdateModal.value = true // Show the modal
}
const getAllUsers = async () => {
  try {
    const response = await loginService.fetchAllUserInfo()
    userList.value = response.data
  } catch (e) {
    console.error(e)
  }
}

const toggleDropdown = index => {
  const isOpen = openDropdowns.value.includes(index)
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
    userList.value.filter(user => user.fullname.toLowerCase().includes(searchQuery.value.toLowerCase())).length /
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
</script>
<template>
  <AdminHeader />
  <section class="bg-white ml-20 mt-5 p-3 sm:p-5">
    <div class="mx-auto max-w-screen-lg pl-5 px-4 lg:px-12">
      <!-- Start coding here -->
      <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div class="w-full md:w-1/2">
            <form class="flex items-center">
              <label for="simple-search" class="sr-only"></label>
              <div class="relative w-full">
                <input
                  v-model="searchQuery"
                  type="text"
                  id="simple-search"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Tìm người dùng theo tên"
                  required="" />
              </div>
            </form>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-5 py-3">Người dùng</th>
                <th scope="col" class="px-4 py-3">Vai trò</th>
                <th scope="col" class="px-4 py-3">Số điện thoại</th>
                <th scope="col" class="px-4 py-3">Trạng thái</th>

                <th scope="col" class="px-4 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in paginatedUsers" :key="index" class="border-b dark:border-gray-700">
                <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <div class="pl-3">
                    <div class="text-base font-semibold">{{ user.fullname }}</div>
                    <div class="font-normal text-gray-500">{{ user.email }}</div>
                  </div>
                </th>

                <td class="px-4 py-3">
                  {{
                    user.role === 'BUYER'
                      ? 'Người mua'
                      : user.role === 'SELLER'
                      ? 'Người bán'
                      : user.role === 'STAFF'
                      ? 'Nhân viên'
                      : user.role
                  }}
                </td>
                <td class="px-4 py-3">{{ user.phoneNum }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    :class="{
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': user.status === 'ACTIVE',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300':
                        user.status === 'INACTIVE',
                      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300': user.status === 'DELETED',
                    }"
                    class="text-xs font-semibold me-2 px-2.5 py-0.5 rounded-full">
                    {{
                      user.status === 'ACTIVE'
                        ? 'Đang hoạt động'
                        : user.status === 'INACTIVE'
                        ? 'Chưa xác thực tài khoản'
                        : user.status === 'DELETED'
                        ? 'Xoá khỏi hệ thống'
                        : user.status
                    }}
                  </span>
                </td>

                <td class="px-4 py-3 flex items-center justify-end">
                  <button
                    @click="openUserModal(user)"
                    class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                    type="button">
                    <svg
                      class="w-6 h-6 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 18">
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4.109 17H1v-2a4 4 0 0 1 4-4h.87M10 4.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm7.95 2.55a2 2 0 0 1 0 2.829l-6.364 6.364-3.536.707.707-3.536 6.364-6.364a2 2 0 0 1 2.829 0Z" />
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
                @click="goToPage(pageNumber)">
                {{ pageNumber }}
              </button>
            </li>
            <li>
              <button
                type="button"
                class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                @click="goToNextPage">
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

  <!-- Main modal -->
  <div
    v-if="showUpdateModal"
    id="updateProductModal"
    tabindex="-1"
    aria-hidden="true"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
      <!-- Modal content -->
      <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
        <!-- Modal header -->
        <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Thông tin người dùng</h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-toggle="updateProductModal"
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
        <form action="#">
          <div class="grid gap-4 mb-4 sm:grid-cols-2">
            <div>
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Họ và tên</label>
              <input
                v-model="selectedUser.fullname"
                type="text"
                name="name"
                readonly
                id="name"
                class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
            </div>
            <div>
              <label for="bithday" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Ngày sinh</label
              >
              <VueDatePicker readonly v-model="selectedUser.birthday"></VueDatePicker>
            </div>
            <div>
              <label for="addressNum" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Địa chỉ</label
              >
              <input
                v-model="selectedUser.address"
                readonly
                type="string"
                name="addressNum"
                id="addressNum"
                class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
            </div>
            <div>
              <label for="province" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Số điện thoại</label
              >
              <input
                v-model="selectedUser.phoneNum"
                readonly
                type="string"
                name="province"
                id="province"
                class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
            </div>
            <div>
              <label for="province" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input
                v-model="selectedUser.email"
                readonly
                type="string"
                name="ward"
                id="ward"
                class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
            </div>
            <div>
              <label for="province" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Ngày tạo</label
              >
              <VueDatePicker readonly v-model="selectedUser.createAt"></VueDatePicker>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
