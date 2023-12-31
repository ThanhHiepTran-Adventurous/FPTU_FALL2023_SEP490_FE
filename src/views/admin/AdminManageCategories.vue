<script setup>
import AdminHeader from '@/views/admin/common/AdminHeader.vue'
import { onMounted, ref, computed, watch } from 'vue'
import adminService from '../../services/admin.service'
import '@vuepic/vue-datepicker/dist/main.css'
import { SIMPLE_TABLE_ITEMS_PER_PAGE } from '@/common/commonStaticState'
import toastOption from '@/utils/toast-option'

const categoriesList = ref([])
const searchQuery = ref('')
const openDropdowns = ref([])
const itemsPerPage = SIMPLE_TABLE_ITEMS_PER_PAGE
const currentPage = ref(1)
const showUpdateModal = ref(false)
const selectedCate = ref(null)
const fileSelected = ref(false)
const fileImageUrl = ref(null)
const selectedStatusFilter = ref('')
const showCreateModal = ref(false)
const newCate = ref({
  name: '',
  description: '',
})
const handleFileChange = () => {
  const fileInput = document.getElementById('fileInput')
  const file = fileInput.files[0]
  if (file) {
    // Handle the selected file, e.g., display it.
    fileImageUrl.value = URL.createObjectURL(file)
    fileSelected.value = true
  } else {
    // No file selected, reset the image.
    fileImageUrl.value = null
    fileSelected.value = false
  }
}
onMounted(() => {
  getAllCategories()
})
const getAllCategories = async () => {
  try {
    const response = await adminService.getAllCategories()
    categoriesList.value = response.data
  } catch (e) {
    console.error(e)
  }
}

// Watch for changes in searchQuery and reset currentPage when searching
watch(searchQuery, () => {
  currentPage.value = 1
})

// Computed property for total pages
const totalPages = computed(() => {
  return Math.ceil(categoriesList.value.length / itemsPerPage)
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

// Compute paginated auctions
const paginateCategories = computed(() => {
  // Move startIndex and endIndex calculation here
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return categoriesList.value.slice(startIndex, endIndex)
})
const filteredAndPaginatedBrands = computed(() => {
  let filtered = []

  if (selectedStatusFilter.value === 'ALL') {
    // Show all items when 'ALL' is selected
    filtered = categoriesList.value
  } else {
    // Filter based on selectedStatusFilter and searchQuery
    filtered = categoriesList.value.filter(cate => {
      const statusMatch = selectedStatusFilter.value === '' || cate.status === selectedStatusFilter.value
      const nameMatch = cate.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      return statusMatch && nameMatch
    })
  }

  // Apply pagination (show 4 items per page)
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filtered.slice(startIndex, endIndex)
})
const openCateModal = cate => {
  selectedCate.value = cate // Set the selected brand data
  showUpdateModal.value = true // Show the modal
}
const handleUploadFile = () => {
  const fileInput = document.getElementById('fileInput')
  fileInput.click()
}
const handleSubmitUpdateCate = async selectedCate => {
  try {
    // Prepare form data including image file
    const formData = new FormData()
    const fileInput = document.getElementById('fileInput')
    const selectedFile = fileInput.files[0]

    formData.append('image', selectedFile)

    // Prepare updateBrandRequest if needed
    const updateCategoryRequest = {
      description: selectedCate.description,
      name: selectedCate.name,
      status: selectedCate.status,
    }

    // Call updateBrandById function
    await adminService.updateCategoryById(selectedCate.id, formData, updateCategoryRequest)
    toastOption.toastSuccess('Cập nhật thể loại thành công')
    showUpdateModal.value = false
    getAllCategories()
  } catch (error) {
    console.error(error)
    toastOption.toastError('Cập nhật thể loại thất bại')
    toastOption.toastError(error?.response?.data?.message)
  }
}
const deleteCateById = async cateId => {
  try {
    const response = await adminService.deleteCategoryById(cateId)
    toastOption.toastSuccess('Xóa thể loại thành công')
    showUpdateModal.value = false
    getAllCategories()
  } catch (e) {
    console.error(e)
    toastOption.toastError('Xóa thể loại thất bại')
  }
}

const openCreateCateModal = () => {
  showCreateModal.value = true
}
const handleSubmitCreateCate = async newCate => {
  try {
    // Prepare form data including image file
    const formData = new FormData()
    const fileInput = document.getElementById('fileInput')
    const selectedFile = fileInput.files[0]

    formData.append('image', selectedFile)

    // Prepare updateBrandRequest if needed
    const addBrandAndCategoryRequest = {
      description: newCate.description,
      name: newCate.name,
    }

    // Call updateBrandById function
    await adminService.createNewCategory(formData, addBrandAndCategoryRequest)
    toastOption.toastSuccess('Tạo mới thể loại thành công')
    showCreateModal.value = false
    getAllCategories()
  } catch (error) {
    console.error(error)
    toastOption.toastError('Cập nhật thể loại thất bại')
    toastOption.toastError(error?.response?.data?.message)
    // Handle errors (e.g., show an error message)
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
                  placeholder="Tìm thể loại theo tên"
                  required="" />
              </div>
            </form>
          </div>
          <div
            class="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
            <button
              type="button"
              @click="openCreateCateModal()"
              class="flex items-center justify-center flex-shrink-0 px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              Thêm thể loại
            </button>
            <button
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
            </button>
            <div id="filterDropdown" class="z-10 hidden w-48 p-3 bg-white rounded-lg shadow dark:bg-gray-700">
              <h6 class="text-sm font-medium text-gray-900 dark:text-white">Chọn trạng thái</h6>
              <ul class="space-y-2 text-sm" aria-labelledby="filterDropdownButton">
                <li class="flex items-center">
                  <input
                    id="option"
                    v-model="selectedStatusFilter"
                    type="radio"
                    value="ALL"
                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                  <label for="fitbit" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Tất cả </label>
                </li>
                <li class="flex items-center">
                  <input
                    id="option"
                    v-model="selectedStatusFilter"
                    type="radio"
                    value="ACTIVE"
                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                  <label for="fitbit" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >Đang hoạt động
                  </label>
                </li>
                <li class="flex items-center">
                  <input
                    id="option"
                    v-model="selectedStatusFilter"
                    type="radio"
                    value="INACTIVE"
                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                  <label for="fitbit" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >Không hoạt động
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-5 py-3">Tên</th>

                <th scope="col" class="px-4 py-3">Mô tả</th>
                <th scope="col" class="px-4 py-3">Trạng thái</th>

                <th scope="col" class="px-4 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(category, index) in filteredAndPaginatedBrands"
                :key="index"
                class="border-b dark:border-gray-700">
                <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <div class="pl-3">
                    <div class="text-base font-semibold">{{ category.name }}</div>
                  </div>
                </th>
                <td class="px-4 py-3">{{ category.description }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    :class="{
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': category.status === 'ACTIVE',
                      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300': category.status === 'INACTIVE',
                    }"
                    class="text-xs font-semibold me-2 px-2.5 py-0.5 rounded-full">
                    {{
                      category.status === 'ACTIVE'
                        ? 'Đang hoạt động'
                        : category.status === 'INACTIVE'
                        ? 'Không hoạt động'
                        : category.status
                    }}
                  </span>
                </td>
                <td class="px-4 py-3 flex items-center justify-end">
                  <button
                    class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                    type="button"
                    @click="openCateModal(category)">
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
    id="updateProductModal"
    tabindex="-1"
    aria-hidden="true"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
      <!-- Modal content -->
      <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
        <!-- Modal header -->
        <div class="flex justify-between items-center mb-2 rounded-t border-b sm:mb-5 dark:border-gray-600">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Thông tin thể loại</h3>
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
          <div className="relative inline-block">
            <input type="file" accept="image/*" class="hidden" id="fileInput" @change="handleFileChange" />
            <img
              v-if="!fileSelected"
              class="rounded-full object-cover w-36 h-36"
              :src="selectedCate.imageUrl"
              :alt="selectedCate?.name + ' image'" />
            <img
              v-else
              class="rounded-full object-cover w-36 h-36"
              :src="fileImageUrl"
              :alt="selectedCate?.name + ' image'" />
            <div
              style="cursor: pointer"
              class="absolute hover:bg-white hover:bg-opacity-5 top-0 h-full w-full bg-black rounded-full bg-opacity-25 flex items-center justify-center"
              @click="handleUploadFile">
              <svg
                class="w-6 h-6 text-white dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 18">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="{2}"
                  d="M10 12.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="{2}"
                  d="M17 3h-2l-.447-.894A2 2 0 0 0 12.764 1H7.236a2 2 0 0 0-1.789 1.106L5 3H3a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a2 2 0 0 0-2-2Z" />
              </svg>
            </div>
          </div>

          <div class="grid gap-4 mb-4 sm:grid-cols-2">
            <div>
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên</label>
              <input
                type="text"
                v-model="selectedCate.name"
                name="name"
                id="name"
                class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
            </div>
            <div>
              <label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Trạng thái</label
              >
              <select
                v-model="selectedCate.status"
                id="status"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
              </select>
            </div>
          </div>
          <div>
            <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mô tả</label>
            <textarea
              v-model="selectedCate.description"
              type="string"
              name="description"
              id="description"
              class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"></textarea>
          </div>
          <div class="flex items-center mt-5 space-x-4">
            <button
              type="submit"
              @click.prevent="handleSubmitUpdateCate(selectedCate)"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              Cập nhật
            </button>
            <button
              @click="deleteCateById(selectedCate.id)"
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
              Xóa
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div
    v-if="showCreateModal"
    id="createProductModal"
    tabindex="-1"
    aria-hidden="true"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
      <!-- Modal content -->
      <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
        <!-- Modal header -->
        <div class="flex justify-between items-center mb-2 rounded-t border-b sm:mb-5 dark:border-gray-600">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tạo mới thể loại</h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-toggle="createProductModal"
            @click="showCreateModal = false">
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
          <div className="relative inline-block">
            <input type="file" accept="image/*" class="hidden" id="fileInput" @change="handleFileChange" />
            <img class="rounded-full object-cover w-36 h-36" :src="fileImageUrl" :alt="'New Brand Image'" />
            <div
              style="cursor: pointer"
              class="absolute hover:bg-white hover:bg-opacity-5 top-0 h-full w-full bg-black rounded-full bg-opacity-25 flex items-center justify-center"
              @click="handleUploadFile">
              <svg
                class="w-6 h-6 text-white dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 18">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="{2}"
                  d="M10 12.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="{2}"
                  d="M17 3h-2l-.447-.894A2 2 0 0 0 12.764 1H7.236a2 2 0 0 0-1.789 1.106L5 3H3a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a2 2 0 0 0-2-2Z" />
              </svg>
            </div>
          </div>

          <div class="grid gap-4 mb-4 sm:grid-cols-2">
            <div>
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên</label>
              <input
                type="text"
                name="name"
                v-model="newCate.name"
                id="name"
                class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
            </div>
          </div>
          <div>
            <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mô tả</label>
            <textarea
              v-model="newCate.description"
              type="string"
              name="description"
              id="description"
              class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"></textarea>
          </div>
          <div class="flex items-center mt-5 space-x-4">
            <button
              type="submit"
              @click.prevent="handleSubmitCreateCate(newCate)"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
