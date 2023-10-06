<script setup>
import ListProductImage from '@/components/product-detail/ListProductImage.vue';
import ProductInfo from '@/components/product-detail/ProductInfo.vue';
import Breadcrumb from '@/layouts/Breadcrumb.vue';
import AuctionHistoryBid from '@/components/product-detail/AuctionHistoryBid.vue';
import ItemBox from '@/components/common-components/ItemBox.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();
const route = useRoute();

onMounted(() => {
	console.log(route.params["id"])
})

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

const product = {
	productImages: [
		"https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png",
		"https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png",
		"https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png",
		"https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png",
	],
	productInfo: {
		sku: '001',
		productTitle: 'Tên Sản Phẩm',
		productPeopleJoin: '40',
		productPrice: '90.000.000 VND',
		productDescription: 'loreum ipsum dolor sit ametloreum ipsum dolor sit ametloreum ipsum dolor sit ametloreum ipsum dolor sit ametloreum ipsum dolor sit ametloreum ipsum dolor sit amet',
		productRateStar: 3,
		reviewNumber: '1',
		vendor: 'Polo',
		productType: 'T-Shirt',
		tags: ['T-Shirt', 'Women', 'Top']
	}

}
</script>

<template>
	<div class="p-4">
		<div class="">
			<Breadcrumb :items="breadcrumbItems" />
			<div class="pt-3 w-full flex gap-3">
				<div class="flex items-start w-[80%] rounded-md pt-2 !bg-white">
					<div class="hidden-xs w-[40%]">
						<ListProductImage :images="product.productImages" />
					</div>
					<div class="">
						<ProductInfo :productInfo="product.productInfo" />
					</div>
				</div>
				<div class="flex items-start rounded-md !bg-white w-[50%]">
					<AuctionHistoryBid />
				</div>
			</div>
			<div class="text-xl mt-16">SẢN PHẨM KHÁC</div>
			<div class="mt-3 bg-white py-2 rounded-lg">
				<div class="flex justify-around container mx-auto">
					<ItemBox product-name="Super long long long long name long long long long"/>
					<ItemBox product-name="Super long long long"/>
					<ItemBox product-name="Super long long long"/>
					<ItemBox product-name="Super long long long"/>
				</div>
			</div>
		</div>
	</div>
</template>
