<script setup>
import CreateNewProduct from '@/components/manage-product/CreateNewProduct.vue'
import ProductInfoModal from '@/components/manage-product/ProductInfoModal.vue'
import ItemBoxManageVue from '@/components/common-components/item-box/ItemBoxManage.vue'
import Modal from '@/components/common-components/Modal.vue'
import productSerivice from '@/services/product.service'
import { onMounted, ref, watch, computed } from 'vue'
import toastOption from '../../utils/toast-option'
import { useUserStore } from '@/stores/user.store'
import { ProductStatus } from '@/common/contract'
import Dropdown from '../common-components/Dropdown.vue'
import imageHelper from '@/utils/image-helper'
import Loading from '../common-components/Loading.vue'
import userService from '@/services/user.service'
import SellerSideBarLayout from '@/layouts/SellerSideBarLayout.vue'
import { sellerTabs } from '@/common/constant'
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import ErrorMessage from '../common-components/ErrorMessage.vue'
import ListEditableImage from '../ListEditableImage.vue'
import brandService from '@/services/brand.service'
import categoryService from '@/services/category.service'
import { Icon } from '@iconify/vue'
import { DUMP_IMG_FILE_DATA } from '@/common/commonStaticState'
import { base64Image } from '@/utils/imageFile'

const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Kho hàng',
    to: '/manage/product-inventory',
    disabled: true,
  },
]

const itemsPerPage = 11
const searchQuery = ref('')
const isLoading = ref(false)
const currentPage = ref(1)
const options = ref([])
const filterOptions = () => {
  const arr = [
    {
      label: 'TẤT CẢ',
      value: '',
    },
  ]
  for (const props in ProductStatus) {
    arr.push(ProductStatus[props])
  }
  return arr
}
const selected = ref({
  label: 'TẤT CẢ',
  value: '',
})
watch(selected, newVal => {
  filterProduct()
})

const filterProduct = () => {
  if (!selected.value.value) {
    products.value = JSON.parse(JSON.stringify(productsOrigin.value))
    return
  }
  products.value = productsOrigin.value.filter(p => p.status === selected.value.value)
}
// Computed property for total pages
const totalPages = computed(() => {
  return Math.ceil(
    products.value.filter(product => product.name.toLowerCase().includes(searchQuery.value.toLowerCase())).length /
      itemsPerPage,
  )
})

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
const paginatedProducts = computed(() => {
  // Move startIndex and endIndex calculation here
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return products.value
    .filter(product => product.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .slice(startIndex, endIndex)
})
const userStore = useUserStore()

const allowedModalTypes = { info: 'info', create: 'create' }
const isModalVisible = ref(false)
const typeofModal = ref('info')

const products = ref([])
const productsOrigin = ref([])
const productDetail = ref(null)

const onCreateSuccess = toastId => {
  toastOption.updateLoadingToast(toastId, 'Tạo mới sản phẩm vào kho thành công', false)
  fetchProducts()
}

const onCreateError = (toastId, detail, message) => {
  if (detail) {
    toastOption.updateLoadingToast(toastId, detail, true)
  } else {
    toastOption.updateLoadingToast(toastId, message, true)
  }
}
const onSendSuccess = toastId => {
  toastOption.updateLoadingToast(toastId, 'Gửi yêu cầu cho sản phẩm lên sàn đấu giá thành công')
  fetchProducts()
}

const onSendError = (toastId, error) => {
  console.log(error)
  toastOption.updateLoadingToast(toastId, error.response.data.message, true)
}

const showDetail = product => {
  productDetail.value = product
  isModalVisible.value = true
  typeofModal.value = allowedModalTypes.info
}

const showCreate = async () => {
  if(! await userService.isAllRequiredInformationFilled(userStore.getRoleAndGetFromLocalStorageIfNotExist())){
    toastOption.toastError("Bạn phải hoàn thiện thông tin cá nhân [Thông tin tài khoản ngân hàng, địa chỉ] trước khi đấu giá, để tiện cho quá trình đổi trả, tố cáo.")
    return
  }
  isModalVisible.value = true
  typeofModal.value = allowedModalTypes.create
}

function closeModal() {
  isModalVisible.value = false
  typeofModal.value = allowedModalTypes.info
}

function handleConfirm() {
  closeModal()
}

const fetchProducts = async () => {
  isLoading.value = true
  const data = await productSerivice.getProducts()
  productsOrigin.value = data.data
    ? data.data.sort((a, b) => {
        return new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
      })
    : []
  filterProduct()
  isLoading.value = false
}

const isModalEditOpen = ref(false)
const isModalDeleteConfirmOpen = ref(false)

const cancelEdit = () => {
  isModalEditOpen.value = false
}

const showDelete = (product) => {
  productDetail.value = product
  isModalDeleteConfirmOpen.value = true
}
const cancelDelete = () => {
  isModalDeleteConfirmOpen.value = false
}
const onDeleteConfirm = () => {
  productSerivice.deleteProduct(productDetail.value.id)
    .then(_ => {
      toastOption.toastSuccess("Xóa sản phẩm thành công")
    })
    .catch(_ => {
      toastOption.toastError("Xóa sản phẩm thất bại")
    })
    .finally(() => {
      cancelDelete()
      fetchProducts()
    })
}

// UPDATE
const productFormData = ref({
  name: '',
  description: '',
  weight: '',
  brand: '',
  category: '',
})
const manualAuctionErrorState = ref({
  productName: '',
  description: '',
  weight: '',
  brandId: '',
  categoryId: '',
  image: '',
})
const imgSrc = ref([])
const imgData = ref([])
const convertedImages = ref([])
const originalImages = ref([])

const categories = ref([])
const brands = ref([])

const handleFileUpload = async e => {
  imgData.value.push(e.target.files[0])
  imgSrc.value.push(await base64Image(e.target.files[0]))
}

const handleImageDeleted = indx => {
  imgSrc.value.splice(indx, 1)
  imgData.value.splice(indx, 1)
}

const clearDataState = () => {
  productFormData.value = {
    name: '',
    description: '',
    weight: '',
    brand: '',
    category: '',
  }

  originalImages.value = []
  imgSrc.value = []
  imgData.value = []
}

const setDataStateBaseOnDetail = detail => {
  productFormData.value = {
    name: detail.name,
    description: detail.description,
    weight: detail.weight,
    brand: {
      id: detail.brand.id,
      name: detail.brand.name,
    },
    category: {
      id: detail.category.id,
      name: detail.category.name,
    },
  }

  originalImages.value = [...detail.imageUrls]

  imgSrc.value = [...detail.imageUrls]
  imgData.value = detail.imageUrls.map(url => DUMP_IMG_FILE_DATA)
}
const openEditProductModal = product => {
  setDataStateBaseOnDetail(product)

  productDetail.value = product // Set the selected brand data
  isModalEditOpen.value = true // Show the modal

  convertedImages.value =
    productDetail.value.imageUrls.map(url => ({
      src: url,
      alt: 'Image Alt Text', // You can set the alt text as per your requirements
    })) || []
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
const onSubmit = () => {
  resetErrorState()
  if (!validateManual()) {
    return
  } else if(confirm("Bạn có chắc chắn muốn cập nhật sản phẩm không?")) {
    cancelEdit()

    const toastId = toastOption.toastLoadingMessage('Đang cập nhật sản phẩm')
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
    
    productSerivice.updateProductById(
      productDetail.value.id,
      imageUrlIgnored,
      newImages,
      updateProductRequest,
    )
      .then(_ => {
        toastOption.updateLoadingToast(toastId, 'Cập nhật sản phẩm thành công', false)
      })
      .catch(_ => {
        toastOption.updateLoadingToast(toastId, 'Có lỗi xảy ra vui lòng thử lại', true)
      })
      .finally(() => {
        clearDataState()
        fetchProducts()
      })
  }
}

// END UPDATE


watch(searchQuery, () => {
  currentPage.value = 1
})

onMounted(async () => {
  const brandsData = await brandService.getAllBrands()
  const categoriesData = await categoryService.getAllCategories()
  brands.value = brandsData.data.filter(d => d.status === 'ACTIVE')
  categories.value = categoriesData.data.filter(d => d.status === 'ACTIVE')
  options.value = filterOptions()
  await fetchProducts()
})
</script>
<template>
  <div class="w-full">
    <div class="pt-2 pb-2 container mx-auto">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
    <SellerSideBarLayout :cur-tab="sellerTabs.productRepository.value">
      <div class="container py-2 mx-auto bg-white rounded-md">
        <div class="mb-4 flex items-center mr-5 ml-5 mt-10">
          <Dropdown v-model="selected" :data="options" class="!w-[400px]" />
          <div class="w-full ml-2">
            <input
              v-model="searchQuery"
              type="text"
              id="simple-search"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Tìm kiếm sản phẩm theo tên"
              required="" />
          </div>
        </div>
        <Loading v-if="isLoading" />
        <div v-else class="flex flex-wrap items-center mt-10">
          <div
            @click="showCreate()"
            @click.prevent
            class="group tt-product thumbprod-center rounded-xl hover:scale-105 duration-200 ml-10 mb-10">
            <div
              class="group bg-gray-900/30 py-[5.2rem] px-20 flex flex-col space-y-4 items-center cursor-pointer rounded-md hover:bg-gray-900/40 hover:smooth-hover">
              <a
                class="bg-gray-900/70 text-white/50 group-hover:text-white group-hover:smooth-hover flex w-20 h-20 rounded-full items-center justify-center"
                href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </a>
              <button
                class="text-white font-semibold text-lg group-hover:text-white group-hover:smooth-hover text-center">
                TẠO MỚI
              </button>
            </div>
          </div>
          <ItemBoxManageVue
            v-for="product in paginatedProducts"
            :key="product.id"
            @click="showDetail(product)"
            @update="openEditProductModal(product)"
            @delete="showDelete(product)"
            class="ml-10 mb-10"
            :product-name="product.name"
            :status="product.status"
            :mainImage="imageHelper.getPrimaryImageFromList(product.imageUrls)"
            :secondaryImage="imageHelper.getSecondaryImageFromList(product.imageUrls)" />
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
    </SellerSideBarLayout>
    <div>
      <ProductInfoModal
        :hidden="!isModalVisible || !(typeofModal === allowedModalTypes.info)"
        :product="productDetail"
        @send-success="onSendSuccess"
        @send-error="onSendError"
        @just-submitted="closeModal" />
      <CreateNewProduct
        :hidden="!isModalVisible || !(typeofModal === allowedModalTypes.create)"
        @create-success="onCreateSuccess"
        @create-error="onCreateError"
        @just-submitted="closeModal"
      />
      <Modal
        v-if="isModalDeleteConfirmOpen"
        widthClass="w-[900px]"
        :hasOverFlowVertical="true"
        :hasButton="true"
        button-label="Xác nhận"
        @decline-modal="cancelDelete()"
        @confirm-modal="onDeleteConfirm()"
        title="Xác nhận xóa sản phẩm">
        <div class="text-xl font-semibold text-red-500">Bạn có chắc chắn muốn xóa sản phẩm này không?</div>
      </Modal>
      <Modal
        v-if="isModalEditOpen"
        title="Cập nhật sản phẩm"
        :widthClass="'w-[50vw]'"
        :hasOverFlowVertical="true"
        :hasButton="false"
        @decline-modal="cancelEdit"
        @confirm-modal="cancelEdit">
        <div>
          <div class="bg-white rounded-lg">
            <!-- Form Tab -->
            <div>
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
                <div class="flex items-center gap-3">
                  <button
                    @click="cancelEdit()"
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
    </div>
  </div>
</template>