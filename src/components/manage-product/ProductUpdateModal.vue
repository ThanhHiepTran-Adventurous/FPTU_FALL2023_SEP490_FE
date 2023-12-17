<script setup>
import Modal from '@/components/common-components/Modal.vue'
import Button from '@/components/common-components/Button.vue'
import ProductSerivice from '@/services/product.service'
import { onMounted, ref, computed, watch } from 'vue'
import { Carousel } from 'flowbite-vue'
import brandService from '@/services/brand.service'
import categoryService from '@/services/category.service'
import { base64Image } from '@/utils/imageFile'
import { Icon } from '@iconify/vue'
import { initFlowbite } from 'flowbite'
import Dropdown from '@/components/common-components/Dropdown.vue'
import AuctionService from '@/services/auction.service'
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

const props = defineProps(['product'])
watch(() => props.product, (oldVal, newVal) => {
})

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

const fetchProducts = async () => {
  try {
    const response = await AuctionService.getAuctionBySeller('status:REJECTED')
    products.value = response.data ? response.data.filter(f => f.product.status === ProductStatus.REJECTED.value) : []
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

const handleFileUpload = async e => {
  imgData.value.push(e.target.files[0])
  imgSrc.value.push(await base64Image(e.target.files[0]))
}

const handleImageDeleted = indx => {
  imgSrc.value.splice(indx, 1)
  imgData.value.splice(indx, 1)
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
  <Modal
    title="Cập nhật sản phẩm"
    :widthClass="'w-[50vw]'"
    :hasOverFlowVertical="true"
    :hasButton="false"
    @decline-modal="closeModal"
    @confirm-modal="handleConfirm">
    <div>
      <div class="bg-white rounded-lg">
        <!-- Form Tab -->
        <div>
          <form class="bg-white rounded px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="title"> Tên Sản Phẩm {{ product.id }} </label>
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
            <div class="flex items-center gap-3">
              <button
                @click="closeModal()"
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button">
                Hủy
              </button>
              <button
                @click="onSubmit()"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button">
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Modal>
</template>
