<script setup>
import ProductStatusBadge from '../badge/ProductStatusBadge.vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
    mainImage: {
        type: String,
        default: "https://images.unsplash.com/photo-1619086303291-0ef7699e4b31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFzaGlvbiUyMG1vZGVsfGVufDB8fDB8fHww&w=1000&q=80"
    },
    secondaryImage: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKBMDCwElNqXzxgqg6K-hkKoNWECLd2iKnaflZivfgPntwaTCe_hAl7xmQH1zeOIZfIX8&usqp=CAU"
    },
    brand: {
        type: String,
        default: "BRAND"
    },
    productName: {
        type: String,
        default: "Name product"
    },
    status: {
        type: String,
        default: "SOLD",
    }
})


</script>
<template>
    <div class="group tt-product thumbprod-center rounded-xl hover:scale-105 duration-200">
        <div class="tt-image-box">
            <Icon icon="ph:frame-corners-thin" class="tt-btn-quickview !text-[13px] p-2.5" />
            <a class="block w-[220px] h-[210px] overflow-hidden">
                <span class="tt-img"><img :src="props.mainImage" :data-src="props.mainImage" alt=""></span>
                <span class="tt-img-roll-over">
                    <img :src="props.secondaryImage" :data-src="props.secondaryImage" alt="">
                </span>
            </a>
        </div>
        <div class="tt-description flex flex-col items-center">
            <div class="w-[210px] text-left text-blue-700 mt-1 mb-1.5 pl-1 font-semibold text-lg truncate">
                {{ props.productName }}
            </div>
            <div class="flex row justify-end px-2 w-full">
                 <div class="items-center pb-2">
                    <ProductStatusBadge :status="props.status" />
                </div>
            </div>
        </div>
    </div>
</template>