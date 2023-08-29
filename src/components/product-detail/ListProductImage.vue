

<script setup>
    const props = defineProps({
        images: Array,
    });

</script>

<style>
</style>



<template>
  <div class="tt-product-vertical-layout">
    <div class="tt-product-single-img">
      <div>
        <button class="tt-btn-zomm tt-top-right"><i class="icon-f-86"></i></button>
        <img class="zoom-product" :src="images[0]" :data-zoom-image="images[0]" alt="">
      </div>
    </div>
    <div class="tt-product-single-carousel-vertical">
      <ul id="smallGallery" class="slick-animated-show-js-custom">
        <li v-for="(image, index) in images" :key="index">
          <a href="#" :data-image="image" :data-zoom-image="image">
            <img :src="image" alt=""> 
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.slick-animated-show-js-custom {
  opacity: 1;
  transition: opacity 0.2s linear;
}

</style>