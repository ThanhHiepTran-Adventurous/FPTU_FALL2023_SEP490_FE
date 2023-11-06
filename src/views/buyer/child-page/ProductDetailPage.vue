<script setup>
import ListProductImage from '@/components/product-detail/ListProductImage.vue'
import ProductInfo from '@/components/product-detail/ProductInfo.vue'
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import AuctionHistoryBid from '@/components/product-detail/AuctionHistoryBid.vue'
import ItemBox from '@/components/common-components/item-box/ItemBox.vue'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import auctionService from '@/services/auction.service'
import moment from 'moment'
import toastOption from '@/utils/toast-option'
import { Carousel } from 'flowbite-vue'

const route = useRoute()
const router = useRouter()
const convertedImages = ref([])
const bidHistoryInfo = ref([])
const numOfUsers = ref(0)
const numOfBids = ref(0)

let isFirstTime = true
let interval

const auction = ref(null)

const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Đấu giá',
    to: '/auctions',
    disabled: false,
  },
  {
    text: 'Áo ba lỗ',
    to: '/product-detail',
    disabled: true,
  },
]

const fetchDetail = async () => {
  const auctionDetailData = await auctionService.getAuctionDetail(route.params['id'])
  const autionData = auction.value
  auction.value = { ...autionData, ...auctionDetailData.data, numOfUsers: numOfUsers.value }
  convertedImages.value =
    auction.value?.product?.imageUrls.map(url => ({
      src: url,
      alt: 'Image Alt Text', // You can set the alt text as per your requirements
    })) || []
  console.log(convertedImages.value)
}
const fetchBidHistory = async () => {
  const response = await auctionService.getHistoryBid(route.params['id'])
  const data = response.data
  numOfUsers.value = data.bidders || 0
  numOfBids.value = data.bids || 0

  const newData = data.informationBidderDTOS
    ? data.informationBidderDTOS
        .map(d => {
          const isExisted = bidHistoryInfo.value.filter(
            inf => inf.bidAmount === d.bidAmount && inf.idBidder === d.idBidder,
          )
          const isNew = !(isExisted && isExisted.length > 0)
          return {
            idBidder: d.idBidder,
            bidAmount: d.bidAmount,
            createAt: moment.utc(d.bidTime).format('DD/MM/YYYY HH:mm:ss'),
            bidType: d.auctionType,
            isNew: isFirstTime ? false : isNew,
          }
        })
        .sort((d1, d2) => {
          return d2.bidAmount - d1.bidAmount
        })
    : []
  bidHistoryInfo.value = [...newData]
  if (bidHistoryInfo.value.length > 0) {
    const topBidderData = bidHistoryInfo.value[0]
    const latestBidderInfo = {
      identifier: topBidderData.idBidder,
      createdAt: topBidderData.createAt,
    }
    if (auction.value && auction.value.latestBidderInfo) {
      auction.value.latestBidderInfo.identifier = latestBidderInfo.identifier
      auction.value.latestBidderInfo.createdAt = latestBidderInfo.createdAt
    } else {
      auction.value = { ...auction.value, latestBidderInfo }
    }
    auction.value.highestPrice = topBidderData.bidAmount
  }
}

const fetchPageData = async () => {
  await fetchBidHistory()
  isFirstTime = false
  fetchDetail()
}
const onBuyNowSuccess = () => {
  toastOption.toastSuccess('Mua ngay thành công')
  router.push('/bought')
}

onMounted(async () => {
  fetchPageData()

  // NEED TO REPLACE SET INTERVAL WITH FIREBASE MESSAGE TRIGGER!!!!!
  interval = setInterval(() => {
    fetchBidHistory()
  }, 10000)
})

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<template>
  <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xxl lg:py-16 lg:px-6">
      <Breadcrumb :items="breadcrumbItems" />
      <div class="grid gap-8 lg:grid-cols-2">
        <article class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div>
            <div>
              <ProductInfo
                :auction-info="auction"
                @place-bid-success="fetchPageData()"
                @buy-now-success="onBuyNowSuccess()" />
              <ListProductImage :images="auction?.product?.imageUrls" />
            </div>
          </div>
        </article>
        <article class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div>
            <AuctionHistoryBid :auctionHistory="bidHistoryInfo" :numOfUsers="numOfUsers" :numOfBids="numOfBids" />
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
