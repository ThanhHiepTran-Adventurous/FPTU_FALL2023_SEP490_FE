<script setup>
import imageHelper from "@/utils/image-helper";
import { computed } from "vue";

    const props = defineProps({
        images: Array,
    });

    const firstImage = computed(() => imageHelper.getPrimaryImageFromList(props.images))

</script>

<template>
  <div class="tt-product-vertical-layout">
    <div class="w-full">
      <div>
        <button class="tt-btn-zomm tt-top-right"><i class="icon-f-86"></i></button>
        <img class="zoom-product w-full max-h-[400px]" :src="firstImage" alt="main-image">
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