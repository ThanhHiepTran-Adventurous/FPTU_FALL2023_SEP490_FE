<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import brandService from '@/services/brand.service'

const brandImg = ref([])

const fetchBrandsData = async () => {
  const brands = await brandService.getAllBrandsGuest()

  const activeBrands = brands.data.filter(d => d.status === 'ACTIVE')

  brandImg.value = activeBrands.map(d => {
    return {
      label: d.name,
      value: d.imageUrl,
    }
  })
}
onMounted(async () => {
  fetchBrandsData()
})
</script>
<template>
  <div class="bg-white py-2">
    <div class="container my-[20px] mx-auto">
      <div class="tt-block-title">
        <h1 class="text-3xl uppercase text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          <span class="font-extrabold">Popular</span>
          Brands
        </h1>
      </div>
      <div class="row flex justify-center items-center tt-layout-promo-box gap-2">
        <div v-for="(brand, index) in brandImg" :key="index" class="">
          <img :src="brand.value" :alt="brand.label" class="loaded w-32 h-32" data-was-processed="true" />
        </div>
      </div>
    </div>
  </div>
</template>
