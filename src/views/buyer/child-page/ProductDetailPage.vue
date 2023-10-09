<script setup>
import ListProductImage from '@/components/product-detail/ListProductImage.vue';
import ProductInfo from '@/components/product-detail/ProductInfo.vue';
import Breadcrumb from '@/layouts/Breadcrumb.vue';
import AuctionHistoryBid from '@/components/product-detail/AuctionHistoryBid.vue';
import ItemBox from '@/components/common-components/ItemBox.vue';
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import auctionService from '@/services/auction.service';
import moment from 'moment';

const route = useRoute();

const bidHistoryInfo = ref([])
const numOfUsers = ref(0)
const numOfBids = ref(0)

const auction = ref(null)

const breadcrumbItems = [
	{
		text: "Trang chủ",
		to: "/",
		disabled: false,
	},
	{
		text: "Đấu giá",
		to: "/auctions",
		disabled: false,
	},
	{
		text: "Áo ba lỗ",
		to: "/product-detail",
		disabled: true,
	}
]

const fetchDetail = async () => {
	const auctionDetailData = await auctionService.getAuctionDetail(route.params["id"])
	const autionData = auction.value
	auction.value = {...autionData, ... auctionDetailData.data, numOfUsers : numOfUsers.value }
}
const fetchBidHistory = async () => {
	const response = await auctionService.getHistoryBid(route.params["id"])
    const data = response.data
    numOfUsers.value = data.bidders || 0
    numOfBids.value = data.bids || 0

    bidHistoryInfo.value = data.informationBidderDTOS ? data.informationBidderDTOS.map(d => {
        return {
            idBidder: d.idBidder,
            bidAmount: d.bidAmount,
            createAt: moment(d.bidTime).format("DD/MM/YYYY HH:mm:ss"),
            bidType: d.auctionType
        }
    }).sort((d1, d2) => {
        return d2.bidAmount - d1.bidAmount
    }) : []
	if(bidHistoryInfo.value.length > 0){
		const topBidderData = bidHistoryInfo.value[0]
		const latestBidderInfo = {
			identifier: topBidderData.idBidder,
			createdAt: moment(topBidderData.bidTime).format("DD/MM/YYYY HH:mm:ss")
		}
		auction.value = {...auction.value, latestBidderInfo }
		console.log(auction.value)
	}
}

const fetchPageData = async () => {
	await fetchBidHistory()
	fetchDetail()
}
const onBuyNowSuccess = () => {

}

onMounted(async () => {
	fetchPageData()
})

</script>

<template>
	<div class="p-4">
		<div class="">
			<Breadcrumb :items="breadcrumbItems" />
			<div class="pt-3 w-full xl:flex gap-3">
				<div class="flex items-start w-full xl:w-[80%] rounded-md pt-2 !bg-white">
					<div class="hidden-xs w-[40%] pr-16">
						<ListProductImage :images="auction?.product?.imageUrls" />
					</div>
					<div class="pl-5 border-l-[1px]">
						<ProductInfo :auction-info="auction" @place-bid-success="fetchPageData()" @buy-now-success="onBuyNowSuccess()"/>
					</div>
				</div>
				<div class="flex items-start rounded-md !bg-white xl:mt-0 w-full xl:w-[50%]">
					<AuctionHistoryBid :auctionHistory="bidHistoryInfo" :numOfUsers="numOfUsers" :numOfBids="numOfBids" />
				</div>
			</div>
			<div class="text-xl mt-8">SẢN PHẨM KHÁC</div>
			<div class="mt-3 bg-white py-2 rounded-lg">
				<div class="flex gap-9 justify-around container mx-auto">
					<ItemBox product-name="Super long long long long name long long long long" item-id="1" :time-remain="999999" />
					<ItemBox product-name="Super long long long" item-id="1" :time-remain="999999"/>
					<ItemBox product-name="Super long long long" item-id="1" :time-remain="999999"/>
					<ItemBox product-name="Super long long long" item-id="1" :time-remain="999999"/>
					<ItemBox product-name="Super long long long" item-id="1" :time-remain="999999"/>
					<ItemBox product-name="Super long long long" item-id="1" :time-remain="999999"/>
					<ItemBox product-name="Super long long long" item-id="1" :time-remain="999999"/>
				</div>
			</div>
		</div>
	</div>
</template>
