<script setup>
import ListProductImage from '@/components/product-detail/ListProductImage.vue';
import ProductInfo from '@/components/product-detail/ProductInfo.vue';
import Breadcrumb from '@/layouts/Breadcrumb.vue';
import AuctionHistoryBid from '@/components/product-detail/AuctionHistoryBid.vue';
import ItemBox from '@/components/common-components/ItemBox.vue';
import { useRoute, useRouter } from 'vue-router';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import auctionService from '@/services/auction.service';
import moment from 'moment';
import toastOption from '@/utils/toast-option';

const route = useRoute();
const router = useRouter();

const bidHistoryInfo = ref([])
const numOfUsers = ref(0)
const numOfBids = ref(0)

let isFirstTime = true;
let interval;

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

    const newData = data.informationBidderDTOS ? data.informationBidderDTOS.map(d => {
		const isExisted = bidHistoryInfo.value.filter(inf => inf.bidAmount === d.bidAmount && inf.idBidder === d.idBidder)
		const isNew = !(isExisted && isExisted.length > 0)
        return {
            idBidder: d.idBidder,
            bidAmount: d.bidAmount,
            createAt: moment.utc(d.bidTime).format("DD/MM/YYYY HH:mm:ss"),
            bidType: d.auctionType,
			isNew: isFirstTime ? false : isNew,
        }
    }).sort((d1, d2) => {
        return d2.bidAmount - d1.bidAmount
    }) : []
	bidHistoryInfo.value = [...newData]
	if(bidHistoryInfo.value.length > 0){
		const topBidderData = bidHistoryInfo.value[0]
		const latestBidderInfo = {
			identifier: topBidderData.idBidder,
			createdAt: topBidderData.createAt
		}
		if(auction.value && auction.value.latestBidderInfo){
			auction.value.latestBidderInfo.identifier = latestBidderInfo.identifier
			auction.value.latestBidderInfo.createdAt = latestBidderInfo.createdAt
		} else {
			auction.value = {...auction.value, latestBidderInfo }
		}
		auction.value.highestPrice = topBidderData.bidAmount
	}
}

const fetchPageData = async () => {
	await fetchBidHistory()
	isFirstTime = false
	fetchDetail()
}
const onBuyNowSuccess = () => {
	toastOption.toastSuccess("Mua ngay thành công")
	router.push("/bought")
}

onMounted(async () => {
	fetchPageData()

	// NEED TO REPLACE SET INTERVAL WITH FIREBASE MESSAGE TRIGGER!!!!!
	interval = setInterval(() => {
		console.log("interval call")
		fetchBidHistory()
	}, 10000)
})

onBeforeUnmount(() => {
	clearInterval(interval)
})
</script>

<template>
	<div class="p-4">
		<div class="">
			<Breadcrumb :items="breadcrumbItems" />
			<div class="pt-3 w-full xl:flex gap-3">
				<div class="flex items-start w-full xl:w-[80%] rounded-md pt-2 !bg-white">
					<div class="hidden-xs w-[100%] px-2 pt-16">
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
