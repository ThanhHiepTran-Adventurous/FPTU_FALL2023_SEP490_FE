<script setup>

import ListProductImage from '@/components/product-detail/ListProductImage.vue';
import ProductInfo from '@/components/product-detail/ProductInfo.vue';
import ProductCarousel from '@/components/product-detail/ProductCarousel.vue';
import Table from '@/components/common-components/Table.vue';
import CustomChart from '@/components/common-components/CustomChart.vue';
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
	<div id="tt-pageContent">
		<div class="container-indent">
			<div class="container container-fluid-mobile">
				<div class="row">
					<div class="col-12 col-lg-9">
						<div class="row custom-single-page">
							<div class="col-6 hidden-xs">
								<ListProductImage :images="product.productImages" />
							</div>
							<div class="col-6">
								<ProductInfo :productInfo="product.productInfo" />
							</div>
						</div>
					</div>
					<div class="col-12 col-lg-3">
						<div class="tt-product-single-aside">
							<div class="tt-services-aside">
								<a href="#" class="tt-services-block">
									<div class="tt-col-icon">
										<i class="icon-f-48"></i>
									</div>
									<div class="tt-col-description">
										<h4 class="tt-title">FREE SHIPPING</h4>
										<p>Miễn phí shipping với mặt hàng có giá trị từ 2.000.000 VND trở lên</p>
									</div>
								</a>
								<a href="#" class="tt-services-block">
									<div class="tt-col-icon">
										<i class="icon-f-35"></i>
									</div>
									<div class="tt-col-description">
										<h4 class="tt-title">SUPPORT 24/7</h4>
										<p>Hỗ trợ chăm sóc khách hàng 24 tiếng / ngày , 7 ngày / tuần</p>
									</div>
								</a>
								<a href="#" class="tt-services-block">
									<div class="tt-col-icon">
										<i class="icon-e-09"></i>
									</div>
									<div class="tt-col-description">
										<h4 class="tt-title">30 DAYS RETURN</h4>
										<p>30 Ngày hoàn trả nếu sản phẩm đấu giá không đúng với chính sách hoàn trả của chúng tôi.</p>
									</div>
								</a>
							</div>

						</div>
					</div>

				</div>
				<div class="row">
					<div class="col-12 col-lg-6">
							 <!-- CHART HERE  -->
							 <CustomChart :data="chartData" :options="chartOptions"></CustomChart>
					</div>
					<div class="col-12 col-lg-6">
								<!-- TABLE HERE  -->
								 <Table />
					</div>

				</div>
			</div>
		</div>


		<div class="container-indent">
			<ProductCarousel :products="productCarousels" />
		</div>

	</div>
</template>
