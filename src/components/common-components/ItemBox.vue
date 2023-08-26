<script setup>
</script>
<template>
    <div class="tt-product thumbprod-center">
        <div class="tt-image-box">
            <a href="#" class="tt-btn-quickview" data-toggle="modal" data-target="#ModalquickView" data-tooltip="Quick View"
                data-tposition="left"></a>
            <a href="#" class="tt-btn-wishlist" data-tooltip="Add to Wishlist" data-tposition="left"></a>
            <a class="block w-[200px] h-[250px] overflow-hidden" href="product.html">
                <span class="tt-img"><img src="/src/assets/img/product/product-18.jpg" data-src="/src/assets/img/product/product-18.jpg" alt=""></span>
                <span class="tt-img-roll-over">
                    <img src="/src/assets/img/product/product-18-01.jpg" data-src="/src/assets/img/product/product-18-01.jpg" alt="">
                </span>
            </a>
        </div>
        <div class="tt-description">
            <div class="tt-row">
                <ul class="tt-add-info">
                    <li><a href="#">VENDER</a></li>
                </ul>
                <div class="tt-rating">
                    <i class="icon-star"></i>
                    <i class="icon-star"></i>
                    <i class="icon-star"></i>
                    <i class="icon-star-half"></i>
                    <i class="icon-star-empty"></i>
                </div>
            </div>
            <h2 class="tt-title"><a href="product.html">Name product</a></h2>
            <div class="tt-price">
                $124
            </div>
            <div class="tt-product-inside-hover opacity-0 hover:opacity-1">
                <div class="tt-row-btn">
                    <a href="#" class="tt-btn-addtocart thumbprod-button-bg" data-toggle="modal"
                        data-target="#modalAddToCartProduct">ADD TO CART</a>
                </div>
                <div class="tt-row-btn">
                    <a href="#" class="tt-btn-quickview" data-toggle="modal" data-target="#ModalquickView"></a>
                    <a href="#" class="tt-btn-wishlist"></a>
                </div>
            </div>
        </div>
    </div>
</template>