<script setup>
import { onMounted, ref, watch } from 'vue'
import { parseMillisecondsIntoReadableTime } from '@/utils/millis-to-duration'
import formatCurrency from '@/utils/currency-output-formatter'
import AuctionType from '../badge/AuctionType.vue'
import { AuctionModelType } from '@/common/contract'
import { Icon } from '@iconify/vue'
import ShipRequestService from '@/services/shiprequest.service'

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
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  hasShipRequest: {
    type: Boolean,
    default: false,
  },
})
const shipStatus = ref('')

const getShipRequestByOrderId = async orderId => {
  try {
    const query = 'shipRequest_orderId:' + orderId
    const response = await ShipRequestService.getAllShipRequest(query)

    if (response?.data && response.data.length > 0) {
      const allCancelled = response.data.every(request => request.status === 'CANCELLED')
      if (!allCancelled) {
        const nonCancelledRequest = response.data.find(request => request.status !== 'CANCELLED')
        if (nonCancelledRequest) {
          shipStatus.value = nonCancelledRequest.status
        }
      } else {
        shipStatus.value = null
      }
    } else {
      shipStatus.value = null
    }
  } catch (error) {
    console.error('Error checking ship request:', error)
    shipStatus.value = null
  }
}

onMounted(() => {
  if (props.hasShipRequest === true) {
    getShipRequestByOrderId(props.orderId)
  }
})
</script>
<template>
  <div class="group tt-product thumbprod-center rounded-xl hover:scale-105 duration-200 !mb-3">
    <div class="tt-image-box">
      <router-link :to="`/messenger/${chatGroupId}`">
        <Icon icon="et:chat" class="tt-btn-quickview !text-[14px] p-2" />
      </router-link>
      <a class="block w-[220px] h-[210px] overflow-hidden relative">
        <span class="tt-img absolute top-0 left-0">
          <img :src="props.mainImage" :data-src="props.mainImage" alt="" />
          <div
            v-if="props.hasShipRequest && props.auctionType === 'INTERMEDIATE'"
            :class="{
              'text-gray-700 font-semibold absolute top-0 left-0 m-2': shipStatus === 'WAITING_FOR_CONFIRMATION',
              'text-yellow-700 font-semibold absolute top-0 left-0 m-2': shipStatus === 'WAITING_FOR_DELIVERY',
              'text-blue-700 font-semibold absolute top-0 left-0 m-2': shipStatus === 'ON_DELIVERY',
              'text-green-700 font-semibold absolute top-0 left-0 m-2': shipStatus === 'DELIVERED',
            }">
            <div class="flex bg-white mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border">
              <svg
                :class="{
                  'w-6 h-6 text-gray-700 dark:text-white mr-1 whitespace-nowrap':
                    shipStatus === 'WAITING_FOR_CONFIRMATION',
                  'w-6 h-6 text-yellow-700 dark:text-white mr-1 whitespace-nowrap':
                    shipStatus === 'WAITING_FOR_DELIVERY',
                  'w-6 h-6 text-blue-700 dark:text-white mr-1 whitespace-nowrap': shipStatus === 'ON_DELIVERY',
                  'w-6 h-6 text-green-700 dark:text-white mr-1 whitespace-nowrap': shipStatus === 'DELIVERED',
                }"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16">
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.5 10.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm0 0a2.225 2.225 0 0 0-1.666.75H12m3.5-.75a2.225 2.225 0 0 1 1.666.75H19V7m-7 4V3h5l2 4m-7 4H6.166a2.225 2.225 0 0 0-1.666-.75M12 11V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v9h1.834a2.225 2.225 0 0 1 1.666-.75M19 7h-6m-8.5 3.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
              </svg>
              {{
                shipStatus === 'WAITING_FOR_CONFIRMATION'
                  ? 'Đang chờ xác nhận'
                  : shipStatus === 'WAITING_FOR_DELIVERY'
                  ? 'Đang chờ vận chuyển'
                  : shipStatus === 'ON_DELIVERY'
                  ? 'Vận chuyển'
                  : shipStatus === 'DELIVERED'
                  ? 'Đã giao hàng'
                  : shipStatus
              }}
            </div>
          </div>
        </span>
        <span class="tt-img-roll-over absolute top-0 left-0">
          <img :src="props.secondaryImage" :data-src="props.secondaryImage" alt="" />
        </span>
      </a>
    </div>
    <div class="tt-description flex flex-col items-center">
      <div class="w-full flex justify-start ml-3">
        <AuctionType :type="props.auctionType" />
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
