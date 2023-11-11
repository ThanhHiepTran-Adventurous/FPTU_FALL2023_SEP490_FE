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
import SideBarLayout from '../../SideBarLayout.vue'
import TwoOptionsTab from '@/components/TwoOptionsTab.vue'
import { AuctionModelType } from '@/common/contract'

const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Đã mua',
    to: '/bought',
    disabled: true,
  },
]

const auctionWins = ref([])
const auctionWinFiltered = ref([])

const filterData = () => {
  auctionWinFiltered.value = auctionWins?.value?.filter(
      v => v.informationAuction.modelType === AuctionModelType.immediate && v.informationAuction.product.status !== 'PAID',
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
    <div class="mt-3 mb-3 container mx-auto">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
    <SideBarLayout :cur-tab="buyerTabs.bought.value">
      <div class="bg-white container mx-auto rounded">
        <div class="mb-2 mx-3 pt-3">
          <div class="flex items-center gap-5">
            <TwoOptionsTab
              immediate-option-nav="/bought/immediate"
              intermediate-option-nav="/bought/intermediate"
              :cur-tab="AuctionModelType.immediate"
            />
            <div class="w-full">
              <SearchInput placeholder="       Search a product" addOnInputClass="w-full" />
            </div>
          </div>
        </div>

        <div class="bg-white grid grid-cols-3 gap-2 pt-6 pb-5 w-full px-3">
          <div v-for="auction in auctionWinFiltered" :key="auction.id"
            class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="pl-2">
              <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
                :src="imageHelper.getPrimaryImageFromList(auction.informationAuction.product.imageUrls)" alt="" />
            </div>
            <div class="flex flex-col justify-between p-4 leading-normal">
              <div class="text-xl font-semibold mb-1 tracking-tight text-gray-900 dark:text-white">
                {{ auction.informationAuction.product.name }}
              </div>
              <AuctionType :type="auction.informationAuction.modelType" />
              <div class="font-normal text-gray-700 dark:text-gray-400 mt-6 flex items-center">
                <span>Giá đạt được: </span>
                <span class="text-blue-600 text-2xl font-semibold ml-3">{{ formatCurrency(auction.finalPrice) }}</span>
              </div>
              <div class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                Đạt được lúc:
                <span class="text-blue-600">{{ moment.utc(auction.winAt).format('DD/MM/YYYY HH:mm:ss') }}</span>
              </div>
              <div
                class="bg-blue-600 text-white rounded-lg px-6 py-2 flex items-center !w-[180px]">
                <div>
                  <Icon icon="ic:outline-chat" class="text-[24px] mr-3" />
                </div>
                <div class="text-lg">Liên hệ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideBarLayout>
    <!-- Main section -->
  </div>
</template>
