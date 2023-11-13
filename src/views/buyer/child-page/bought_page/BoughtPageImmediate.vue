<script setup>
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import auctionService from '@/services/auction.service'
import { onMounted, ref } from 'vue'
import imageHelper from '@/utils/image-helper'
import formatCurrency from '@/utils/currency-output-formatter'
import moment from 'moment'
import AuctionType from '@/components/common-components/badge/AuctionType.vue'
import SearchInput from '@/components/common-components/SearchInput.vue'
import { Icon } from '@iconify/vue'
import { buyerTabs } from '@/common/constant'
import SideBarLayout from '../../../../layouts/BuyerSideBarLayout.vue'
import TwoOptionsTab from '@/components/TwoOptionsTab.vue'
import { AuctionModelType } from '@/common/contract'
import AuctionCard from '@/components/AuctionCard.vue'

const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Thắng đấu giá',
    to: '/bought/immediate',
    disabled: true,
  },
]

const auctionWins = ref([])
const auctionWinFiltered = ref([])

const filterData = () => {
  auctionWinFiltered.value = auctionWins?.value
    ?.filter(
      v =>
        v.informationAuction.modelType === AuctionModelType.immediate && v.informationAuction.product.status !== 'PAID',
    )
    .sort((a, b) => {
      return new Date(b.winAt).getTime() - new Date(a.winAt).getTime()
    })
}
const fetchAuctionWinData = async () => {
  const response = await auctionService.getListAuctionWin()
  auctionWins.value = response.data
  auctionWinFiltered.value = JSON.parse(JSON.stringify(auctionWins.value))
  filterData()
}

onMounted(async () => {
  fetchAuctionWinData()
})
</script>

<template>
  <div class="w-full">
    <div class="pt-2 pb-2 container mx-auto">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
    <SideBarLayout :cur-tab="buyerTabs.bought.value">
      <div class="bg-white container mx-auto rounded w-full min-h-[80vh]">
        <!-- Header -->
        <div class="pt-3 px-3 pb-1 flex items-center justify-between">
          <div class="font-bold text-2xl text-black text-blue-800">Sản phẩm thắng đấu giá</div>
          <div>
            <TwoOptionsTab
              immediate-option-nav="/bought/immediate"
              intermediate-option-nav="/bought/intermediate"
              :cur-tab="AuctionModelType.immediate" />
          </div>
        </div>

        <!-- Filter -->
        <div class="mb-2 mx-3 pt-3">
          <div class="flex items-center gap-5">
            <div class="w-full">
              <SearchInput placeholder="       Search a product" addOnInputClass="w-full" />
            </div>
          </div>
        </div>

        <div class="bg-white grid grid-cols-3 gap-2 pt-6 pb-5 w-full px-3">
          <AuctionCard
            v-for="auction in auctionWinFiltered"
            :key="auction.id"
            :image-url="imageHelper.getPrimaryImageFromList(auction.informationAuction.product.imageUrls)"
            :product-name="auction.informationAuction.product.name"
            :auction-type="auction.informationAuction.modelType"
            :price="auction.finalPrice"
            :catched-at="auction.winAt"
            @action-triggered="openPaymentModel(auction.informationAuction.id)" />
        </div>
      </div>
    </SideBarLayout>
    <!-- Main section -->
  </div>
</template>
