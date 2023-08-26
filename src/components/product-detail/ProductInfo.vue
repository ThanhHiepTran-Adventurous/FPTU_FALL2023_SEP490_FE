<template>
  <div class="tt-product-single-info">
    <div class="tt-add-info">
      <ul>
        <li><span>SKU:</span> {{ data.sku }}</li>
        <li><span>Care:</span> 40 người đang tham gia đấu giá</li>
      </ul>
    </div>
    <h1 class="tt-title">{{ data.productTitle }}</h1>
    <div class="tt-price">
      <span class="new-price">{{ data.productPrice }}</span>
    </div>
    <div class="tt-review">
      <div class="tt-rating">
        <i v-for="starClass in starClasses" :key="starClass" :class="starClass"></i>
      </div>
      <a class="product-page-gotocomments-js" href="#">({{ data.reviewNumber }} khách hàng đánh giá )</a>
    </div>
    <div class="tt-wrapper">
      {{ data.productDescription }}
    </div>
    <div class="tt-wrapper">
      <div class="tt-countdown_box_02">
        <div class="tt-countdown_inner">
          <CountDown :coefficientSize="0.7" :deadlineInMilis="1693094493940" />
        </div>
      </div>
    </div>
    <div class="tt-wrapper">
      <div class="direction">
        <a href="#" class="button-scope btn btn-lg"><i class="icon-f-39"></i>ĐẶT LỆNH ĐẤU GIÁ</a>
        <a href="#" class="button-scope btn btn-lg"><i class="icon-f-39"></i>THÊM VÀO YÊU THÍCH</a>
        <a href="#" class="button-scope btn btn-lg"><i class="icon-f-39"></i>BÁO CÁO </a>
      </div>
    </div>
    <div class="tt-wrapper">
      <ul class="tt-list-btn">
        <li><a class="btn-link" href="#"><i class="icon-n-072"></i>ADD TO WISH LIST</a></li>
        <li><a class="btn-link" href="#"><i class="icon-n-08"></i>ADD TO COMPARE</a></li>
      </ul>
    </div>
    <div class="tt-wrapper">
      <div class="tt-add-info">
        <ul>
          <li v-for="tag in getTags" :key="tag"><a href="#">{{ tag }}</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref,computed } from 'vue';
import CountDown from '@/components/common-components/CountDown.vue';

export default {
  components: {
    CountDown
},
  
  setup() {
 
    const data = ref({
      sku: '001',
      productTitle: 'Tên Sản Phẩm',
      productPrice: '90.000.000 VND',
      productDescription: 'loreum ipsum dolor sit ametloreum ipsum dolor sit ametloreum ipsum dolor sit ametloreum ipsum dolor sit ametloreum ipsum dolor sit ametloreum ipsum dolor sit amet',
      productRateStar: 3,
      reviewNumber: '1',
      vendor: 'Polo',
      productType: 'T-Shirt',
      tags: ['T-Shirt', 'Women', 'Top']
    });
    const getTags = () => {
      return data.value.tags;
    };


    const starClass = 'icon-star';
    const halfStarClass = 'icon-star-half';
    const emptyStarClass = 'icon-star-empty';

    const starClasses = computed(() => {
      const rating = data.value.productRateStar;
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 !== 0;
      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

      return Array(fullStars).fill(starClass)
        .concat(hasHalfStar ? [halfStarClass] : [])
        .concat(Array(emptyStars).fill(emptyStarClass));
    });

    return {
      data,
      getTags,
      starClasses,
    };
  },
};
</script>

<style>
.direction {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
}

.button-scope {
  margin: 10px;
  width: 100%;
}
</style>
