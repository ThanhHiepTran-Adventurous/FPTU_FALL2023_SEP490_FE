<script setup>
import Modal from '@/components/common-components/Modal.vue'
import Button from '@/components/common-components/Button.vue'
import ProductSerivice from '@/services/product.service'
import { onMounted, ref, computed } from 'vue'
import { Carousel } from 'flowbite-vue'
import brandService from '@/services/brand.service'
import categoryService from '@/services/category.service'
import { base64Image } from '@/utils/imageFile'
import { Icon } from '@iconify/vue'
import { initFlowbite } from 'flowbite'
import Dropdown from '@/components/common-components/Dropdown.vue'
import AuctionService from '@/services/auction.service'
import { sellerTabs } from '@/common/constant'
import SellerSideBarLayout from '@/layouts/SellerSideBarLayout.vue'
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import CurrencyInput from '../common-components/CurrencyInput.vue'
import {
  SIMPLE_TABLE_ITEMS_PER_PAGE,
  intermediateMessage,
  immediateMessage,
  selectedDefaultDuration,
  durationData,
  DUMP_IMG_FILE_DATA,
} from '@/common/commonStaticState'
import moment from 'moment'
import ListEditableImage from '../ListEditableImage.vue'
import currencyFormatter from '@/utils/currencyFormatter'
import toastOption from '@/utils/toast-option'
import { ProductStatus } from '@/common/contract'
import ErrorMessage from '../common-components/ErrorMessage.vue'
import { getUuidSplitted } from '@/utils/uuid-cutter'
import { Tooltip } from 'ant-design-vue'

const allowedModalTypes = { info: 'info' }
const typeofModal = ref('info')
const currentTab = ref('table')
const products = ref([])
const itemsPerPage = SIMPLE_TABLE_ITEMS_PER_PAGE
const currentPage = ref(1)
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
    const response = await AuctionService.getAuctionBySeller('status:REJECTED')
    const dataFiltered = response.data ? response.data.filter(f => f.product.status === ProductStatus.REJECTED.value) : []
    const latestAuctionRequests = []
    for(const product of dataFiltered){
      let latestRequestTime
      const allSameProduct = dataFiltered.filter(f => f.product.id === product.product.id)
      if(!allSameProduct || allSameProduct.length === 0){
        latestAuctionRequests.push(product)
      } else {
        for (const data of allSameProduct) {
          const curRequestTime = new Date(data.createAt).getTime()
          if (!latestRequestTime || latestRequestTime < curRequestTime) {
            latestRequestTime = curRequestTime
          }
        }
        if (new Date(product.createAt).getTime() === latestRequestTime) {
          latestAuctionRequests.push(product)
        }
      }
    }
    products.value = [...latestAuctionRequests]
  } catch (e) {
    console.error(e)
  }
}
onMounted(async () => {
  const brandsData = await brandService.getAllBrands()
  const categoriesData = await categoryService.getAllCategories()
  brands.value = brandsData.data.filter(d => d.status === 'ACTIVE')
  categories.value = categoriesData.data.filter(d => d.status === 'ACTIVE')
  initFlowbite()
  fetchProducts()
})

const convertedImages = ref([])
const originalImages = ref([])
const duration = ref(selectedDefaultDuration)
const durationInput = ref('')

const productFormData = ref({
  name: '',
  description: '',
  weight: '',
  brand: '',
  category: '',
})
const auctionFormData = ref({
  startPrice: '',
  jump: '',
  buyNowPrice: '',
  modelType: 0,
  hoursOfDuration: 0,
  minutesOfDuration: 0,
  minimumAuctioneers: '',
})

const clearDataState = () => {
  productFormData.value = {
    name: '',
    description: '',
    weight: '',
    brand: '',
    category: '',
  }
  auctionFormData.value = {
    startPrice: '',
    jump: '',
    buyNowPrice: '',
    modelType: 0,
    hoursOfDuration: 0,
    minutesOfDuration: 0,
    minimumAuctioneers: '',
  }
  originalImages.value = []
  imgSrc.value = []
  imgData.value = []
}

const setDataStateBaseOnDetail = detail => {
  canReup.value = false
  productFormData.value = {
    name: detail.product.name,
    description: detail.product.description,
    weight: detail.product.weight,
    brand: {
      id: detail.product.brand.id,
      name: detail.product.brand.name,
    },
    category: {
      id: detail.product.category.id,
      name: detail.product.category.name,
    },
  }
  auctionFormData.value = {
    startPrice: currencyFormatter.fromNumberToStyledString(detail.startPrice),
    jump: currencyFormatter.fromNumberToStyledString(detail.jump),
    buyNowPrice: currencyFormatter.fromNumberToStyledString(detail.buyNowPrice),
    modelType: detail.modelType,
    hoursOfDuration: 1,
    minutesOfDuration: 0,
    minimumAuctioneers: detail.minimumAuctioneers,
  }

  const filteredDurationData = durationData.filter(f => f.value === detail.duration / (1000 * 60 * 60))
  if (filteredDurationData && filteredDurationData.length > 0) {
    duration.value = filteredDurationData[0]
  } else {
    durationInput.value = detail.duration / (1000 * 60 * 60)
  }

  originalImages.value = [...detail.product.imageUrls]

  imgSrc.value = [...detail.product.imageUrls]
  imgData.value = detail.product.imageUrls.map(url => DUMP_IMG_FILE_DATA)
}

const getImageUrlIgnored = () => {
  return originalImages.value.filter(f => {
    const dataFetched = imgSrc.value.filter(src => src === f)
    return !(dataFetched && dataFetched.length > 0)
  })
}
const getNewImages = () => {
  return imgData.value.filter(f => f !== DUMP_IMG_FILE_DATA)
}
const manualAuctionErrorState = ref({
  productName: '',
  description: '',
  weight: '',
  brandId: '',
  categoryId: '',
  image: '',
})
const resetErrorState = () => {
  manualAuctionErrorState.value = {
    productName: '',
    description: '',
    weight: '',
    brandId: '',
    categoryId: '',
    image: '',
  }
}
const validateManual = () => {
  let result = true
  if (productFormData.value.name.trim() === '') {
    manualAuctionErrorState.value.productName = 'Vui lòng nhập tên sản phẩm'
    result = false
  }
  if (productFormData.value.description.trim() === '') {
    manualAuctionErrorState.value.description = 'Vui lòng nhập miêu tả'
    result = false
  }
  if (productFormData.value.description.length > 1000) {
    manualAuctionErrorState.value.description = 'Miêu tả không được vượt quá 1000 kí tự'
    result = false
  }
  if (!productFormData.value.weight) {
    manualAuctionErrorState.value.weight = 'Vui lòng nhập trọng lượng'
    result = false
  }
  if (productFormData.value.weight > 10000) {
    manualAuctionErrorState.value.weight = 'Trọng lượng không được quá 10kg'
    result = false
  }
  if (!productFormData.value.brand.id) {
    manualAuctionErrorState.value.brandId = 'Vui lòng chọn thương hiệu sản phẩm'
    result = false
  }
  if (!productFormData.value.category.id) {
    manualAuctionErrorState.value.categoryId = 'Vui lòng chọn loại sản phẩm'
    result = false
  }
  if (imgSrc.value.length === 0) {
    manualAuctionErrorState.value.image = 'Vui lòng tải lên ít nhất một hình ảnh'
    result = false
  }
  return result
}
const onSubmit = () => {
  resetErrorState()
  if (!validateManual()) {
    return
  } else {
    const toastId = toastOption.toastLoadingMessage('Đang cập nhật sản phẩm và yêu cầu đấu giá')
    const durationValue = duration.value.value ? duration.value.value : durationInput.value
    let imageUrlIgnored = getImageUrlIgnored()
    imageUrlIgnored = imageUrlIgnored && imageUrlIgnored.length > 0 ? imageUrlIgnored : []
    let newImages = getNewImages()
    newImages = newImages && newImages.length > 0 ? newImages : []
    const updateProductRequest = {
      name: productFormData.value.name,
      description: productFormData.value.description,
      weight: productFormData.value.weight,
      brandId: productFormData.value.brand.id,
      categoryId: productFormData.value.category.id,
    }
    const auctionRequest = {
      startPrice: currencyFormatter.fromStyledStringToNumber(auctionFormData.value.startPrice),
      jump: currencyFormatter.fromStyledStringToNumber(auctionFormData.value.jump),
      buyNowPrice: currencyFormatter.fromStyledStringToNumber(auctionFormData.value.buyNowPrice),
      minimumAuctioneers: auctionFormData.value.minimumAuctioneers,
      modelType: auctionFormData.value.modelType,
      hoursOfDuration: durationValue,
      minutesOfDuration: durationValue === 0 ? 10 : 0,
    }
    ProductSerivice.updateProductById(
      selectedProduct.value.product.id,
      imageUrlIgnored,
      newImages,
      updateProductRequest,
    )
      .then(_ => {
        AuctionService.sendAuctionRequest(selectedProduct.value.product.id, auctionRequest)
          .then(_ => {
            toastOption.updateLoadingToast(toastId, 'Gửi lại thông tin yêu cầu đấu giá thành công', false)
          })
          .catch(_ => {
            toastOption.updateLoadingToast(toastId, 'Có lỗi xảy ra vui lòng thử lại', true)
          })
      })
      .catch(_ => {
        toastOption.updateLoadingToast(toastId, 'Có lỗi xảy ra vui lòng thử lại', true)
      })
      .finally(() => {
        clearDataState()
        fetchProducts()
        closeModal()
      })
  }
}

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

const handleImageDeleted = indx => {
  imgSrc.value.splice(indx, 1)
  imgData.value.splice(indx, 1)
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

const showTableTab = () => {
  currentTab.value = 'table'
}

const showFormTab = () => {
  currentTab.value = 'form'
}

const closeModal = () => {
  showProductModal.value = false
}

const handleConfirm = () => {
  closeModal()
}

const showProductModal = ref(false)
const selectedProduct = ref(null)

const canReup = ref(false)

const openProductModal = product => {
  setDataStateBaseOnDetail(product)

  selectedProduct.value = product // Set the selected brand data
  let latestRequestTime
  const allSameProduct = products.value.filter(f => f.product.id === product.product.id)
  for (const data of allSameProduct) {
    const curRequestTime = new Date(data.createAt).getTime()
    if (!latestRequestTime || latestRequestTime < curRequestTime) {
      latestRequestTime = curRequestTime
    }
  }
  if (new Date(selectedProduct.value.createAt).getTime() === latestRequestTime) {
    canReup.value = true
  }
  showProductModal.value = true // Show the modal

  convertedImages.value =
    selectedProduct.value?.product?.imageUrls.map(url => ({
      src: url,
      alt: 'Image Alt Text', // You can set the alt text as per your requirements
    })) || []
}
</script>
<template>
  <div class="w-full">
    <!-- Breadcrumb -->
    <div class="pt-2 pb-2 container mx-auto">
      <Breadcrumb :items="breadcrumbItems" />
    </div>

    <!-- Main content -->
    <SellerSideBarLayout :cur-tab="sellerTabs.rejectedProductToAuction.value">
      <div class="bg-white container mx-auto rounded w-full min-h-[80vh]">
        <!-- Header -->
        <div class="pt-3 px-3 pb-1 flex items-center justify-between">
          <div class="font-bold text-2xl text-black text-blue-800">Yêu cầu đấu giá bị từ chối</div>
        </div>
        <section class="sm:p-5">
          <div class="bg-white relative">
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" class="px-5 py-3 w-[10%]">ID</th>
                    <th scope="col" class="px-5 py-3 w-[20%]">Tên sản phẩm</th>
                    <th scope="col" class="px-4 py-3 w-[25%]">Mô tả</th>
                    <th scope="col" class="px-4 py-3 w-[25%]">Lý do</th>
                    <th scope="col" class="px-4 py-3 w-[10%]">Ngày tạo</th>
                    <th scope="col" class="px-4 py-3 w-[10%]">
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
                    <td class="px-4 py-3">
                      {{ getUuidSplitted(auction?.product?.id) }}
                    </td>
                    <td class="px-6 py-0">
                      <Tooltip class="relative" placement="bottomLeft">
                        <template #title>{{ auction?.product?.name }}</template>
                        <div class="text-base font-semibold text-black line-clamp-1">{{ auction?.product?.name }}</div>
                      </Tooltip>
                    </td>
                    <td class="px-4 py-0">
                      <Tooltip class="relative" placement="bottomLeft">
                        <template #title>{{ auction?.product?.description }}</template>
                        <div class="line-clamp-1">
                          {{ auction?.product?.description }}
                        </div>
                      </Tooltip>
                    </td>
                    <td class="px-4 py-3">
                      {{ auction?.rejectReason }}
                    </td>
                    <td class="px-4 py-3">
                      {{
                        auction?.product?.createAt
                          ? moment.utc(auction?.createAt).format('DD/MM/YYYY HH:mm:ss')
                          : ''
                      }}
                    </td>
                    <td class="px-4 py-3 flex items-center justify-end">
                      <button
                        class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none"
                        type="button">
                        <svg
                          class="w-6 h-6 text-gray-800"
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
                    class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
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
                      'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700':
                        pageNumber !== currentPage,
                      'text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700':
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
                    class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
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
        title="Chi tiết"
        :widthClass="'w-[50vw]'"
        :hasOverFlowVertical="true"
        :hasButton="false"
        @decline-modal="closeModal"
        @confirm-modal="handleConfirm">
        <div v-if="typeofModal === allowedModalTypes.info">
          <div class="bg-white rounded-lg">
            <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
              <ul class="flex flex-wrap -mb-px">
                <li class="mr-2">
                  <button
                    @click="showTableTab"
                    :class="{
                      'inline-block px-4 py-2 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active':
                        currentTab === 'table',
                      'inline-block px-4 py-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600':
                        currentTab !== 'table',
                    }">
                    Thông Tin
                  </button>
                </li>
                <li class="mr-2">
                  <button
                    @click="showFormTab"
                    :class="{
                      'inline-block px-4 py-2 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active':
                        currentTab !== 'table',
                      'inline-block px-4 py-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300':
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
                <div class="relative w-full max-w-4xl md:h-auto">
                  <!-- Modal content -->
                  <div class="relative bg-white rounded-lg sm:p-5">
                    <!-- Modal body -->
                    <div class="overflow-y-auto">
                      <form action="#">
                        <div class="grid mt-2 gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Tên sản phẩm </label>
                            <input
                              type="text"
                              name="name"
                              readonly
                              :value="selectedProduct?.product?.name"
                              id="name"
                              class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                          </div>

                          <div>
                            <label for="startPrice" class="block mb-2 text-sm font-medium text-gray-900"
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
                              class="bg-gray-50 border border-gray-300 text-blue-600 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                          </div>
                          <div>
                            <label for="buyNowPrice" class="block mb-2 text-sm font-medium text-gray-900"
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
                              class="bg-gray-50 border border-gray-300 text-blue-600 font-semibold text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                          </div>
                          <div>
                            <label for="jump" class="block mb-2 text-sm font-medium text-gray-900"
                              >Bước nhảy tối thiểu</label
                            >
                            <input
                              type="text"
                              name="jump"
                              id="jump"
                              readonly
                              :value="
                                selectedProduct?.jump ? selectedProduct.jump.toLocaleString('vi-VN') + ' VND' : ''
                              "
                              class="bg-gray-50 border border-gray-300 text-blue-600 font-semibold text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                          </div>
                          <div>
                            <label for="reject" class="block mb-2 text-sm font-medium text-gray-900"
                              >Lý do từ chối</label
                            >
                            <input
                              type="text"
                              name="reject"
                              id="reject"
                              readonly
                              :value="selectedProduct?.rejectReason"
                              class="bg-gray-50 border border-gray-300 text-red-600 font-semibold text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                          </div>
                          <div>
                            <label for="censor" class="block mb-2 text-sm font-medium text-gray-900"
                              >Người kiểm duyệt</label
                            >
                            <input
                              type="text"
                              name="censor"
                              id="censor"
                              readonly
                              value="Admin"
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                          </div>
                        </div>
                        <div>
                          <label for="description" class="block mb-2 text-sm font-medium text-gray-900">Mô tả</label>
                          <textarea
                            type="string"
                            name="description"
                            rows="6"
                            readonly
                            id="description"
                            :value="selectedProduct?.product?.description"
                            class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"></textarea>
                        </div>

                        <div class="flex items-center mt-2 space-x-4"></div>
                        <div>
                          <label for="description" class="block mb-2 text-sm font-medium text-gray-900">Hình ảnh</label>
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
                    v-model="productFormData.name"
                    class="shadow text-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                    id="title"
                    type="text"
                  />
                  <ErrorMessage :text="manualAuctionErrorState.productName" />
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="description"> Mô tả </label>
                  <textarea
                    v-model="productFormData.description"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="description"
                  ></textarea>
                  <ErrorMessage :text="manualAuctionErrorState.description" />
                </div>
                <div class="mb-4">
                  <label class="block text-sm text-gray-700 text-sm font-bold mb-2" for="weight"> Trọng lượng (gram) </label>
                  <input
                    v-model="productFormData.weight"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="weight"
                    type="text"
                  />
                  <ErrorMessage :text="manualAuctionErrorState.weight" />
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="brand"> Thương hiệu sản phẩm </label>
                  <select
                    v-model="productFormData.brand.id"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="brand">
                    <option value="" disabled selected>Chọn thương hiệu</option>
                    <option
                      v-for="brand in brands"
                      :key="brand.id"
                      :value="brand.id"
                      :selected="brand.id === productFormData.brand.id">
                      {{ brand.name }}
                    </option>
                  </select>
                  <ErrorMessage :text="manualAuctionErrorState.brand" />
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="category"> Loại sản phẩm </label>
                  <select
                    v-model="productFormData.category.id"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="category">
                    <option value="" disabled selected>Chọn loại</option>
                    <option
                      v-for="category in categories"
                      :key="category.id"
                      :value="category.id"
                      :selected="category.id === productFormData.category.id">
                      {{ category.name }}
                    </option>
                  </select>
                  <ErrorMessage :text="manualAuctionErrorState.category" />
                </div>

                <div class="mb-4 w-full overflow-x-auto">
                  <ListEditableImage v-if="imgSrc.length > 0" :img-src="imgSrc" @deleted="handleImageDeleted" />
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
                  <ErrorMessage :text="manualAuctionErrorState.image" />
                </div>

                <div class="mb-4 border-t-[1px] pt-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="title"> GIÁ KHỞI ĐIỂM (nếu có) </label>
                  <div class="w-full items-center">
                    <CurrencyInput v-model="auctionFormData.startPrice" placeholder="" w="w-full" />
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
                    GIÁ MUA NGAY (nếu có)
                  </label>
                  <div class="w-full items-center">
                    <CurrencyInput v-model="auctionFormData.buyNowPrice" placeholder="" w="w-full" />
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="jump">
                    BƯỚC NHẢY TỐI THIỂU <span class="text-red-500 text-lg">*</span>
                  </label>
                  <div class="w-full">
                    <CurrencyInput v-model="auctionFormData.jump" w="w-full" />
                  </div>
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
                        v-model="auctionFormData.modelType" />
                      <label for="immediate" class="font-semibold text-black">TỰ TRAO ĐỔI MUA BÁN</label>
                      <button data-tooltip-target="tooltip-hover" data-tooltip-trigger="hover" type="button">
                        <Icon icon="mdi:information" class="text-[20px]" />
                      </button>
                      <div
                        id="tooltip-hover"
                        role="tooltip"
                        class="absolute !z-[1002] w-[20vw] invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip">
                        {{ immediateMessage }}
                        <div class="tooltip-arrow" data-popper-arrow></div>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <input type="radio" id="intermediate" value="INTERMEDIATE" v-model="auctionFormData.modelType" />
                      <label for="intermediate" class="font-semibold text-black">TRUNG GIAN QUA HỆ THỐNG</label>
                      <div>
                        <button data-tooltip-target="tooltip-hover" data-tooltip-trigger="hover" type="button">
                          <Icon icon="mdi:information" class="text-[20px]" />
                        </button>
                        <div
                          id="tooltip-hover"
                          role="tooltip"
                          class="absolute !z-[1002] w-[20vw] invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip">
                          {{ intermediateMessage }}
                          <div class="tooltip-arrow" data-popper-arrow></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mb-4 flex items-center">
                  <div class="mr-[15%]">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="jump">
                      THỜI GIAN ĐẤU GIÁ <span class="text-red-500 text-lg">*</span>
                    </label>
                    <div class="flex gap-3 items-center">
                      <Dropdown :data="durationData" v-model="duration" class="!w-[200px]" />
                      <div class="flex items-center gap-3" :class="{
                        'invisible': duration.value
                      }">
                        <input
                          v-model="durationInput"
                          type="number"
                          class="shadow appearance-none border rounded w-[5rem] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="duration"
                          placeholder="" />
                        <div class="block text-gray-700 text-sm font-bold">giờ</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="jump">
                      SỐ NGƯỜI TỐI THIỂU THAM GIA ĐẤU GIÁ <span class="text-red-500 text-lg">*</span>
                    </label>
                    <div class="flex items-center gap-3">
                      <input
                        v-model="auctionFormData.minimumAuctioneers"
                        type="number"
                        min="1"
                        class="shadow appearance-none border rounded !w-[100px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="duration"
                        placeholder="" />
                      <div class="block text-gray-700 text-sm font-bold">người</div>
                    </div>
                    <ErrorMessage :text="manualAuctionErrorState.minimumAuctioneers" />
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <button
                    @click="closeModal()"
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button">
                    Hủy
                  </button>
                  <button
                    v-if="canReup"
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
