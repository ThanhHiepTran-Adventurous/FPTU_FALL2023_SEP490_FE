<template>
  <div class="container container-fluid-custom-mobile-padding">
    <div class="tt-block-title text-left">
      <h3 class="tt-title-small">SẢN PHẨM ĐANG ĐƯỢC ĐẤU GIÁ</h3>
    </div>
    <div class="tt-carousel-products row arrow-location-right-top tt-alignment-img tt-layout-product-item slick-animated-show-js">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="col-2 col-md-4 col-lg-3">
        <div class="tt-product thumbprod-center">
          <div class="tt-image-box">
            <!-- Other buttons and links here... -->
            <a href="product.html">
              <span class="tt-img">
                <img :data-lazy="product.image" alt="">
              </span>
              <span class="tt-img-roll-over">
                <img :data-lazy="product.altImage" alt="">
              </span>
            </a>
          </div>
          <div class="tt-description">
            <!-- Other product info like category and rating... -->
            <h2 class="tt-title">
              <a href="product.html">{{ product.name }}</a>
            </h2>
            <div class="tt-price">
              ${{ product.price }}
            </div>
            <!-- Product hover options/buttons... -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [
        {
          id: 1,
          name: 'Flared Shift Dress',
          image: '@/assets/img/product/product-16.jpg',
          altImage: '@/assets/img/product/product-16-02.jpg',
          price: 24
        },
        // ... add other products here
      ]
    }
  }
}
</script>
