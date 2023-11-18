<script setup>
import Modal from '@/components/common-components/Modal.vue'
import Button from '@/components/common-components/Button.vue'
import ProductSerivice from '@/services/product.service'
import { onMounted, ref, computed, watch } from 'vue'
import { Carousel } from 'flowbite-vue'
import moment from 'moment'
import brandService from '@/services/brand.service'
import categoryService from '@/services/category.service'
import { base64Image } from '@/utils/imageFile'
import { Icon } from '@iconify/vue'
import { initFlowbite } from 'flowbite'
import Dropdown from '@/components/common-components/Dropdown.vue'
import AuctionService from '@/services/auction.service'
import adminService from '../../services/admin.service'
import { SIMPLE_TABLE_ITEMS_PER_PAGE, sellerTabs } from '@/common/constant'
import SellerSideBarLayout from '@/layouts/SellerSideBarLayout.vue'
import Breadcrumb from '@/layouts/Breadcrumb.vue'

const allowedModalTypes = { info: 'info' }
const isModalVisible = ref(false)
const typeofModal = ref('info')
const currentTab = ref('table')
const products = ref([])
const itemsPerPage = SIMPLE_TABLE_ITEMS_PER_PAGE
const currentPage = ref(1)
const isTableTabActive = ref(true)
const imgSrc = ref([])
const imgData = ref([])

const categories = ref([])
const brands = ref([])

const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Sản phẩm bị từ chối lên đấu giá',
    to: '/manage/product-rejected',
    disabled: true,
  },
]

const fetchProducts = async () => {
  try {
    const userID = localStorage.getItem('userId')
    const response = await adminService.getAllAuctions(1, 100)
    products.value = response.data
    products.value = products.value.filter(
      auction => auction?.status === 'REJECTED' && auction?.product?.seller?.id === userID,
    )
  } catch (e) {
    console.error(e)
  }
}
onMounted(async () => {
  const brandsData = await brandService.getAllBrands()
  const categoriesData = await categoryService.getAllCategories()
  brands.value = brandsData.data.filter(d => d.status === 'ACTIVE')
  categories.value = categoriesData.data.filter(d => d.status === 'ACTIVE')
})
const emit = defineEmits(['sendSuccess', 'sendError'])

const immediateMessage = `
Ở hình thức này, sau khi phiên đấu giá kết thúc,
người mua và người bán sẽ liên hệ với nhau qua hệ thống chat và giải quyết việc mua bạn trực tiếp với nhau,
để có được thông tin người mua, người bán phải thanh toán cho hệ thống
`

const intermediateMessage = `
Ở hình thức này, sau khi phiên đấu giá kết thúc,
người mua phải trả tiền trước cho hệ thống, sau khi hàng tới nơi người mua mà không có khiếu nại, đổi trả,
hệ thống sẽ chuyển số tiền người mua đã trả cho người bán
`
onMounted(() => {
  initFlowbite()
})

const convertedImages = ref([])
const durationData = [
  {
    label: '1 tiếng',
    value: 1,
  },
  {
    label: '3 tiếng',
    value: 3,
  },
  {
    label: '5 tiếng',
    value: 5,
  },
  {
    label: '10 tiếng',
    value: 10,
  },
  {
    label: '1 ngày',
    value: 24,
  },
  {
    label: '2 ngày',
    value: 48,
  },
  {
    label: '3 ngày',
    value: 72,
  },
  {
    label: '7 ngày',
    value: 24 * 7,
  },
  {
    label: 'Khác',
    value: null,
  },
]

const duration = ref({
  label: '3 tiếng',
  value: 3,
})
// const durationInput = ref(1)
const durationInput = computed(() => selectedProduct.value?.value?.duration)
const props = defineProps({
  product: {
    required: true,
  },
})

const formData = ref({
  startPrice: '',
  jump: '',
  buyNowPrice: '',
  modelType: 0,
  daysOfDuration: 0,
  hoursOfDuration: 0,
  minutesOfDuration: 0,
})

const onSubmit = () => {
  const durationValue = duration.value?.value ? duration.value.value : durationInput.value
  const dataAuction = {
    startPrice: selectedProduct?.value.startPrice || 0,
    jump: selectedProduct?.value.jump,
    buyNowPrice: selectedProduct?.value.buyNowPrice || 0,
    modelType: selectedProduct?.value.modelType,
    hoursOfDuration: durationValue,
  }
  const dataProduct = {
    updateProductRequest: {
      name: selectedProduct?.value?.product?.name, // Replace with the desired name
      description: selectedProduct?.value?.product?.description, // Replace with the desired description
      weight: selectedProduct?.value?.product?.weight, // Replace with the desired weight
      brandId: selectedProduct?.value?.product?.brand?.id,
      statusProduct: 'APPROVING', // Replace with the desired status
      categoryId: selectedProduct?.value?.product?.category?.id,
    },
    oldImagesRemoved: [''], // Replace with actual image paths
    newImages: [...selectedProduct?.value?.product?.imageUrls], // Replace with actual image paths
  }
  ProductSerivice.updateProductById(selectedProduct.value?.product?.id, dataProduct)
    .then(_ => {
      emit('sendSuccess')
      AuctionService.sendAuctionRequest(selectedProduct.value?.product?.id, dataAuction)
        .then(_ => {
          emit('sendSuccess')
        })
        .catch(error => {
          emit('sendError')
        })
    })
    .catch(error => {
      emit('sendError')
    })
}

onMounted(() => {
  initFlowbite()
})
// Computed property for total pages
const totalPages = computed(() => {
  return Math.ceil(products.value.length / itemsPerPage)
})
// Function to go to a specific page
const goToPage = page => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const handleFileUpload = async e => {
  imgData.value.push(e.target.files[0])
  imgSrc.value.push(await base64Image(e.target.files[0]))
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
const paginateProduct = computed(() => {
  // Move startIndex and endIndex calculation here
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return products.value.slice(startIndex, endIndex)
})
onMounted(async () => {
  await fetchProducts()
})
const showTableTab = () => {
  currentTab.value = 'table'
}

const showFormTab = () => {
  currentTab.value = 'form'
}

const showModal = typeModal => {
  typeofModal.value = typeModal
  isModalVisible.value = true
}

const closeModal = () => {
  isModalVisible.value = false
  showProductModal.value = false
}

const handleConfirm = () => {
  closeModal()
}
const showProductModal = ref(false)
const selectedProduct = ref(null)
const openProductModal = product => {
  selectedProduct.value = product // Set the selected brand data
  showProductModal.value = true // Show the modal
  convertedImages.value =
    selectedProduct.value?.product?.imageUrls.map(url => ({
      src: url,
      alt: 'Image Alt Text', // You can set the alt text as per your requirements
    })) || []
}
const tabButtonClasses = tabName => ({
  'bg-blue-500 hover:bg-blue-600 text-white': currentTab.value === tabName,
  'bg-gray-300 hover:bg-gray-400 text-gray-600': currentTab.value !== tabName,
})
</script>
<template>
  <div class="w-full">
    <!-- Breadcrumb -->
    <div class="pt-2 pb-2 container mx-auto">
      <Breadcrumb :items="breadcrumbItems" />
    </div>

    <!-- Main content -->
    <SellerSideBarLayout :cur-tab="sellerTabs.rejectedProductToAuction.value">
      <div class="mx-auto container bg-white rounded align-middle pt-8 px-2 min-h-[50vh]">
        <section class="p-3 sm:p-5">
          <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-5 py-3">Tên sản phẩm</th>
    
                    <th scope="col" class="px-4 py-3">Mô tả</th>
                    <th scope="col" class="px-4 py-3">Lý do</th>
                    <th scope="col" class="px-4 py-3">Ngày tạo</th>
                    <th scope="col" class="px-4 py-3">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(auction, index) in paginateProduct"
                    :key="index"
                    class="border-b dark:border-gray-700"
                    @click="openProductModal(auction)">
                    <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                      <div class="pl-3">
                        <div class="text-base font-semibold">{{ auction?.product?.name }}</div>
                      </div>
                    </th>
                    <td class="px-4 py-3" style="white-space: pre-line; word-wrap: break-word">
                      {{ auction?.product?.description }}
                    </td>
                    <td class="px-4 py-3" style="white-space: pre-line; word-wrap: break-word">
                      {{ auction?.rejectReason }}
                    </td>
                    <td class="px-4 py-3">{{ new Date(auction?.product?.createAt).toLocaleString() }}</td>
                    <td class="px-4 py-3 flex items-center justify-end">
                      <button
                        class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                        type="button">
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
        </section>
      </div>
      
    </SellerSideBarLayout>
    <!-- Modal -->
    <div>
      <Modal
        v-if="showProductModal"
        :widthClass="'w-[700px]'"
        :hasOverFlowVertical="true"
        :hasButton="false"
        @decline-modal="closeModal"
        @confirm-modal="handleConfirm">
        <div v-if="typeofModal === allowedModalTypes.info">
          <div class="bg-white rounded-lg shadow-md space-y-4">
            <div
              class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
              <ul class="flex flex-wrap -mb-px">
                <li class="mr-2">
                  <button
                    @click="showTableTab"
                    :class="{
                      'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500':
                        currentTab === 'table',
                      'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300':
                        currentTab !== 'table',
                    }">
                    Thông Tin
                  </button>
                </li>
                <li class="mr-2">
                  <button
                    @click="showFormTab"
                    :class="{
                      'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500':
                        currentTab !== 'table',
                      'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300':
                        currentTab === 'table',
                    }"
                    aria-current="page">
                    Gửi Lại Yêu Cầu Đấu Giá
                  </button>
                </li>
              </ul>
            </div>
  
            <div v-if="currentTab === 'table'">
              <div class="flex mb-5 items-center justify-center">
                <div class="relative p-4 w-full max-w-4xl md:h-auto">
                  <!-- Modal content -->
                  <div class="relative p-4 bg-white rounded-lg dark:bg-gray-800 sm:p-5">
                    <!-- Modal body -->
                    <div class="overflow-y-auto">
                      <form action="#">
                        <div class="grid mt-2 gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >Tên sản phẩm
                            </label>
                            <input
                              type="text"
                              name="name"
                              readonly
                              :value="selectedProduct?.product?.name"
                              id="name"
                              class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                          </div>
  
                          <div>
                            <label for="startPrice" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >Giá khởi điểm</label
                            >
                            <input
                              type="text"
                              name="startPrice"
                              id="startPrice"
                              :value="
                                selectedProduct?.startPrice
                                  ? selectedProduct.startPrice.toLocaleString('vi-VN') + ' VND'
                                  : ''
                              "
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
                              readonly
                              :value="
                                selectedProduct?.buyNowPrice
                                  ? selectedProduct.buyNowPrice.toLocaleString('vi-VN') + ' VND'
                                  : ''
                              "
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
                              readonly
                              :value="selectedProduct?.jump ? selectedProduct.jump.toLocaleString('vi-VN') + ' VND' : ''"
                              class="bg-gray-50 border border-gray-300 text-blue-600 font-semibold text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                          </div>
                          <div>
                            <label for="reject" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >Lý do từ chối</label
                            >
                            <input
                              type="text"
                              name="reject"
                              id="reject"
                              readonly
                              :value="selectedProduct?.rejectReason"
                              class="bg-gray-50 border border-gray-300 text-red-600 font-semibold text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                          </div>
                          <div>
                            <label for="censor" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >Người kiểm duyệt</label
                            >
                            <input
                              type="text"
                              name="censor"
                              id="censor"
                              readonly
                              value="Admin"
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
                            readonly
                            id="description"
                            :value="selectedProduct?.product?.description"
                            class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"></textarea>
                        </div>
  
                        <div class="flex items-center mt-2 space-x-4"></div>
                        <div>
                          <Carousel :pictures="convertedImages"></Carousel>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Form Tab -->
            <div v-if="currentTab === 'form'">
              <form class="bg-white rounded px-8 pt-6 pb-8 mb-4">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="title"> Tên Sản Phẩm </label>
                  <input
                    v-model="selectedProduct.product.name"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="title"
                    type="text"
                    placeholder="Nhập tên sản phẩm" />
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="description"> Mô tả </label>
                  <textarea
                    v-model="selectedProduct.product.description"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="description"
                    rows="4"
                    placeholder="Nhập mô tả"></textarea>
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="weight"> Trọng lượng (gram) </label>
                  <input
                    v-model="selectedProduct.product.weight"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="weight"
                    type="text"
                    placeholder="Nhập trọng lượng" />
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="brand"> Thương hiệu sản phẩm </label>
                  <select
                    v-model="selectedProduct.product.brand.id"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="brand">
                    <option value="" disabled selected>Chọn thương hiệu</option>
                    <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                  </select>
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="category"> Loại sản phẩm </label>
                  <select
                    v-model="selectedProduct.product.category.id"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="category">
                    <option value="" disabled selected>Chọn loại</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
  
                <div class="mb-4 w-full overflow-x-auto">
                  <div v-for="src in selectedProduct.product.imageUrls" :key="src" class="inline-block mr-2">
                    <img :src="src" alt="product image" class="w-40 h-40 border-4 border-blue-500" />
                  </div>
                  <div v-if="imgSrc.length > 0">
                    <div v-for="src in imgSrc" :key="src" class="inline-block mr-2">
                      <img :src="src" alt="product image" class="w-40 h-40 border-4 border-blue-500" />
                    </div>
                  </div>
                </div>
                <div class="mb-4">
                  <button
                    @click="() => $refs.file.click()"
                    @click.prevent
                    class="flex items-center bg-white hover:!bg-gray-200 gap-3 w-[180px] justify-center text-gray-800 mt-3 px-4 py-2 rounded text-sm border-[1px] border-blue-500">
                    <Icon icon="tdesign:upload" />
                    <span>Upload image</span>
                  </button>
                  <input type="file" hidden v-on:change="handleFileUpload($event)" ref="file" />
                </div>
  
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="title"> GIÁ KHỞI ĐIỂM (nếu có) </label>
                  <input
                    v-model="selectedProduct.startPrice"
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="title"
                    type="text"
                    placeholder="" />
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
                    GIÁ MUA NGAY (nếu có)
                  </label>
                  <input
                    v-model="selectedProduct.buyNowPrice"
                    class="shadow border rounded w-full text-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="description"
                    placeholder="" />
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
                    HÌNH THỨC MUA BÁN <span class="text-red-500 text-lg">*</span>
                  </label>
                  <div class="w-full flex items-center py-2">
                    <div class="flex items-center gap-3 mr-[20%]">
                      <input
                        type="radio"
                        id="immediate"
                        name="modelType"
                        value="IMMEDIATE"
                        v-model="selectedProduct.modelType" />
                      <label for="immediate" class="font-semibold text-black">TỰ TRAO ĐỔI MUA BÁN</label>
                      <button data-tooltip-target="tooltip-hover" data-tooltip-trigger="hover" type="button">
                        <Icon icon="mdi:information" class="text-[20px]" />
                      </button>
                      <div
                        id="tooltip-hover"
                        role="tooltip"
                        class="absolute !z-[1002] w-[20vw] invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                        {{ immediateMessage }}
                        <div class="tooltip-arrow" data-popper-arrow></div>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <input type="radio" id="intermediate" value="INTERMEDIATE" v-model="selectedProduct.modelType" />
                      <label for="intermediate" class="font-semibold text-black">TRUNG GIAN QUA HỆ THỐNG</label>
                      <div>
                        <button data-tooltip-target="tooltip-hover" data-tooltip-trigger="hover" type="button">
                          <Icon icon="mdi:information" class="text-[20px]" />
                        </button>
                        <div
                          id="tooltip-hover"
                          role="tooltip"
                          class="absolute !z-[1002] w-[20vw] invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                          {{ intermediateMessage }}
                          <div class="tooltip-arrow" data-popper-arrow></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="jump">
                    THỜI GIAN ĐẤU GIÁ <span class="text-red-500 text-lg">*</span>
                  </label>
                  <div class="flex gap-3 items-center">
                    <Dropdown :data="durationData" v-model="duration" class="!w-[200px]" />
                    <input
                      v-model="durationInput"
                      v-if="!duration.value"
                      type="number"
                      class="shadow appearance-none border rounded w-[10%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="duration"
                      placeholder="" />
                    <div class="block text-gray-700 text-sm font-bold">giờ</div>
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="jump">
                    BƯỚC NHẢY TỐI THIỂU <span class="text-red-500 text-lg">*</span>
                  </label>
                  <div class="flex gap-3 items-center">
                    <input
                      v-model="selectedProduct.jump"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="jump"
                      type="text"
                      placeholder="" />
                    <div class="block text-gray-700 text-sm font-bold">VNĐ</div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <button
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button">
                    Hủy
                  </button>
                  <button
                    @click="onSubmit()"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button">
                    Gửi Yêu Cầu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>
