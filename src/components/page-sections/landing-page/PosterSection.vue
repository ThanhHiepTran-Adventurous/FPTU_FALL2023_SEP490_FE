<script setup>
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
</script>
<template>
    <div class="bg-white my-2">
        <Carousel>
            <Slide key="banner1">
                <div class="container">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/75/No_image_available.png" alt="banner" class="w-full h-[50vh]"/>
                </div>
            </Slide>
            <Slide key="banner2">
                <div class="container">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/75/No_image_available.png" alt="banner" class="w-full h-[50vh]"/>
                </div>
            </Slide>
            <Slide key="banner3">
                <div class="container">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/75/No_image_available.png" alt="banner" class="w-full h-[50vh]"/>
                </div>
            </Slide>
            <template #addons>
                <Navigation />
            </template>
        </Carousel>
    </div>
</template>