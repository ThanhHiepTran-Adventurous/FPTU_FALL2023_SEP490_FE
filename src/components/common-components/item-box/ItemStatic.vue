<script setup>
import { parseMillisecondsIntoReadableTime } from '@/utils/millis-to-duration';
import formatCurrency from '@/utils/currency-output-formatter';

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
    timeRemain : {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
})


</script>
<template>
    <div class="group tt-product thumbprod-center rounded-xl hover:scale-105 duration-200 !mb-3">
        <div class="tt-image-box">
            <a class="tt-btn-quickview" data-toggle="modal" data-target="#ModalquickView" data-tooltip="Quick View"
                data-tposition="left">
            </a>
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
            <div class="flex row justify-between items-center w-full">
                <div class="pb-2 ml-2">
                    <span class="bg-white border-[1px] shadow text-green-600 text-md font-medium font-semibold mr-2 px-2.5 py-0.5 rounded">
                        {{ formatCurrency(props.price) }}
                    </span>
                </div>
                <div v-if="props.timeRemain" class="pb-2">
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium font-semibold mr-2 px-2.5 py-0.5 rounded">
                        {{ parseMillisecondsIntoReadableTime(props.timeRemain) }}
                    </span>
                </div>
                <div v-else>
                    <span class="bg-red-100 text-red-800 text-xs font-medium font-semibold mr-2 px-2.5 py-0.5 rounded">
                        {{ `Kết thúc` }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>