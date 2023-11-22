<template>
  <a-carousel arrows dots-class="slick-dots slick-thumb">
    <a slot="customPaging" slot-scope="props">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/bidbay-project.appspot.com/o/2fc26de3-1e6a-40fd-9e6c-e025e0cb5e3b.jpg?alt=media" />
    </a>
    <div v-for="item in imgComputed">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/bidbay-project.appspot.com/o/2fc26de3-1e6a-40fd-9e6c-e025e0cb5e3b.jpg?alt=media" />
    </div>
  </a-carousel>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
const props = defineProps({
  images: Array,
})
const imgComputed = ref([])
watch(
  () => props.images,
  () => {
    const data = props.images?.map(url => ({
      src: url,
      alt: 'Image Alt Text',
    }))
    imgComputed.value = data
  },
)
console.log(imgComputed.value)
const baseUrl =
  'https://raw.githubusercontent.com/vueComponent/ant-design-vue/master/components/vc-slick/assets/img/react-slick/'
</script>
<style scoped>
/* For demo */
:host-context(.ant-carousel) :deep(.slick-dots) {
  height: auto;
}
:host-context(.ant-carousel) :deep(.slick-slide img) {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
:host-context(.ant-carousel) :deep(.slick-thumb) {
  bottom: -45px;
}
:host-context(.ant-carousel) :deep(.slick-thumb li) {
  width: 60px;
  height: 45px;
}
:host-context(.ant-carousel) :deep(.slick-thumb li img) {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
:host-context(.ant-carousel) :deep(.slick-thumb li.slick-active img) {
  filter: grayscale(0%);
}
</style>
