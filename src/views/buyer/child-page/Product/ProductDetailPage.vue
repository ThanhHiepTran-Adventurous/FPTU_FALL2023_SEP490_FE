<script setup>

import { ref } from 'vue';
import ListProductImage from '@/components/product-detail/ListProductImage.vue';
import ProductInfo from '@/components/product-detail/ProductInfo.vue';
import ListRelatedProduct from '@/components/product-detail/ListRelatedProduct.vue';
const isModalActive = ref(true)
const inputVal = ref('')

</script>

<template>
   <div id="tt-pageContent">
	<div class="container-indent">
		<div class="container container-fluid-mobile">
			<div class="row">
				<div class="col-12 col-lg-9">
					<div class="row custom-single-page">
						<div class="col-6 hidden-xs">
						   <ListProductImage />
						</div>
						<div class="col-6">
						   <ProductInfo />
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
									<p>Free shipping on all US order or order above $99</p>
								</div>
							</a>
							<a href="#" class="tt-services-block">
								<div class="tt-col-icon">
									<i class="icon-f-35"></i>
								</div>
								<div class="tt-col-description">
									<h4 class="tt-title">SUPPORT 24/7</h4>
									<p>Contact us 24 hours a day, 7 days a week</p>
								</div>
							</a>
							<a href="#" class="tt-services-block">
								<div class="tt-col-icon">
									<i class="icon-e-09"></i>
								</div>
								<div class="tt-col-description">
									<h4 class="tt-title">30 DAYS RETURN</h4>
									<p>Simply return it within 30 days for an exchange.</p>
								</div>
							</a>
						</div>
						<div class="tt-promo-brand">
							<img src="@/assets/img/custom/tt-promo-brand-mobile.png" alt="">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	
	<div class="container-indent">
		<ListRelatedProduct />
	</div>
</div>

</template>
