<script setup>
import formatCurrency from '@/utils/currency-formatter';
import { onMounted, ref } from 'vue';
import BidTypeBadge from '../common-components/BidTypeBadge.vue';

const props = defineProps(['auctionHistory', 'numOfUsers', 'numOfBids'])
const isChangeColor = ref(false)

onMounted(() => {
    setTimeout(() => {
        isChangeColor.value = true
    }, 1000)
})

</script>
<template>
    <div class="w-full">
        <div class="mb-8 text-black text-2xl font-semibold text-blue-500 pl-4 pt-4 flex justify-between items-center">
            <div class="relative flex">
                <span class="mr-2">Lịch sử đấu giá</span>
                <span class="relative flex h-3 w-3">
                    <span class="relative inline-flex rounded-full h-full w-full bg-green-500"></span>
                    <span class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                </span>
            </div>
            <div class="mr-8">
                <div class="bg-green-100 text-green-800 text-xs font-medium font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded">Người tham gia: {{ numOfUsers }}</div>
                <div class="bg-green-100 text-green-800 text-xs font-medium font-semibold mr-2 px-2.5 py-0.5 rounded">Lượt đấu giá: {{ numOfBids }}</div>
            </div>
        </div>
        <div class="h-[400px] overflow-auto">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th class="px-6 py-3">Tài khoản</th>
                        <th class="px-6 py-3">Giá đặt</th>
                        <th class="px-6 py-3">Thời gian</th>
                        <th class="px-6 py-3">Loại đấu giá</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="auction in auctionHistory" :key="auction.id" class="border-b transition-all duration-[2000ms]" :class="{'bg-green-200': auction.isNew, 'bg-white': !auction.isNew}">
                        <td class="px-6 py-4">{{ auction.idBidder }}</td>
                        <td class="px-6 py-4 text-blue-600 font-semibold">{{ formatCurrency(auction.bidAmount) }}</td>
                        <td class="px-6 py-4">{{ auction.createAt }}</td>
                        <!-- need to fix -->
                        <td class="px-6 py-4"><BidTypeBadge :type-bid="auction.bidType" /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>