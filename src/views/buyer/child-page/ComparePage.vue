<script setup>
import { ref } from 'vue';

const products = ref([
  {
    imageSrc: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png",
    title: "Flared Shift Dress",
    status: 'Đang bán',
    price: "$14",
    description: "We are proud to present our best premium Shopify theme - Wokiee.",
    vendor: "GAP",
    color: "Blue, Purple, White",
    size: "20, 24",
    material: "100% Polyester",
    inStock: true
  }, {
    imageSrc: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png",
    title: "Flared Shift Dress",
    price: "$14",
    status: 'Đang bán',

    description: "We are proud to present our best premium Shopify theme - Wokiee.",
    vendor: "GAP",
    color: "Blue, Purple, White",
    size: "20, 24",
    material: "100% Polyester",
    inStock: true
  }, {
    imageSrc: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png",
    title: "Flared Shift Dress",
    price: "$14",
    status: 'Đang bán',

    description: "We are proud to present our best premium Shopify theme - Wokiee.",
    vendor: "GAP",
    color: "Blue, Purple, White",
    size: "20, 24",
    material: "100% Polyester",
    inStock: true
  }, {
    imageSrc: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png",
    title: "Flared Shift Dress",
    price: "$14",
    status: 'Đang bán',

    description: "We are proud to present our best premium Shopify theme - Wokiee.",
    vendor: "GAP",
    color: "Blue, Purple, White",
    size: "20, 24",
    material: "100% Polyester",
    inStock: true
  },
]);
</script>


<template>
  <div id="tt-pageContent">
    <div class="container-indent">
      <div class="container">
        <h1 class="tt-title-subpages noborder">SO SÁNH <span id="tt-compare-countitem">{{ products.length }}</span> SẢN
          PHẨM</h1>
        <div class="tt-compare-table02" id="tt-compare-table02">
          <div class="tt-col-title">
            <div class="title-item js_one-height-01"></div>
            <div class="title-item js_one-height-02">Giới Thiệu</div>
            <div class="title-item js_one-height-03">Nhà Sản Xuất</div>
            <div class="title-item js_one-height-04">Màu Sắc</div>
            <div class="title-item js_one-height-05">Size</div>
            <div class="title-item js_one-height-06">Chất Liệu</div>
            <div class="title-item js_one-height-07"></div>
          </div>
          <div class="tt-col-item">
            <div class="compare-init-slider">
              <!-- Loop through products -->
              <div v-for="(product, index) in products" :key="index" class="tt-item">
                <div class="tt-image-box js_one-height-01">
                  <a href="#" class="tt-remove-item js-remove-item"></a>
                  <div class="tt-img">
                    <a :href="'product.html?id=' + index">
                      <img :src="product.imageSrc" alt="" class="loading" data-was-processed="true">
                    </a>
                  </div>
                  <div class="tt-label-location">
                    <div v-if="product.inStock" class="tt-label-in-stock">{{ product.status }}</div>
                  </div>
                  <h2 class="tt-title"><a :href="'product.html?id=' + index">{{ product.title }}</a></h2>
                  <div class="tt-price">{{ product.price }}</div>
                  <a href="#" class="tt-btn-addtocart" data-toggle="modal" data-target="#modalAddToCartProduct"><i
                      class="icon-f-39"></i>TIẾN HÀNH ĐẤU GIÁ</a>
                </div>
                <div class="tt-value js_one-height-02">{{ product.description }}</div>
                <div class="tt-value js_one-height-03">{{ product.vendor }}</div>
                <div class="tt-value js_one-height-04">{{ product.color }}</div>
                <div class="tt-value js_one-height-05">{{ product.size }}</div>
                <div class="tt-value js_one-height-06">{{ product.material }}</div>
                <div class="tt-value js_one-height-07">
                  <a href="#" class="tt-btn-addtocart" data-toggle="modal" data-target="#modalAddToCartProduct">
                    <i class="icon-f-39"></i>CHI TIẾT
                  </a>
                </div>
              </div>
              <!-- / -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

