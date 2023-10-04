<script setup>
import { onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { base64Image } from '@/utils/imageFile'
import brandService from '@/services/brand.service'
import categoryService from '@/services/category.service'
import productSerivice from '@/services/product.service'

const emit = defineEmits(['createSuccess', 'createError'])

const categories = ref([])
const brands = ref([])

const imgSrc = ref([])
const imgData = ref([])

const formData = ref({
  name: '',
  description: '',
  weight: '',
  brandId: '',
  categoryId: '',
})

const onSubmit = () => {
  const form = new FormData()

  const addProductRequest = {
    name: formData.value.name,
    description: formData.value.description,
    weight: formData.value.weight,
    brandId: formData.value.brandId,
    categoryId: formData.value.categoryId
  }

  for(const imageData of imgData.value){
    form.append("images", imageData)
  }
  form.append("addProductRequest", new Blob([JSON.stringify(addProductRequest)], {type: 'application/json'}))

  productSerivice.addProductToInventory(form)
    .then(_ => {
      emit('createSuccess')
    })
    .catch(error => {
      if(error.response.data.message.includes('Validation')){
        emit('createError', 'Kiểm tra lại thông tin của bạn')
      } else if(error.response.data.message.includes('citizen card')){
        emit('createError', 'Bạn phải xác thực căn cước công dân trước khi đăng sản phẩm')
      }
      emit('createError')
    })
}

const handleFileUpload = async (e) => {
  imgData.value.push(e.target.files[0])
  imgSrc.value.push(await base64Image(e.target.files[0]))
}

onMounted(async () => {
  const brandsData = await brandService.getAllBrands()
  const categoriesData = await categoryService.getAllCategories()
  brands.value = brandsData.data.filter(d => d.status === "ACTIVE")
  categories.value = categoriesData.data.filter(d => d.status === "ACTIVE")
})

</script>
<template>
    <form class="bg-white rounded px-8 pb-8 mb-4">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
          Tên Sản Phẩm
        </label>
        <input v-model="formData.name"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="title" type="text" placeholder="Nhập tên sản phẩm">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
          Mô tả
        </label>
        <textarea v-model="formData.description"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description" rows="4" placeholder="Nhập mô tả"></textarea>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="weight">
          Trọng lượng (gram)
        </label>
        <input v-model="formData.weight"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="weight" type="text" placeholder="Nhập trọng lượng">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="brand">
          Thương hiệu sản phẩm
        </label>
        <select v-model="formData.brandId"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="brand">
          <option value="" disabled selected>Chọn thương hiệu</option>
          <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="category">
          Loại sản phẩm
        </label>
        <select v-model="formData.categoryId"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="category">
          <option value="" disabled selected>Chọn loại</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </div>
      <div class="mb-4 w-full overflow-x-auto" v-if="imgSrc.length > 0">
        <div v-for="src in imgSrc" :key="src" class="inline-block mr-2">
          <img :src="src" alt="product image" class="w-40 h-40 border-4 border-blue-500" />
        </div>
      </div>
      <div class="mb-4">
        <button @click="() => $refs.file.click()" @click.prevent
          class="flex items-center bg-white hover:!bg-gray-200 gap-3 w-[180px] justify-center text-gray-800 mt-3 px-4 py-2 rounded text-sm border-[1px] border-blue-500">
          <Icon icon="tdesign:upload" />
          <span>Upload image</span>
        </button>
        <input type="file" hidden v-on:change="handleFileUpload($event)" ref="file" />
      </div>
      <div class="flex items-center justify-between">
        <button @click.prevent @click="() => onSubmit()"
          class="bg-blue-600 hover:bg-blue-800 w-[180px] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button">
          Tạo sản phẩm
        </button>
      </div>
    </form>
</template>
