<script setup>
import imageHelper from '@/utils/image-helper'
import { onMounted, ref, watch } from 'vue'
import { Carousel } from 'flowbite-vue'
import { initFlowbite } from 'flowbite'

const props = defineProps({
  images: Array,
})

//const firstImage = computed(() => imageHelper.getPrimaryImageFromList(props.images))

const imgComputed = ref([])
watch(
  () => props.images,
  () => {
    const data = props.images?.map(url => ({
      src: url,
      alt: 'Image Alt Text', // You can set the alt text as per your requirements
    }))
    imgComputed.value = data
  },
)

onMounted(() => {
  initFlowbite()
})
</script>

<template>
  <div>
    <div class="w-full">
      <div>
        <Carousel :pictures="imgComputed"></Carousel>
      </div>
    </div>
  </div>
</template>
