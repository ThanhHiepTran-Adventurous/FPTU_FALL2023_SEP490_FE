<script setup>
import Breadcrumb from '@/layouts/Breadcrumb.vue';
import auctionService from '@/services/auction.service';
import { onMounted, ref, watch } from 'vue';
import imageHelper from '@/utils/image-helper'
import formatCurrency from '@/utils/currency-formatter';
import moment from 'moment';
import AuctionType from '@/components/common-components/badge/AuctionType.vue';
import SearchInput from '@/components/common-components/SearchInput.vue';
import { AuctionModelType } from '@/common/contract';
import { Icon } from '@iconify/vue'
import BoughtNav from '../BoughtNav.vue';
import Dropdown from '@/components/common-components/Dropdown.vue';

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
const auctionWinFiltered = ref([])


const options = ref([
    {
        label: "Tự trao đổi",
        value: AuctionModelType.immediate
    },
    {
        label: "Trung gian qua hệ thống",
        value: AuctionModelType.intermediate
    }
])

const selected = ref({
  label: "Tự trao đổi",
  value: AuctionModelType.immediate
})
watch(selected, (newVal) => {
    filterData()
})

const filterData = () => {
    auctionWinFiltered.value = auctionWins.value.filter(v => v.informationAuction.modelType === selected.value.value)
}

const fetchAuctionWinData = async () => {
    const response = await auctionService.getListAuctionWin()
    auctionWins.value = response.data
    auctionWinFiltered.value = JSON.parse(JSON.stringify(auctionWins.value))
    filterData()
}

onMounted(() => {
    fetchAuctionWinData()
})

</script>

<template>
    <div class="w-full">
        <div class="mt-3 mb-3 container mx-auto">
            <Breadcrumb :items="breadcrumbItems" />
        </div>
        <BoughtNav />

        <!-- Main section -->
        <div class="bg-white container mx-auto">
            <div class="mb-4 mr-5 ml-5 mt-2 pt-2">
                <div class="mt-3 flex items-center">
                    <Dropdown v-model="selected" :data="options" class="!w-[300px]"/>
                    <div class="w-full">
                        <SearchInput placeholder="       Search a product" addOnInputClass="w-full" />
                    </div>
                </div>
            </div>
            <div class="bg-white flex flex-wrap gap-5 pt-2 pb-5 w-full mx-5">
                <div v-for="auction in auctionWinFiltered" :key="auction.id" class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" :src="imageHelper.getPrimaryImageFromList(auction.informationAuction.product.imageUrls)" alt="">
                    <div class="flex flex-col justify-between p-4 leading-normal">
                        <div class="text-xl font-semibold mb-1 tracking-tight text-gray-900 dark:text-white">{{ auction.informationAuction.product.name }}</div>
                        <AuctionType :type="auction.informationAuction.modelType"/>
                        <div class="font-normal text-gray-700 dark:text-gray-400 mt-6 flex items-center">
                            <span>Giá đạt được: </span>
                            <span class="text-blue-600 text-2xl font-semibold ml-3">{{ formatCurrency(auction.finalPrice) }}</span>
                        </div>
                        <div class="mb-3 font-normal text-gray-700 dark:text-gray-400">Thắng đấu giá lúc: <span class="text-blue-600">{{ moment.utc(auction.winAt).format("DD/MM/YYYY HH:MM:ss") }}</span></div>
                        <div v-if="auction.informationAuction.modelType === AuctionModelType.immediate" class="bg-blue-600 text-white rounded-lg px-6 py-2 flex items-center !w-[180px]">
                            <div><Icon icon="ic:outline-chat" class="text-[24px] mr-3"/></div>
                            <div class="text-lg">Liên hệ</div>
                        </div>
                        <div v-else class="bg-blue-600 text-white rounded-lg px-6 py-2 flex items-center !w-[180px]">
                            <div><Icon icon="streamline:money-wallet-money-payment-finance-wallet" class="text-[24px] mr-3"/></div>
                            <div class="text-lg">Thanh toán</div>
                        </div>
                    </div>
                </div>
    
            </div>
        </div>
    </div>
</template>