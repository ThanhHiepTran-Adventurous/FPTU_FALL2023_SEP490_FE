<script setup>
import { computed, ref } from 'vue'
import CountDown from '@/components/common-components/Countdown.vue'
import PlaceBidModal from './PlaceBidModal.vue'
import Modal from '../common-components/Modal.vue'
import toastOption from '@/utils/toast-option'
import auctionService from '@/services/auction.service'
import { useGlobalStore } from '@/stores/global.store'
import formatCurrency from '@/utils/currency-output-formatter'
import moment from 'moment'
import DateHelper from '@/utils/date-helper'
import AuctionType from '../common-components/badge/AuctionType.vue'
import userService from '@/services/user.service'
import { useUserStore } from '@/stores/user.store'
import ListProductImage from '@/components/product-detail/ListProductImage.vue'

const globalStore = useGlobalStore()
const userStore = useUserStore()

const isModalVisible = ref(false)
const isBuyNowModalVisible = ref(false)
const autoAuctionInfo = ref(null)

const emit = defineEmits(['placeBidSuccess', 'buyNowSuccess'])

const props = defineProps({
  auctionInfo: Object,
})

const deadlineInMilis = computed(() => {
  if (props.auctionInfo?.endDate) {
    const date = new Date(props.auctionInfo.endDate)
    return date.getTime() + date.getTimezoneOffset() * 60000
  }
})

const onPlaceBidMannualSuccess = () => {
  isModalVisible.value = false
  toastOption.toastSuccess('Đặt giá thành công')
  emit('placeBidSuccess')
}
const onPlaceBidAutoSuccess = () => {
  isModalVisible.value = false
  toastOption.toastSuccess('Đặt giá tự động thành công')
  emit('placeBidSuccess')
}
const onPlaceError = () => {
  isModalVisible.value = false
  toastOption.toastError('Có lỗi khi đặt giá, bạn hãy thử tải lại trang và thử lại')
}
const onBuyNowClick = async () => {
  //if not login, force modal login open
  if (!globalStore.isAlreadyLogin()) {
    globalStore.showLoginModal = true
    return
  }
  if (!(await userService.isAllRequiredInformationFilled(userStore.getRoleAndGetFromLocalStorageIfNotExist()))) {
    toastOption.toastError(
      'Bạn phải hoàn thiện thông tin cá nhân [Thông tin tài khoản ngân hàng] trước khi đấu giá, để tiện cho quá trình đổi trả, tố cáo.',
    )
    return
  }

  const curTimeInMilis = DateHelper.getCurDateUTCMilis()
  if (props.auctionInfo?.endDate && curTimeInMilis > moment.utc(props.auctionInfo?.endDate).valueOf()) {
    toastOption.toastError('Phiên đấu giá đã hoàn thành')
    return
  }
  isBuyNowModalVisible.value = true
}

const onCloseModal = () => {
  isModalVisible.value = false
}

const onBuyNowConfirm = () => {
  auctionService
    .buyNowBid(props.auctionInfo?.id)
    .then(_ => {
      toastOption.toastSuccess('Bạn vừa mua ngay sản phẩm này thành công')
      emit('buyNowSuccess')
    })
    .catch(_ => {
      toastOption.toastError('Quá trình mua ngay thất bại, hãy tải lại trang và thử lại')
    })
}

const onPlaceBidClick = async () => {
  //if not login, force modal login open
  if (!globalStore.isAlreadyLogin()) {
    globalStore.showLoginModal = true
    return
  }
  if (!(await userService.isAllRequiredInformationFilled(userStore.getRoleAndGetFromLocalStorageIfNotExist()))) {
    toastOption.toastError(
      'Bạn phải hoàn thiện thông tin cá nhân [Thông tin tài khoản ngân hàng] trước khi đấu giá, để tiện cho quá trình đổi trả, tố cáo.',
    )
    return
  }
  const curTimeInMilis = DateHelper.getCurDateUTCMilis()
  if (props.auctionInfo?.endDate && curTimeInMilis > moment.utc(props.auctionInfo?.endDate).valueOf()) {
    toastOption.toastError('Phiên đấu giá đã hoàn thành')
    return
  }


  isModalVisible.value = true
}
</script>

<template>
  <section class="bg-white dark:bg-gray-900">
    <div class="mx-auto max-w-screen-xxl py-2 px-2">
      <div class="grid gap-3 lg:grid-cols-2 mt-2">
        <article class="bg-white">
          <div>
            <ListProductImage :images="auctionInfo?.product?.imageUrls" />
          </div>
        </article>
        <article class="bg-white">
          <div class="">
            <Modal
              v-if="isModalVisible"
              :widthClass="'w-[900px]'"
              :hasOverFlowVertical="true"
              :hasButton="false"
              title="Tiến hành đấu giá">
              <PlaceBidModal
                :minimum-of-auctioneers="auctionInfo?.minimumAuctioneers"
                :start-price="auctionInfo?.startPrice"
                :highest-price="auctionInfo?.highestPrice"
                :jump="auctionInfo?.jump"
                :buy-now-price="auctionInfo?.buyNowPrice"
                :auction-id="auctionInfo?.id"
                :auto-aution="autoAuctionInfo"
                @place-bid-success="onPlaceBidMannualSuccess()"
                @place-auto-auction-success="onPlaceBidAutoSuccess()"
                @place-error="onPlaceError()"
                @close-modal="onCloseModal()"
                @modal-cancel="isModalVisible = false" />
            </Modal>
            <Modal
              v-if="isBuyNowModalVisible"
              widthClass="w-[900px]"
              :hasOverFlowVertical="true"
              :hasButton="true"
              button-label="Mua ngay"
              @decline-modal="isBuyNowModalVisible = false"
              @confirm-modal="onBuyNowConfirm"
              title="Xác nhận mua ngay">
              <div class="text-xl font-semibold text-blue-500">Bạn có chắc chắn mua ngay món hàng này hay không?</div>
            </Modal>

            <div class="text-3xl my-3 text-black whitespace-nowrap">{{ auctionInfo?.product?.name }}</div>
            <AuctionType :type="auctionInfo?.modelType" />

            <div class="tt-wrapper whitespace-nowrap">
              <div class="tt-countdown_box_02 mt-3 mb-2">
                <div v-if="auctionInfo?.timeLeft > 0" class="tt-countdown_inner">
                  <CountDown :coefficientSize="0.6" :deadlineInMilis="deadlineInMilis" />
                </div>
                <div v-else class="text-red-600 text-lg">&lt; Phiên đấu giá đã kết thúc ></div>
              </div>
            </div>
            <div class="tt-wrapper">
              <div class="flex w-full">
                <div class="flex flex-col w-full">
                  <div class="flex items-start mx-auto w-full mr-2">
                    <div class="w-[500px]">
                      <div class="flex items-center mb-6">
                        <span class="block mr-2 whitespace-nowrap">Hiện tại:</span>
                        <span class="text-blue-600 text-4xl font-bold block mr-2 whitespace-nowrap">
                          {{
                            auctionInfo?.highestPrice
                              ? formatCurrency(auctionInfo?.highestPrice)
                              : formatCurrency(auctionInfo?.startPrice)
                          }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center w-full mr-2 mb-3" v-if="auctionInfo?.buyNowPrice">
                    <div class="">
                      <div class="flex items-center">
                        <span class="block mr-2 whitespace-nowrap">Mua ngay:</span>
                        <span class="text-black text-2xl font-bold block mr-2 whitespace-nowrap"
                          >{{ formatCurrency(auctionInfo?.buyNowPrice) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="mt-1 mb-6">
                    {{ auctionInfo?.lastBidDetail }}
                  </div> -->
                  <div>
                    <div v-if="auctionInfo?.highestPrice" class="mt-1">
                      Đặt lần cuối bởi: {{ auctionInfo?.latestBidderInfo?.identifier }} - Lúc:
                      {{ auctionInfo?.latestBidderInfo?.createdAt }}
                    </div>
                    <div v-else class="ml-[13rem] mt-1">Hiện tại chưa có người đặt giá</div>
                  </div>
                  <div class="flex">
                    <button
                      @click="onBuyNowClick()"
                      type="button"
                      class="text-gray-900 h-14 whitespace-nowrap bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                      Mua ngay
                    </button>

                    <button
                      @click="onPlaceBidClick()"
                      type="button"
                      class="text-white whitespace-nowrap bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                      Đấu giá ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
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
