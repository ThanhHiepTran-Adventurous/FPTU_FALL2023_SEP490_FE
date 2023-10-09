<script setup>
import { computed, ref } from 'vue';
import CountDown from '@/components/common-components/Countdown.vue';
import { Icon } from '@iconify/vue';
import Rating from 'vue-star-rating';
import PlaceBidModal from './PlaceBidModal.vue';
import Modal from '../common-components/Modal.vue';
import toastOption from '@/utils/toast-option';
import auctionService from '@/services/auction.service';
import { useGlobalStore } from '@/stores/global.store';
import formatCurrency from '@/utils/currency-formatter';

const globalStore = useGlobalStore();
const isModalVisible = ref(false);
const autoAuctionInfo = ref(null);

const emit = defineEmits(['placeBidSuccess', 'buyNowSuccess'])

const props = defineProps({
  auctionInfo: Object,
});

const deadlineInMilis = computed(() => {
  if(props.auctionInfo?.endDate){
    const date = new Date(props.auctionInfo.endDate)
    return date.getTime() + date.getTimezoneOffset() * 60000
  }
})

const onPlaceBidMannualSuccess = () => {
  isModalVisible.value = false
  toastOption.toastSuccess("Đặt giá thành công")
  emit('placeBidSuccess')
}
const onPlaceBidAutoSuccess = () => {
  isModalVisible.value = false
  toastOption.toastSuccess("Đặt giá tự động thành công")
  emit('placeBidSuccess')
}
const onPlaceError = () => {
  isModalVisible.value = false
  toastOption.toastError("Có lỗi khi đặt giá, bạn hãy thử tải lại trang và thử lại")
}

const onBuyNowClick = () => {
  //if not login, force modal login open
  if(!globalStore.isAlreadyLogin()){
    globalStore.showLoginModal = true
    return
  }

  auctionService.buyNowBid(props.auctionInfo?.id)
  .then(_ => {
    toastOption.toastSuccess("Bạn vừa mua ngay sản phẩm này thành công")
    emit("buyNowSuccess")
  })
  .catch(_ => {
    toastOption.toastError("Quá trình mua ngay thất bại, hãy tải lại trang và thử lại")
  })
}

const onPlaceBidClick = async () => {
  //if not login, force modal login open
  if(!globalStore.isAlreadyLogin()){
    globalStore.showLoginModal = true
    return
  }

  isModalVisible.value = true
}

</script>

<template>
  <div class="tt-product-single-info">
    <Modal v-if="isModalVisible" :widthClass="'w-[900px]'" :hasOverFlowVertical=true :hasButton=false
    :title="'Tiến hành đấu giá'">
      <PlaceBidModal
      :start-price="auctionInfo?.startPrice"
      :highest-price="auctionInfo?.highestPrice" 
      :jump="auctionInfo?.jump" 
      :buy-now-price="auctionInfo?.buyNowPrice" 
      :auction-id="auctionInfo?.id"
      :auto-aution="autoAuctionInfo"
      @place-bid-success="onPlaceBidMannualSuccess()"
      @place-auto-auction-success="onPlaceBidAutoSuccess()"
      @place-error="onPlaceError()"
      @modal-cancel="isModalVisible = false"
      />
    </Modal>
    <div class="flex">
      <ul>
        <li
          class="bg-blue-100 !text-blue-800 mt-2 w-max text-sm font-medium mr-2 px-2.5 py-1 rounded text-center flex items-center">
          <span class="mr-3">
            <Icon icon="mdi:fire" class="text-red-500 text-[24px]" />
          </span>
          {{ auctionInfo?.numOfUsers }} người tham gia đấu giá
        </li>
      </ul>
    </div>
    <div class="text-3xl my-3 text-black">{{ auctionInfo?.product?.name }}</div>
    <div class="flex items-center">
      <div class="pr-3 border-r-[1px]">
        <Rating :rating="4.5" :fixed-point="1" :round-start-rating="false" :show-rating="false" :star-size="19" />
      </div>
      <div class="ml-3 bg-green-100 !text-green-800 text-sm font-medium mr-2 px-2.5 py-1 rounded">Còn tem</div>
      <div class="bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 px-2.5 py-1 rounded">Còn bill</div>
      <div class="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-1 rounded">Đổi trả</div>
    </div>
    <div class="mt-4 pr-4">
      {{ auctionInfo?.product?.description }}
    </div>
    <div class="tt-wrapper">
      <div class="tt-countdown_box_02">
        <div class="tt-countdown_inner">
          <CountDown :coefficientSize="0.7" :deadlineInMilis="deadlineInMilis" />
        </div>
      </div>
    </div>
    <div class="tt-wrapper">
      <div class="flex gap-3 w-full">
        <div class="flex flex-col gap-8 w-full">
          <div class="flex items-start mx-auto gap-3 w-full border-b-[2px] pb-8 mr-2">
            <div class="w-[500px]">
              <div class="text-2xl font-bold text-blue-600 flex">
                <span class="text-blue-600 w-[200px] block mr-3">Hiện tại: </span>{{ auctionInfo?.highestPrice ? formatCurrency(auctionInfo?.highestPrice) : formatCurrency(auctionInfo?.startPrice) }}
              </div>
              <div v-if="auctionInfo?.highestPrice">
                Đặt lần cuối bởi: {{ auctionInfo?.latestBidderInfo?.identifier }} - Lúc: {{ auctionInfo?.latestBidderInfo?.createdAt }}
              </div>
            </div>
            <div class="px-2">
              <button
                @click="onPlaceBidClick()"
                class="flex w-[200px] font-semibold items-center justify-center bg-white hover:bg-red-700 border-blue-500 text-blue-700 border-[1px] py-3 px-8 rounded-md">
                <div class="text-[20px]">Đấu giá ngay</div>
              </button>
            </div>
          </div>
          <div class="flex items-center gap-3 w-full mr-2 pb-8" v-if="auctionInfo?.buyNowPrice">
            <div class="w-[500px]">
              <div class="text-2xl flex font-bold text-red-500">
                <span class="text-blue-600 block w-[200px] mr-3">Giá mua ngay: </span>{{ formatCurrency(auctionInfo?.buyNowPrice) }}
              </div>
            </div>
            <div class="px-2">
              <button
                @click="onBuyNowClick()"
                class="flex w-[200px] items-center justify-center bg-red-500 hover:bg-red-700 border-blue-500 text-white py-3 px-8 rounded-md">
                <div class="text-[20px]">MUA NGAY</div>
              </button>
            </div>
          </div>
        </div>
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
}</style>
