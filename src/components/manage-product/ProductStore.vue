<script setup>
import CreateNewProduct from '@/components/manage-product/CreateNewProduct.vue'
import ProductInfoModal from '@/components/manage-product/ProductInfoModal.vue'
import ItemBoxManageVue from '@/components/common-components/item-box/ItemBoxManage.vue'
import Modal from '@/components/common-components/Modal.vue'
import SearchInput from '@/components/common-components/SearchInput.vue'
import productSerivice from '@/services/product.service'
import { onMounted, ref, watch, computed } from 'vue'
import toastOption from '../../utils/toast-option'
import { noImage } from '../../common/urlConstant'
import { useUserStore } from '@/stores/user.store'
import { ProductStatus } from '@/common/contract'
import Dropdown from '../common-components/Dropdown.vue'
import imageHelper from '@/utils/image-helper'
import Loading from '../common-components/Loading.vue'
import userService from '@/services/user.service'

const itemsPerPage = 9
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

const onCreateError = (toastId, detail) => {
  if (detail) {
    toastOption.updateLoadingToast(toastId, detail, true)
  } else {
    toastOption.updateLoadingToast(toastId, 'Có lỗi khi tạo mới sản phẩm', true)
  }
}
const onSendSuccess = toastId => {
  toastOption.updateLoadingToast(toastId, 'Gửi yêu cầu cho sản phẩm lên sàn đấu giá thành công')
  fetchProducts()
}

const onSendError = (toastId, detail) => {
  if (detail) {
    toastOption.updateLoadingToast(toastId, detail, true)
  } else {
    toastOption.updateLoadingToast(toastId, 'Có lỗi khi gửi yêu cầu cho sản phẩm lên sàn đấu giá', true)
  }
}

const showDetail = product => {
  productDetail.value = product
  isModalVisible.value = true
  typeofModal.value = allowedModalTypes.info
}

const showCreate = async () => {
  if(! await userService.isAllRequiredInformationFilled(userStore.getRoleAndGetFromLocalStorageIfNotExist())){
    toastOption.toastError("Bạn phải hoàn thiện thông tin cá nhân [Thông tin tài khoản ngân hàng, địa ch] trước khi đấu giá, để tiện cho quá trình đổi trả, tố cáo.")
    return
  }
  isModalVisible.value = true
  typeofModal.value = allowedModalTypes.create
}

function closeModal() {
  isModalVisible.value = false
}

function handleConfirm() {
  closeModal()
}

const fetchProducts = async () => {
  isLoading.value = true
  const data = await productSerivice.getProducts()
  productsOrigin.value = data.data ? data.data.sort((a, b) => {
    return new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
  }) : []
  filterProduct()
  isLoading.value = false
}
watch(searchQuery, () => {
  currentPage.value = 1
})
onMounted(async () => {
  options.value = filterOptions()
  await fetchProducts()
})
</script>
<template>
  <div class="container my-[20px] py-2 mx-auto bg-white rounded-md">
    <div class="mb-4 flex items-center mr-5 ml-5 mt-10">
      <Dropdown v-model="selected" :data="options" class="!w-[200px]" />
      <div class="w-full ml-2">
        <!-- <SearchInput placeholder="       Tìm kiếm sản phẩm" addOnInputClass="w-full" /> -->
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </a>
          <button class="text-white font-semibold text-lg group-hover:text-white group-hover:smooth-hover text-center">
            TẠO MỚI
          </button>
        </div>
      </div>

      <ItemBoxManageVue
        v-for="product in paginatedProducts"
        :key="product.id"
        @click="showDetail(product)"
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

  <div>
    <Modal
      :hidden="!isModalVisible"
      :widthClass="'w-[900px]'"
      :hasOverFlowVertical="true"
      :hasButton="false"
      :title="typeofModal === allowedModalTypes.info ? 'Thông tin' : 'Tạo mới'"
      @decline-modal="closeModal"
      @confirm-modal="handleConfirm">
      <div :hidden="!(typeofModal === allowedModalTypes.info)">
        <ProductInfoModal
          :product="productDetail"
          @send-success="onSendSuccess"
          @send-error="onSendError"
          @just-submitted="closeModal" />
      </div>
      <div :hidden="!(typeofModal === allowedModalTypes.create)">
        <CreateNewProduct
          @create-success="onCreateSuccess"
          @create-error="onCreateError"
          @just-submitted="closeModal" />
      </div>
    </Modal>
  </div>
</template>
