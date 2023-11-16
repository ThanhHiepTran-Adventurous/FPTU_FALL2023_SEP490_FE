<script setup>
import formatCurrency from '@/utils/currency-output-formatter'
import AuctionType from '../badge/AuctionType.vue'
import { AuctionModelType, StatusShipRequest } from '@/common/contract'
import { Icon } from '@iconify/vue'
import ShippingStatusIntermediate from '@/components/ShippingStatusIntermediate.vue';

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
  price: {
    type: Number,
    required: true,
  },
  auctionType: {
    type: String,
    default: AuctionModelType.immediate,
  },
  orderId: {
    type: String,
    required: true,
  },
  chatGroupId: {
    type: String,
    default: '',
  },
  createdAt: {
    type: String,
    required: true,
  },
  statusShipRequest: {
    type: String,
    default: '',
  },
  statusReturnRequest: {
    type: String,
    default: ''
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <div class="group tt-product thumbprod-center rounded-xl hover:scale-105 duration-200 !mb-3">
    <div class="tt-image-box">
      <router-link :to="`/messenger/${chatGroupId}`" v-if="!statusShipRequest">
        <Icon icon="et:chat" class="tt-btn-quickview !text-[14px] p-2" />
      </router-link>
      <a class="block w-[220px] h-[210px] overflow-hidden relative">
        <span class="tt-img absolute top-0 left-0">
          <img :src="props.mainImage" :data-src="props.mainImage" alt="" />
        </span>
        <span class="tt-img-roll-over absolute top-0 left-0">
          <img :src="props.secondaryImage" :data-src="props.secondaryImage" alt="" />
        </span>
      </a>
      <div v-if="statusReturnRequest" class="absolute top-0 right-0 mt-1">
        <ShippingStatusIntermediate :status="statusReturnRequest" />
      </div>
      <div v-if="!!isCompleted" class="absolute top-0 left-2 mt-2">
        <Icon icon="clarity:success-standard-solid" class="text-green-500 text-[26px]" />
      </div>
    </div>
    <div class="tt-description flex flex-col items-center">
      <div class="w-full flex justify-start ml-3">
        <AuctionType :type="props.auctionType" v-if="!statusShipRequest" />
        <ShippingStatusIntermediate v-else :status="statusShipRequest" />
      </div>
      <div class="w-[210px] text-left text-blue-700 mt-1 mb-1.5 pl-1 font-semibold text-lg truncate">
        {{ props.productName }}
      </div>
      <div class="flex row justify-between items-center w-full">
        <div class="pb-2 ml-2">
          <span
            class="bg-white border-[1px] shadow text-green-600 text-md font-medium font-semibold mr-2 px-2.5 py-0.5 rounded">
            {{ formatCurrency(props.price) }}
          </span>
        </div>
      </div>
      <div class="w-full flex justify-start ml-3">Lúc: {{ createdAt }}</div>
    </div>
  </div>
</template>
