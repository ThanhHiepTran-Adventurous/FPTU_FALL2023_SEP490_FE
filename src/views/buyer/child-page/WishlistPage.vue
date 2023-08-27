<script setup>

const products = [
	{
		id: 1,
		name: 'Flared Shift Dress',
		image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png',
		newPrice: '200.000 VND',
		oldPrice: '500.000 VND',
	}, {
		id: 2,
		name: 'Flared Shift Dress',
		image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png',
		newPrice: '200.000 VND',
		oldPrice: '500.000 VND',
	}, {
		id: 3,
		name: 'Flared Shift Dress',
		image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png',
		newPrice: '200.000 VND',
		oldPrice: '500.000 VND',
	}, {
		id: 4,
		name: 'Flared Shift Dress',
		image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png',
		newPrice: '200.000 VND',
		oldPrice: '500.000 VND',
	},
];
</script>
<template>
	<div>
		<div class="tt-breadcrumb">
			<div class="container">
				<ul>
					<li><a href="index.html">Home</a></li>
					<li>wishlist</li>
				</ul>
			</div>
		</div>
		<div id="tt-pageContent">
			<div class="container-indent">
				<div class="container">
					<h1 class="tt-title-subpages noborder">SẢN PHẨM YÊU THÍCH</h1>
					<div class="tt-wishlist-box" id="js-wishlist-removeitem">
						<div class="tt-wishlist-list">
							<div class="tt-item" v-for="(product, index) in products" :key="index">
								<div class="tt-col-description">
									<div class="tt-img">
										<img :src="product.image" alt="product image">
									</div>
									<div class="tt-description">
										<h2 class="tt-title"><a :href="'/product-detail/' + product.id">{{ product.name }}</a></h2>
										<div class="tt-price">
											<span class="new-price">{{ product.newPrice }}</span>
											<span class="old-price">{{ product.oldPrice }}</span>
										</div>
									</div>
								</div>
								<div class="tt-col-btn">
									<a href="#" class="tt-btn-addtocart" data-toggle="modal" data-target="#modalAddToCartProduct"><i
											class="icon-f-39"></i>THAM GIÁ ĐẤU GIÁ</a>
									<a class="btn-link" :href="'/product-detail/' + product.id" data-toggle="modal"
										data-target="#ModalquickView"><i class="icon-f-73"></i>XEM SẢN PHẨM</a>
									<a class="btn-link js-removeitem" href="#"><i class="icon-h-02"></i>XÓA</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>