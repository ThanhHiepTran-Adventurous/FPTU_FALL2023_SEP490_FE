<script setup>
import currencyFormat from '@/utils/currency-output-formatter.js'
import CountDown from '@/components/common-components/Countdown.vue'
import { computed } from 'vue'
import { AuctionModelType } from '@/common/contract'
import AuctionType from '../badge/AuctionType.vue'

const props = defineProps({
  mainImage: {
    type: String,
    default:
      'https://images.unsplash.com/photo-1619086303291-0ef7699e4b31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFzaGlvbiUyMG1vZGVsfGVufDB8fDB8fHww&w=1000&q=80',
  },
  secondaryImage: {
    type: String,
    default:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKBMDCwElNqXzxgqg6K-hkKoNWECLd2iKnaflZivfgPntwaTCe_hAl7xmQH1zeOIZfIX8&usqp=CAU',
  },
  productName: {
    type: String,
    default: 'Name product',
  },
  floorPrice: {
    type: Number,
    default: 3000000,
  },
  timeRemain: {
    type: Number,
    required: true,
  },
  itemId: {
    type: String,
    default: '',
  },
  auctionType: {
    type: String,
    default: AuctionModelType.immediate,
  },
})

const timeDeadline = computed(() => {
  if (props.timeRemain) {
    return new Date().getTime() + props.timeRemain
  }
  return new Date().getTime()
})
</script>
<template>
  <router-link :to="`/auctions/${props.itemId}`"
    ><div class="group tt-product thumbprod-center rounded-xl hover:scale-105 duration-200">
      <div
        class="w-[220px] text-center text-black font-semibold mt-1 mb-1.5 pl-1 text-lg truncate text-ellipsis overflow-hidden">
        {{ props.productName }}
      </div>
      <div class="tt-image-box">
        <a
          href="#"
          class="tt-btn-quickview"
          data-toggle="modal"
          data-target="#ModalquickView"
          data-tooltip="Quick View"
          data-tposition="left"></a>
        <a href="#" class="tt-btn-wishlist" data-tooltip="Add to Wishlist" data-tposition="left"></a>
        <a class="block w-[220px] h-[210px] overflow-hidden" href="product.html">
          <span class="tt-img"><img :src="props.mainImage" :data-src="props.mainImage" alt="" /></span>
          <span class="tt-img-roll-over">
            <img :src="props.secondaryImage" :data-src="props.secondaryImage" alt="" />
          </span>
        </a>
      </div>
      <div class="tt-description flex flex-col items-center">
        <div class="block group-hover:block bg-gray-200 bg-opacity-75 absolute top-[-60px] rounded-md pt-1.5">
          <CountDown :coefficientSize="0.4" :deadlineInMilis="timeDeadline" />
        </div>
        <div class="flex justify-center px-2 w-full">
          <div class="items-center pb-2">
            <div class="items-center font-semibold text-xl ml-1 text-blue-600">
              {{ currencyFormat(props.floorPrice) }}
            </div>
            <div class="items-center text-md">Giá hiện tại</div>
          </div>
        </div>

        <div class="w-full flex items-center justify-center ml-3">
          <AuctionType :type="auctionType" />
        </div>
      </div></div
  ></router-link>
</template>
