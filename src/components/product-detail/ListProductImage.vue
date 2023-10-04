<script setup>
    const props = defineProps({
        images: Array,
    });

</script>

<template>
  <div class="tt-product-vertical-layout">
    <div class="w-full">
      <div>
        <button class="tt-btn-zomm tt-top-right"><i class="icon-f-86"></i></button>
        <img class="zoom-product w-full" :src="images[0]" :data-zoom-image="images[0]" alt="main-image">
      </div>
    </div>
    <div class="flex items-center justify-center">
      <ul class="flex items-center">
        <li v-for="(image, index) in images" :key="index">
          <a :data-image="image" :data-zoom-image="image">
            <img :src="image" alt="product" class="w-[80px]"> 
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
</style>