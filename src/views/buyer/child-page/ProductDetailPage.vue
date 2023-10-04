<script setup>
import ListProductImage from '@/components/product-detail/ListProductImage.vue';
import ProductInfo from '@/components/product-detail/ProductInfo.vue';
import ProductCarousel from '@/components/product-detail/ProductCarousel.vue';
import Breadcrumb from '@/layouts/Breadcrumb.vue';
import AuctionHistoryBid from '@/components/product-detail/AuctionHistoryBid.vue';

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


const chartData = {
	labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
	datasets: [{
		label: '# of Votes',
		data: [12, 19, 3, 5, 2, 3],
		backgroundColor: 'rgba(75, 192, 192, 0.2)'
	}]
};

const chartOptions = {
	// ... your chart options here
};


const productCarousels = [
	{
		id: 1,
		title: 'Flared Shift Dress',
		image: '/assets/img/product/product-1.jpg',
		price: '$24',
		starNumber: 4,
		tag: 'T-shirt'
	},
	{
		id: 3,
		title: 'Flared Shift Dress',
		image: '/assets/img/product/product-1.jpg',
		price: '$24',
		starNumber: 4,
		tag: 'T-shirt'
	},
	{
		id: 2,
		title: 'Casual T-shirt',
		image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png',
		price: '$18',
		starNumber: 5,
		tag: 'NEWS-Brand'

	},
];
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
			<!-- <div class="row">
				<div class="col-12 col-lg-6">
					<CustomChart :data="chartData" :options="chartOptions"></CustomChart>
				</div>
				<div class="col-12 col-lg-6">
					<Table />
				</div>

			</div> -->
		</div>
	</div>


	<div class="container-indent">
		<ProductCarousel :products="productCarousels" />
	</div>
</template>
