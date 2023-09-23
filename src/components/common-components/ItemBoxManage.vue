<script setup>
import currencyFormat from '@/utils/currency-formatter.js'
import Countdown from '@/components/common-components/Countdown.vue';
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
    floorPrice: {
        type: Number,
        default: 3000000
    },
    closePrice: {
        type: Number,
        default: 7000000
    },
    relativeTime: {
        type: String,
        default: "00d 00h 00m"
    },
    status: {
        type: String,
        default: "SOLD",
        validator: (value) => {
            return ["SOLD", "UNDERWAY", "UPCOMING", "VERIFIED", "REJECT"].includes(value);
        }
    }

})


</script>
<template>
    <div class="group tt-product thumbprod-center rounded-xl hover:scale-105 duration-200">
        <div class="tt-image-box">
            <a class="tt-btn-quickview" data-toggle="modal" data-target="#ModalquickView" data-tooltip="Quick View"
                data-tposition="left">
                
            </a>
            <a class="tt-btn-wishlist" data-tooltip="Add to Wishlist" data-tposition="left"></a>
            <a class="block w-[220px] h-[250px] overflow-hidden">
                <span class="tt-img"><img :src="props.mainImage" :data-src="props.mainImage" alt=""></span>
                <span class="tt-img-roll-over">
                    <img :src="props.secondaryImage" :data-src="props.secondaryImage" alt="">
                </span>
            </a>
        </div>
        <div class="tt-description flex flex-col items-center">
            <div class="block group-hover:block bg-gray-200 bg-opacity-75 absolute top-[-60px] rounded-md pt-1.5">
                <CountDown :coefficientSize="0.4" :deadlineInMilis="1697094493940" />
            </div>
            <div class="w-[210px] text-left text-blue-700 mt-1 mb-1.5 pl-1 font-semibold text-lg truncate">
                {{ props.productName }}
            </div>
            <div class="flex row justify-between px-2 w-full">
                <div class="items-center pb-2">
                    <div class="text-left text-[16px]">Giá: </div>
                    <div class="font-semibold text-lg ml-1 text-blue-700 text-left">{{ currencyFormat(props.floorPrice) }}</div>
                </div>
                 <div class="items-center pb-2">
                    <div class="text-left text-[16px]">Trạng thái: </div>
                    <div class="font-semibold text-lg ml-1 text-blue-700 text-left">{{ props.status }}</div>
                </div>
            </div>
        </div>
    </div>
</template>