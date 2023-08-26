<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  products: Array,
});
</script>


<template>
  <div class="container container-fluid-custom-mobile-padding">
    <div class="tt-block-title text-left">
      <h3 class="tt-title-small">SẢN PHẨM ĐANG ĐẤU GIÁ </h3>
    </div>
    <div
      class="tt-carousel-products row arrow-location-right-top tt-alignment-img tt-layout-product-item slick-animated-show-js">
      <div v-for="(product, index) in products" :key="index" class="col-2 col-md-4 col-lg-3">
        <div class="tt-product thumbprod-center">
          <div class="tt-image-box">
            <a href="#" class="tt-btn-quickview" data-toggle="modal" data-target="#ModalquickView"
              data-tooltip="Quick View" data-tposition="left"></a>
            <a href="#" class="tt-btn-wishlist" data-tooltip="Add to Wishlist" data-tposition="left"></a>
            <a href="#" class="tt-btn-compare" data-tooltip="Add to Compare" data-tposition="left"></a>
            <span class="tt-img"><img data-lazy="@/assets/img/product/{{ product.image }}" alt=""></span>
            <span class="tt-img-roll-over"><img data-lazy="@/assets/img/product/product-17-01.jpg" alt=""></span>
          </div>
          <div class="tt-description">

            <div class="tt-row">
              <ul class="tt-add-info">
                <li><a href="#">T-SHIRTS</a></li>
              </ul>
              <div class="tt-rating">
                <i class="icon-star"></i>
                <i class="icon-star"></i>
                <i class="icon-star"></i>
                <i class="icon-star-half"></i>
                <i class="icon-star-empty"></i>
              </div>
            </div>

            <h2 class="tt-title"><a href="product.html">{{ product.title }}</a></h2>
            <div class="tt-price">
              {{ product.price }}
            </div>

            <div class="tt-product-inside-hover">
              <div class="tt-row-btn">
                <a href="#" class="tt-btn-addtocart thumbprod-button-bg" data-toggle="modal"
                  data-target="#modalAddToCartProduct">ADD TO CART</a>
              </div>
              <div class="tt-row-btn">
                <a href="#" class="tt-btn-quickview" data-toggle="modal" data-target="#ModalquickView"></a>
                <a href="#" class="tt-btn-wishlist"></a>
                <a href="#" class="tt-btn-compare"></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
