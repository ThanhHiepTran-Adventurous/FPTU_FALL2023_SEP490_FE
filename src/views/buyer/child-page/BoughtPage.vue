<script setup>
import Breadcrumb from '@/layouts/Breadcrumb.vue';
import auctionService from '@/services/auction.service';
import { onMounted, ref } from 'vue';
import imageHelper from '@/utils/image-helper'
import formatCurrency from '@/utils/currency-formatter';
import moment from 'moment';



const breadcrumbItems = [
	{
		text: "Trang chủ",
		to: "/",
		disabled: false,
	},
	{
		text: "Đã mua",
		to: "/bought",
		disabled: true,
	}
]
const auctionWins = ref([])

const fetchAuctionWinData = async () => {
    const response = await auctionService.getListAuctionWin()
    auctionWins.value = response.data
}

onMounted(() => {
    fetchAuctionWinData()
})

</script>

<template>
    <div class="w-full">
        <div class="mt-3">
            <Breadcrumb :items="breadcrumbItems" />
        </div>
        <!-- Main section -->
        <div class="bg-white flex flex-wrap gap-5 mt-3 py-5 w-full px-[100px]">
                        
            <div v-for="auction in auctionWins" :key="auction.id" class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" :src="imageHelper.getPrimaryImageFromList(auction.informationAuction.product.imageUrls)" alt="">
                <div class="flex flex-col justify-between p-4 leading-normal">
                    <h5 class="mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ auction.informationAuction.product.name }}</h5>
                    <div class="font-normal text-gray-700 dark:text-gray-400">Giá đạt được: <span class="text-blue-600">{{ formatCurrency(auction.finalPrice) }}</span></div>
                    <div class="mb-3 font-normal text-gray-700 dark:text-gray-400">Thắng đấu giá lúc: <span class="text-blue-600">{{ moment.utc(auction.winAt).format("DD/MM/YYYY HH:MM:ss") }}</span></div>
                    <div class="bg-blue-600 text-white rounded-lg w-max px-6 py-2"> Đi đến </div>
                </div>
            </div>

        </div>
    </div>
</template>