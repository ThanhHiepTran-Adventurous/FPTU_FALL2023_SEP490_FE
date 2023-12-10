<script setup>
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
</script>
<template>
    <div class="bg-white my-2 relative">
        <Carousel>
            <Slide key="banner2">
                <div class="container">
                <img src="https://i.ibb.co/dKVJQfG/4324324324.png" alt="banner" class="w-[100%] h-[60vh]" />
                </div>
            </Slide>
            <Slide key="banner1">
                <div class="container">
                <img
                    src="https://i.ibb.co/2kVHKzN/370125377-764410905524764-4578443166790669082-n.png"
                    alt="banner"
                    class="w-[100%] h-[60vh]" />
                </div>
            </Slide>

            <template #addons>
                <Navigation />
            </template>
        </Carousel>
        <div class="absolute bottom-10 w-max bg-blue-100 p-4 mx-20 2xl:mx-96 bg-opacity-90 text-opacity-100 rounded">
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div class="text-xl leading-6 text-opacity-100 text-blue-700">
                    <strong class="font-semibold">Nền tảng đấu giá thời trang</strong><svg viewBox="0 0 2 2" class="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true"><circle cx="1" cy="1" r="1" /></svg>Đa dạng hình thức đấu giá, uy tín, chất lượng.
                </div>
                <a href="#" class="flex-none rounded-full bg-blue-700 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900">Đấu giá ngay <span aria-hidden="true">&rarr;</span></a>
            </div>
        </div>
    </div>
</template>
