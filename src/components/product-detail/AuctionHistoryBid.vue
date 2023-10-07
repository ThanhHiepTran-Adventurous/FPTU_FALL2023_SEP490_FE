<script setup>
import auctionService from '@/services/auction.service';
import formatCurrency from '@/utils/currency-formatter';
import moment from 'moment';
import { onMounted, ref, watch } from 'vue';
import BidTypeBadge from '../common-components/BidTypeBadge.vue';
import { BidType } from '@/common/contract';

const props = defineProps({
    auctionId: String,
    productId: String
})

const auctionHistory = ref([])
const numOfUsers = ref(0)
const numOfBids = ref(0)

const fetchAuctionHistory = async () => {
    const response = await auctionService.getHistoryBid(props.auctionId, props.productId)
    const data = response.data

    numOfUsers.value = data.bidders
    numOfBids.value = data.bids

    auctionHistory.value = data.informationBidderDTOS.map(d => {
        return {
            idBidder: d.idBidder,
            bidAmount: d.bidAmount,
            createAt: moment(d.bidTime).format("DD/MM/YYYY HH:mm:ss"),
            bidType: d.auctionType
        }
    }).sort((d1, d2) => {
        return d2.bidAmount - d1.bidAmount
    })

}

watch(props, async () => {
    if(props.auctionId && props.productId){
        fetchAuctionHistory()
    }
})

</script>
<template>
    <div class="w-full">
        <div class="mb-8 text-black text-2xl font-semibold text-blue-500 pl-4 pt-4 flex justify-between items-center">
            <div>
                Lịch sử đấu giá
            </div>
            <div class="mr-8">
                <div class="bg-green-100 text-green-800 text-xs font-medium font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded">Người tham gia: {{ numOfUsers }}</div>
                <div class="bg-green-100 text-green-800 text-xs font-medium font-semibold mr-2 px-2.5 py-0.5 rounded">Lượt đấu giá: {{ numOfBids }}</div>
            </div>
        </div>
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
                <tr v-for="auction in auctionHistory" :key="auction.id" class="bg-white border-b">
                    <td class="px-6 py-4">{{ auction.idBidder }}</td>
                    <td class="px-6 py-4 text-blue-600 font-semibold">{{ formatCurrency(auction.bidAmount) }}</td>
                    <td class="px-6 py-4">{{ auction.createAt }}</td>
                    <td class="px-6 py-4"><BidTypeBadge :type-bid="auction.bidType" /></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>