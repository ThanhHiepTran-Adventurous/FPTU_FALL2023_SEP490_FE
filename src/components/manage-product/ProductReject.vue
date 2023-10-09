<script setup>
import Modal from '@/components/common-components/Modal.vue'
import Button from '@/components/common-components/Button.vue'
import productSerivice from '@/services/product.service'
import { onMounted, ref, computed, watch } from 'vue'
import ProductInfoModal from '@/components/manage-product/ProductInfoModal.vue'
const allowedModalTypes = { info: 'info' }
const isModalVisible = ref(false)
const typeofModal = ref('info')
const currentTab = ref('table')
const products = ref([])
const itemsPerPage = 4
const currentPage = ref(1)

const imgSrc = ref([])
const imgData = ref([])
import moment from 'moment'
import brandService from '@/services/brand.service'
import categoryService from '@/services/category.service'
import { base64Image } from '@/utils/imageFile'
import { Icon } from '@iconify/vue'
import { initFlowbite } from 'flowbite'
import Dropdown from '@/components/common-components/Dropdown.vue'
import AuctionService from '@/services/auction.service'
import adminService from '../../services/admin.service'
const categories = ref([])
const brands = ref([])
const fetchProducts = async () => {
  try {
    const userID = localStorage.getItem('userId')
    // console.log(userID)
    const response = await adminService.getAllAuctions(1, 100)
    products.value = response.data
    products.value = products.value.filter(
      auction => auction?.status === 'REJECTED' && auction?.product?.seller?.id === userID,
    )
    console.log(products.value)
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

// const currentTab = ref('table');

// const showTableTab = () => {
//   currentTab.value = 'table';
// };

// const showFormTab = () => {
//   currentTab.value = 'form';
// };
const productFormData = ref({
  name: '',
  description: '',
  weight: '',
  brandId: '',
  categoryId: '',
})
const onSubmit = () => {
  const durationValue = duration.value?.value ? duration.value.value : durationInput.value
  console.log(selectedProduct?.value?.duration)
  console.log(durationValue)
  // const durationValue = duration.value?.value ? duration.value.value : durationInput.value
  // const data = {
  //   startPrice: formData.value.startPrice || 0,
  //   jump: formData.value.jump,
  //   buyNowPrice: formData.value.buyNowPrice || 0,
  //   modelType: formData.value.modelType,
  //   hoursOfDuration: durationValue,
  // }

  // AuctionService.sendAuctionRequest(selectedProduct.value?.product?.id, data)
  //   .then(_ => {
  //     emit('sendSuccess')
  //   })
  //   .catch(error => {
  //     emit('sendError')
  //   })
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
  // console.log(selectedbrand.value)
  showProductModal.value = true // Show the modal
}
const tabButtonClasses = tabName => ({
  'bg-blue-500 hover:bg-blue-600 text-white': currentTab.value === tabName,
  'bg-gray-300 hover:bg-gray-400 text-gray-600': currentTab.value !== tabName,
})
</script>
<template>
  <div class="mx-auto container align-middle">
    <table class="w-full table-auto text-sm">
      <thead>
        <tr class="text-sm leading-normal">
          <th class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
            Tên sản phẩm
          </th>
          <th class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
            Mô tả
          </th>
          <th
            class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-right">
            Lý do
          </th>
          <th
            class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-right">
            Ngày tạo
          </th>
          <th
            class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-right">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(auction, index) in paginateProduct"
          :key="index"
          class="hover:bg-grey-lighter"
          @click="openProductModal(auction)">
          <td class="py-2 px-4 border-b border-grey-light">{{ auction?.product?.name }}</td>
          <td class="py-2 px-4 border-b border-grey-light">{{ auction?.product?.description }}</td>
          <td class="py-2 px-4 border-b border-grey-light text-right">{{ auction?.rejectReason }}</td>
          <td class="py-2 px-4 border-b border-grey-light text-right">
            {{ new Date(auction?.product?.createAt).toLocaleString() }}
          </td>
          <td class="py-2 px-4 border-b border-grey-light text-right">
            <Button @click="openProductModal(auction)"> Phản Hồi </Button>
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
  <div>
    <Modal
      v-if="showProductModal"
      :widthClass="'w-[700px]'"
      :hasOverFlowVertical="true"
      :hasButton="false"
      @decline-modal="closeModal"
      @confirm-modal="handleConfirm">
      <div v-if="typeofModal === allowedModalTypes.info">
        <div class="bg-white rounded-lg shadow-xl space-y-4">
          <div class="flex space-x-4">
            <Button @click="showTableTab" :class="tabButtonClasses('table')">Thông Tin</Button>
            <Button @click="showFormTab" :class="tabButtonClasses('form')">Gửi Lại Yêu Cầu Đấu Giá</Button>
          </div>

          <div v-if="currentTab === 'table'">
            <div class="mb-5">
              <ul class="mx-5 text-gray-700">
                <!-- Table content -->
                <li class="flex border-y py-2">
                  <span class="font-bold w-50">Tên Sản Phẩm:</span>
                  <span class="text-gray-700">{{ selectedProduct?.product?.name }}</span>
                </li>
                <li class="flex border-y py-2">
                  <span class="font-bold w-50">Giá Khởi Điểm:</span>
                  <span class="text-gray-700">{{
                    selectedProduct?.startPrice ? selectedProduct.startPrice.toLocaleString('vi-VN') + ' VND' : ''
                  }}</span>
                </li>
                <li class="flex border-y py-2">
                  <span class="font-bold w-50">Giá Mua Ngay:</span>
                  <span class="text-gray-700">{{
                    selectedProduct?.buyNowPrice ? selectedProduct.buyNowPrice.toLocaleString('vi-VN') + ' VND' : ''
                  }}</span>
                </li>
                <li class="flex border-y py-2">
                  <span class="font-bold w-50">Bước Nhảy Tối Thiểu:</span>
                  <span class="text-gray-700">{{
                    selectedProduct?.jump ? selectedProduct.jump.toLocaleString('vi-VN') + ' VND' : ''
                  }}</span>
                </li>
                <li class="flex border-y py-2">
                  <span class="font-bold w-50">Lý Do Từ Chối:</span>
                  <span class="text-gray-700">{{ selectedProduct?.rejectReason }}</span>
                </li>
                <li class="flex border-y py-2">
                  <span class="font-bold w-50">Người Kiểm Duyệt:</span>
                  <span class="text-gray-700">Admin</span>
                </li>
              </ul>
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
                <div v-for="src in imgSrc" :key="src" class="inline-block mr-2" v-if="imgSrc.length > 0">
                  <img :src="src" alt="product image" class="w-40 h-40 border-4 border-blue-500" />
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
              <!-- <div class="flex items-center justify-between">
                <button
                  @click.prevent
                  @click="() => onSubmit()"
                  class="bg-blue-600 hover:bg-blue-800 w-[180px] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button">
                  Tạo sản phẩm
                </button>
              </div> -->

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
</template>
