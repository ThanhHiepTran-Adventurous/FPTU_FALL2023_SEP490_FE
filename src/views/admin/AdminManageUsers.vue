<script setup>
import AdminHeader from '@/views/admin/common/AdminHeader.vue'
import loginService from '../../services/login.service'
import { onMounted, ref, computed, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { SIMPLE_TABLE_ITEMS_PER_PAGE } from '@/common/commonStaticState'
import ErrorMessage from '@/components/common-components/ErrorMessage.vue'
import userService from '@/services/user.service'
import toastOption from '@/utils/toast-option'

const userList = ref([])
const searchQuery = ref('')
const openDropdowns = ref([])
const itemsPerPage = SIMPLE_TABLE_ITEMS_PER_PAGE
const currentPage = ref(1)
const showUpdateModal = ref(false)
const showCreateStaffAccountModal = ref(false)

const createStaffData = ref({
  phone: '',
  password: '',
  name: ''
})
const createStaffError = ref({
  phone: '',
  password: '',
  name: ''
})
const resetStaffData = () => {
  createStaffData.value = {
    phone: '',
    password: '',
    name: ''
  }
}
const resetStaffDataError = () => {
  createStaffError.value = {
    phone: '',
    password: '',
    name: ''
  }
}
const openCreateStaffModal = () => {
  showCreateStaffAccountModal.value = true
}
const closeCreateStaffModal = () => {
  showCreateStaffAccountModal.value = false
  resetStaffData()
  resetStaffDataError()
}
const validateForm = () => {
  let result = true
  if (createStaffData.value.phone.trim() === '') {
    createStaffError.value.phone = 'Vui lòng nhập số điện thoại'
    result = false
  }
  if (createStaffData.value.password.trim() === '') {
    createStaffError.value.password = 'Vui lòng nhập mật khẩu'
    result = false
  }
  if (createStaffData.value.name.trim() === '') {
    createStaffError.value.name = 'Vui lòng nhập tên'
    result = false
  }
  return result
}
const handleCreateStaffAccount = () => {
  if(!confirm("Bạn có chắc chắn muốn tạo một tài khoản staff không?")){
    return
  }
  if(!validateForm()){
    return
  }
  userService.createStaffAccount(createStaffData.value.phone, createStaffData.value.password, createStaffData.value.name)
  .then(_ => {
    toastOption.toastSuccess("Tạo tài khoản staff thành công.")
    getAllUsers()
  }).catch(e => {
    toastOption.toastError(e.response.data.message)
  }).finally(() => {
    closeCreateStaffModal()
  })
}

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
      <div class="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
        <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div class="w-full md:w-1/2">
            <form class="flex items-center w-full">
              <label for="simple-search" class="sr-only"></label>
              <div class="flex items-center w-full">
                <div>
                  <input
                    v-model="searchQuery"
                    type="text"
                    id="simple-search"
                    class="w-[30rem] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
                    placeholder="Tìm người dùng theo tên"
                    required="" />
                </div>
                <div>
                  <button
                    @click="openCreateStaffModal"
                    class="ml-3 w-max bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border"
                    type="button">
                    Tạo tài khoản staff
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
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
              <tr v-for="(user, index) in paginatedUsers" :key="index" class="border-b">
                <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
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
                      'bg-blue-100 text-blue-800': user.status === 'ACTIVE',
                      'bg-yellow-100 text-yellow-800':
                        user.status === 'INACTIVE',
                      'bg-pink-100 text-pink-800': user.status === 'DELETED',
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
                    class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none"
                    type="button">
                    <svg
                      class="w-6 h-6 text-gray-800"
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
                class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
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
                  'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700':
                    pageNumber !== currentPage,
                  'text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700':
                    pageNumber === currentPage,
                }"
                @click="goToPage(pageNumber)">
                {{ pageNumber }}
              </button>
            </li>
            <li>
              <button
                type="button"
                class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
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
      <div class="relative p-4 bg-white rounded-lg shadow">
        <!-- Modal header -->
        <div class="flex justify-between items-center rounded-t border-b sm:mb-5">
          <h3 class="text-lg font-semibold text-gray-900">Thông tin người dùng</h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
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
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Họ và tên</label>
              <input
                v-model="selectedUser.fullname"
                type="text"
                name="name"
                readonly
                id="name"
                class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
            </div>
            <div>
              <label for="bithday" class="block mb-2 text-sm font-medium text-gray-900"
                >Ngày sinh</label
              >
              <VueDatePicker readonly v-model="selectedUser.birthday"></VueDatePicker>
            </div>
            <div>
              <label for="addressNum" class="block mb-2 text-sm font-medium text-gray-900"
                >Địa chỉ</label
              >
              <input
                v-model="selectedUser.address"
                readonly
                type="string"
                name="addressNum"
                id="addressNum"
                class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
            </div>
            <div>
              <label for="province" class="block mb-2 text-sm font-medium text-gray-900"
                >Số điện thoại</label
              >
              <input
                v-model="selectedUser.phoneNum"
                readonly
                type="string"
                name="province"
                id="province"
                class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
            </div>
            <div>
              <label for="province" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
              <input
                v-model="selectedUser.email"
                readonly
                type="string"
                name="ward"
                id="ward"
                class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
            </div>
            <div>
              <label for="province" class="block mb-2 text-sm font-medium text-gray-900"
                >Ngày tạo</label
              >
              <VueDatePicker readonly v-model="selectedUser.createAt"></VueDatePicker>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Create staff modal -->
  <div
    v-if="showCreateStaffAccountModal"
    id="createStaffAccountModal"
    tabindex="-1"
    aria-hidden="true"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
      <!-- Modal content -->
      <div class="relative p-4 bg-white rounded-lg shadow">
        <!-- Modal header -->
        <div class="flex justify-between items-center pb-3 rounded-t border-b sm:mb-5">
          <div class="text-lg font-semibold text-gray-900">Tạo tài khoản của staff</div>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            data-modal-toggle="updateProductModal"
            @click="closeCreateStaffModal">
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
          <div class="gap-4 mb-4">
            <div>
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Tên</label>
              <input
                v-model="createStaffData.name"
                type="text"
                name="name"
                id="name"
                class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
              <ErrorMessage :text="createStaffError.name" />
            </div>
            <div>
              <label for="phone" class="block mt-2 mb-2 text-sm font-medium text-gray-900">Số điện thoại</label>
              <input
                v-model="createStaffData.phone"
                type="text"
                name="phone"
                id="phone"
                class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
              <ErrorMessage :text="createStaffError.phone" />
            </div>
            <div>
              <label for="pw" class="block mt-2 mb-2 text-sm font-medium text-gray-900">Mật khẩu</label>
              <input
                v-model="createStaffData.password"
                type="text"
                name="pw"
                id="pw"
                class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
              <ErrorMessage :text="createStaffError.password" />
            </div>
          </div>
          <button
            @click="handleCreateStaffAccount"
            @click.prevent
            class="flex items-center bg-white hover:!bg-gray-200 gap-3 w-[180px] justify-center text-gray-800 px-4 py-2 rounded text-sm border-[1px] border-blue-500">
            Tạo tài khoản
          </button>
        </form>
      </div>
    </div>
  </div>
</template>