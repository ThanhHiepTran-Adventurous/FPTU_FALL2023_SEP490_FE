<script setup>
import ItemBox from '@/components/common-components/item-box/ItemBox.vue'
import auctionService from '@/services/auction.service'
import { onMounted, ref, computed, watch } from 'vue'
import imageHelper from '@/utils/image-helper'

const auctions = ref([])

const fetchAuctions = async () => {
  const auctionsData = await auctionService.getAllActiveAuctions('status:IN_PROCESS', '')
  if(auctionsData.data){
    auctions.value = auctionsData.data.slice(0, 4)
  }
}
onMounted(async () => {
  fetchAuctions()
})
</script>
<template>
  <div class="bg-white">
    <div class="container mx-auto py-2">
      <div class="tt-block-title py-2">
        <h1 class="text-3xl uppercase text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          <span class="font-extrabold">Popular</span>
          Products
        </h1>
      </div>
      <div class="flex justify-center">
        <ItemBox
          v-for="auction in auctions"
          :key="auction.id"
          :product-name="auction.product?.name"
          :main-image="imageHelper.getPrimaryImageFromList(auction.product?.imageUrls)"
          :secondary-image="imageHelper.getSecondaryImageFromList(auction.product?.imageUrls)"
          :floor-price="auction.highestPrice ? auction.highestPrice : auction.startPrice"
          :time-remain="auction.timeLeft"
          :item-id="auction.id"
          :auction-type="auction.modelType"
          class="border border-gray-300 rounded-lg shadow p-4 mx-2 mb-5" />
      </div>
    </div>
  </div>
</template>
