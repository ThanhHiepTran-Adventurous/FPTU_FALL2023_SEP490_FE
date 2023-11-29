<script setup>
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
</script>
<template>
    <div class="bg-white my-2">
        <Carousel>
            <Slide key="banner1">
                <div class="container">
                <img
                    src="https://i.ibb.co/2kVHKzN/370125377-764410905524764-4578443166790669082-n.png"
                    alt="banner"
                    class="w-full h-auto" />
                </div>
            </Slide>
            <Slide key="banner2">
                <div class="container">
                <img src="https://i.ibb.co/dKVJQfG/4324324324.png" alt="banner" class="w-full h-auto" />
                </div>
            </Slide>

            <template #addons>
                <Navigation />
            </template>
        </Carousel>
    </div>
</template>