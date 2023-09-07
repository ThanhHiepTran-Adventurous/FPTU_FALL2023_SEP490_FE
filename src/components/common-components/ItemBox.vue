<script setup>
    import currencyFormat from '@/utils/currency-formatter.js'
    const props = defineProps({
        mainImage : {
            type: String,
            default: "https://images.unsplash.com/photo-1619086303291-0ef7699e4b31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFzaGlvbiUyMG1vZGVsfGVufDB8fDB8fHww&w=1000&q=80"
        },
        secondaryImage : {
            type: String,
            default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKBMDCwElNqXzxgqg6K-hkKoNWECLd2iKnaflZivfgPntwaTCe_hAl7xmQH1zeOIZfIX8&usqp=CAU"
        },
        brand : {
            type: String,
            default: "BRAND"
        },
        productName : {
            type: String,
            default: "Name product"
        },
        floorPrice : {
            type: Number,
            default: 100000
        },
        relativeTime : {
            type: String,
            default: "02d 02h 15m"
        }
    })
</script>
<template>
    <div class="tt-product thumbprod-center rounded-xl hover:scale-105 duration-200">
        <div class="tt-image-box">
            <a href="#" class="tt-btn-quickview" data-toggle="modal" data-target="#ModalquickView" data-tooltip="Quick View"
                data-tposition="left"></a>
            <a href="#" class="tt-btn-wishlist" data-tooltip="Add to Wishlist" data-tposition="left"></a>
            <a class="block w-[220px] h-[250px] overflow-hidden" href="product.html">
                <span class="tt-img"><img :src="props.mainImage" :data-src="props.mainImage" alt=""></span>
                <span class="tt-img-roll-over">
                    <img :src="props.secondaryImage" :data-src="props.secondaryImage" alt="">
                </span>
            </a>
        </div>
        <div class="tt-description flex flex-col items-center">
            <div class="flex items-center justify-between w-full px-2">
                <div class="font-semibold text-[16px] text-left">
                    <span class="text-xs font-semibold bg-gray-100 text-gray-800  px-2 py-0.5 rounded flex items-center justify-center">
                        {{ props.brand }}
                    </span>
                </div>
                <div class="">
                        <div class="text-xs font-semibold bg-blue-50 text-blue-800 px-2 py-0.5 rounded flex items-center justify-center">
                            {{ props.relativeTime }}
                        </div>
                </div>
            </div>
            <div class="w-[210px] text-left text-gray-800 my-2.5 pl-1 font-semibold text-[16px] truncate">
                {{ props.productName }}
            </div>
            <div class="flex justify-between px-2 pb-2 w-full">
                <div class="">
                    <div class="text-left text-xs">Current</div>
                    <div class="font-semibold text-lg text-blue-700 text-left">{{ currencyFormat(props.floorPrice) }}</div>
                </div>
                <div class="">
                    <div class="text-right text-xs italic">Sold</div>
                    <div class="text-right font-semibold text-lg text-red-700 italic">{{ currencyFormat(150000) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>