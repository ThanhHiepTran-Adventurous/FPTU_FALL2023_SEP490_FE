<script setup>
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { base64Image } from '@/utils/imageFile'
import brandService from '@/services/brand.service'
import categoryService from '@/services/category.service'
import productSerivice from '@/services/product.service'
import toastOption from '@/utils/toast-option'
import { HTTP_STATUS } from '@/common/httpStatus'
import * as yup from 'yup'
import { Field, Form } from 'vee-validate'
import ErrorMessage from '../common-components/ErrorMessage.vue'

import ListImage from '@/components/ListEditableImage.vue'

const emit = defineEmits(['createSuccess', 'createError', 'justSubmitted'])
const categories = ref([])
const brands = ref([])
const validate = ref(false)

// The order of imgSrc and imgData is the same, therefore we can use index to reference two respective item
const imgSrc = ref([])
const imgData = ref([])

const productSchema = yup.object().shape({
  name: yup.string().required('Tên sản phẩm không được để trống'),
  description: yup.string().required('Mô tả sản phẩm không được để trống'),
  weight: yup.number().required('Khối lượng sản phẩm không được để trống'),
  brandId: yup.string().required('Chọn thương hiệu sản phẩm'),
  categoryId: yup.string().required('Chọn danh mục sản phẩm'),
})
const formData = ref({
  name: '',
  description: '',
  weight: '',
  brandId: '',
  categoryId: '',
})
const manualAuctionErrorState = ref({
  name: '',
  description: '',
  weight: '',
  brand: '',
  category: '',
})
const resetErrorState = () => {
  manualAuctionErrorState.value = {
    name: '',
    description: '',
    weight: '',
    brand: '',
    category: '',
    image: '',
  }
}
const validateManual = () => {
  if (formData.value.name.trim() === '') {
    manualAuctionErrorState.value.name = 'Vui lòng nhập tên sản phẩm'
    return false
  }
  if (formData.value.description.trim() === '') {
    manualAuctionErrorState.value.description = 'Vui lòng nhập miêu tả'
    return false
  }
  if (!formData.value.weight) {
    manualAuctionErrorState.value.weight = 'Vui lòng nhập trọng lượng'
    return false
  }
  if (!formData.value.brandId) {
    console.log(formData.value.brandId)
    manualAuctionErrorState.value.brand = 'Vui lòng chọn thương hiệu sản phẩm'
    return false
  }
  if (!formData.value.categoryId) {
    manualAuctionErrorState.value.category = 'Vui lòng chọn loại sản phẩm'
    return false
  }
  if (imgSrc.value.length === 0) {
    manualAuctionErrorState.value.image = 'Vui lòng tải lên ít nhất một hình ảnh'
    return false
  }
  return true
}
const onSubmit = async () => {
  resetErrorState()
  if (!validateManual()) {
    return
  }
  const form = new FormData()

  const addProductRequest = {
    name: formData.value.name,
    description: formData.value.description,
    weight: formData.value.weight,
    brandId: formData.value.brandId,
    categoryId: formData.value.categoryId,
  }

  for (const imageData of imgData.value) {
    form.append('images', imageData)
  }
  form.append('addProductRequest', new Blob([JSON.stringify(addProductRequest)], { type: 'application/json' }))

  emit('justSubmitted')
  const toastId = toastOption.toastLoadingMessage('Đang thêm sản phẩm vào kho')

  productSerivice
    .addProductToInventory(form)
    .then(_ => {
      emit('createSuccess', toastId)
    })
    .catch(error => {
      if (error.response.status === HTTP_STATUS.INTERNAL_ERROR) {
        emit('createError', toastId)
        return
      }
      if (error.response.data.message.includes('Validation')) {
        emit('createError', toastId, 'Kiểm tra lại thông tin của bạn')
      } else if (error.response.data.message.includes('citizen card')) {
        emit('createError', toastId, 'Bạn phải xác thực căn cước công dân trước khi đăng sản phẩm')
      }
      emit('createError', toastId)
    })
    .finally(() => {
      resetFormData()
    })
}

const handleFileUpload = async e => {
  imgData.value.push(e.target.files[0])
  imgSrc.value.push(await base64Image(e.target.files[0]))
}

const handleImageDeleted = indx => {
  imgSrc.value.splice(indx, 1)
  imgData.value.splice(indx, 1)
}

onMounted(async () => {
  const brandsData = await brandService.getAllBrands()
  const categoriesData = await categoryService.getAllCategories()
  brands.value = brandsData.data.filter(d => d.status === 'ACTIVE')
  categories.value = categoriesData.data.filter(d => d.status === 'ACTIVE')
})

const resetFormData = () => {
  formData.value = {
    name: '',
    description: '',
    weight: '',
    brandId: '',
    categoryId: '',
  }
  imgSrc.value = []
  imgData.value = []
}
</script>
<template>
  <form class="bg-white rounded px-8 pb-8 mb-4" @submit.prevent="onSubmit()">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
        Tên Sản Phẩm <span class="text-red-500">*</span>
      </label>
      <input
        v-model="formData.name"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="title"
        type="text"
        placeholder="Nhập tên sản phẩm" />
      <ErrorMessage :text="manualAuctionErrorState.name" />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
        Mô tả <span class="text-red-500">*</span>
      </label>
      <textarea
        v-model="formData.description"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="description"
        rows="4"
        placeholder="Nhập mô tả"></textarea>
      <ErrorMessage :text="manualAuctionErrorState.description" />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="weight">
        Trọng lượng (gram) <span class="text-red-500">*</span>
      </label>
      <input
        v-model="formData.weight"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="weight"
        type="number"
        min="0"
        placeholder="Nhập trọng lượng" />
      <ErrorMessage :text="manualAuctionErrorState.weight" />
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="brand">
        Thương hiệu sản phẩm <span class="text-red-500">*</span>
      </label>
      <select
        v-model="formData.brandId"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="brand">
        <option value="" disabled selected>Chọn thương hiệu</option>
        <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
      </select>
      <ErrorMessage :text="manualAuctionErrorState.brand" />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="category">
        Loại sản phẩm <span class="text-red-500">*</span>
      </label>
      <select
        v-model="formData.categoryId"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="category">
        <option value="" disabled selected>Chọn loại</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select>
      <ErrorMessage :text="manualAuctionErrorState.category" />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="category">
        Hình ảnh <span class="text-red-500">*</span>
      </label>
      <ListImage v-if="imgSrc.length > 0" :img-src="imgSrc" @deleted="handleImageDeleted" />
      <button
        @click="() => $refs.file.click()"
        @click.prevent
        class="flex items-center bg-white hover:!bg-gray-200 gap-3 w-[180px] justify-center text-gray-800 mt-3 px-4 py-2 rounded text-sm border-[1px] border-blue-500">
        <Icon icon="tdesign:upload" />
        <span>Tải ảnh lên</span>
      </button>
      <input type="file" hidden v-on:change="handleFileUpload($event)" ref="file" />
      <ErrorMessage :text="manualAuctionErrorState.image" />
    </div>
    <div class="flex items-center justify-between">
      <button
        class="bg-blue-600 hover:bg-blue-800 w-[180px] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit">
        Tạo sản phẩm
      </button>
    </div>
  </form>
</template>
