<script setup>
import ListProduct from '@/components/page-sections/product-manager/Products.vue';
const Products = [
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
					   PROFILE HERE
					</div>
					<div class="col-12 col-lg-3">
						<div class="tt-product-single-aside">
							<div class="tt-services-aside">
							   TOTAL NUMBER 
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>


		<div class="container-indent">
			<Products :products="products" />
		</div>

	</div>
</template>
