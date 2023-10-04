<script setup>
import { computed } from 'vue';
import CountDown from '@/components/common-components/Countdown.vue';
import { Icon } from '@iconify/vue';
import Rating from 'vue-star-rating'
   
  const props = defineProps({
    productInfo : Object,
  });
  
    const data = props.productInfo;
    const getTags = () => {
      return data.tags;
    };


    const starClass = 'icon-star';
    const halfStarClass = 'icon-star-half';
    const emptyStarClass = 'icon-star-empty';

    const starClasses = computed(() => {
      const rating = data.productRateStar;
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 !== 0;
      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

      return Array(fullStars).fill(starClass)
        .concat(hasHalfStar ? [halfStarClass] : [])
        .concat(Array(emptyStars).fill(emptyStarClass));
    });



</script>

<template>
  <div class="tt-product-single-info">
    <div class="flex">
      <ul>
        <li class="bg-blue-100 !text-blue-800 mt-2 w-max text-sm font-medium mr-2 px-2.5 py-1 rounded text-center flex items-center">
          <span class="mr-3"><Icon icon="mdi:fire" class="text-red-500 text-[24px]"/></span>
          {{ data.productPeopleJoin }} người đang tham gia đấu giá
        </li>
      </ul>
    </div>
    <div class="text-3xl my-3 text-black">{{ data.productTitle }}</div>
    <div class="flex items-center">
      <div class="pr-3 border-r-[1px]"><Rating :rating="4.5" :fixed-point="1" :round-start-rating="false" :show-rating="false" :star-size="19"/></div>
      <div class="ml-3 bg-green-100 !text-green-800 text-sm font-medium mr-2 px-2.5 py-1 rounded">Còn tem</div>
      <div class="bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 px-2.5 py-1 rounded">Còn bill</div>
      <div class="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-1 rounded">Đổi trả</div>
    </div>
    <div class="mt-4">
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
      <div class="flex gap-3 w-full">
        <div class="flex flex-col gap-8 w-full">
          <div class="flex items-start justify-around gap-3 w-full border-b-[2px] pb-8 mr-2">
            <div>
              <div class="text-2xl font-bold text-blue-500 flex">
                <span class="text-black w-[150px] block mr-3">Hiện tại: </span>1.000.000 VNĐ
              </div>
              <div>
                Đặt lần cuối bởi: 111xxx111111 - Lúc: 30/09/2023 21:59:00
              </div>
            </div>
            <div class="px-2">
              <button class="flex w-[200px] font-semibold items-center justify-center bg-white hover:bg-red-700 border-blue-500 text-blue-700 border-[1px] py-3 px-8 rounded-md">
                <div class="text-[20px]">Đấu giá</div>
              </button>
            </div>
          </div>
          <div class="flex items-start justify-around gap-3 w-full mr-2">
            <div>
              <div class="text-2xl flex font-bold text-red-500">
                <span class="text-black block w-[150px] mr-3">Mua ngay: </span>1.000.000 VNĐ
              </div>
            </div>
            <div class="px-2">
              <button class="flex w-[200px] items-center justify-center bg-red-500 hover:bg-red-700 border-blue-500 text-white py-3 px-8 rounded-md">
                <div class="text-[20px]">MUA NGAY</div>
              </button>
            </div>
          </div>
        </div>
      </div>
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
