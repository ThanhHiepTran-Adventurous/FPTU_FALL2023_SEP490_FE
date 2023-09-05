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
    <div class="tt-product thumbprod-center">
        <div class="tt-image-box">
            <a href="#" class="tt-btn-quickview" data-toggle="modal" data-target="#ModalquickView" data-tooltip="Quick View"
                data-tposition="left"></a>
            <a href="#" class="tt-btn-wishlist" data-tooltip="Add to Wishlist" data-tposition="left"></a>
            <a class="block w-[200px] h-[250px] overflow-hidden" href="product.html">
                <span class="tt-img"><img :src="props.mainImage" :data-src="props.mainImage" alt=""></span>
                <span class="tt-img-roll-over">
                    <img :src="props.secondaryImage" :data-src="props.secondaryImage" alt="">
                </span>
            </a>
        </div>
        <div class="tt-description flex flex-col items-center">
            <div class="tt-row">
                <ul class="tt-add-info">
                    <li>{{ props.brand }}</li>
                </ul>
            </div>
            <div class="tt-title font-semibold w-36 truncate">{{ props.productName }}</div>
            <div class="flex justify-center">
                <div class="flex items-center gap-2">
                    <span class="">Floor:</span> <span class="font-semibold text-xl text-red-700">{{ currencyFormat(props.floorPrice) }}</span>
                </div>
            </div>
            <div class="tt-product-inside-hover">
                <div class="w-full">
                    <span class="text-xs font-semibold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded flex items-center justify-center px-2">
                        {{ props.relativeTime }}
                    </span>
                </div>
                <div class="tt-row-btn">
                    <a href="#" class="tt-btn-quickview" data-toggle="modal" data-target="#ModalquickView"></a>
                    <a href="#" class="tt-btn-wishlist"></a>
                </div>
            </div>
        </div>
    </div>
</template>