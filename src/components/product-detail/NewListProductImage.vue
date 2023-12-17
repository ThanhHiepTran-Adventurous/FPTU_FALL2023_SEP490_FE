<script setup>
import { ref, watch } from 'vue'
import { Carousel } from 'ant-design-vue'

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
</script>

<template>
    <div class="w-full h-full">
        <Carousel autoplay>
            <img v-for="image in imgComputed" :key="image" :src="image.src" alt="product-image" class=""/>
        </Carousel>
    </div>
</template>

<style scoped>
/* For demo */
:deep(.slick-slide) {
  text-align: center;
  height: 100%;
  width: 100%;
  background: #364d79;
  overflow: hidden;
}
:deep(.slick-slide h3) {
  color: #fff;
}
</style>