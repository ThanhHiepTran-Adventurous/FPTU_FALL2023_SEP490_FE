<script setup>
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
</script>
<template>
    <div class="bg-white my-2">
        <Carousel>
            <Slide key="banner1">
                <div class="container">
                    <img src="https://salt.tikicdn.com/ts/brickv2og/c0/f4/20/333a4bf61378b404f0ca015332b85d12.png" alt="banner" class="w-full h-auto"/>
                </div>
            </Slide>
            <Slide key="banner2">
                <div class="container">
                    <img src="https://shopeeplus.com//upload/images/tiki-freeship.png" alt="banner" class="w-full h-auto"/>
                </div>
            </Slide>
            <Slide key="banner3">
                <div class="container">
                    <img src="https://thietkehaithanh.com/wp-content/uploads/2019/06/thietkehaithanh-banner-1-4.jpg" alt="banner" class="w-full h-auto"/>
                </div>
            </Slide>
            <template #addons>
                <Navigation />
            </template>
        </Carousel>
    </div>
</template>