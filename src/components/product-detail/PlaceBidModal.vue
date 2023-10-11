<script setup>
import auctionService from "@/services/auction.service";
import formatCurrency from "@/utils/currency-formatter";
import { computed, onMounted, ref, watch } from "vue"
import CurrencyInput from "../common-components/CurrencyInput.vue";
import currencyFormatter from "@/common/currencyFormatter";

const emit = defineEmits(['placeBidSuccess', 'placeAutoAuctionSuccess', 'placeError', 'modalCancel'])

const props = defineProps([
  'startPrice',
  'highestPrice',
  'jump',
  'buyNowPrice',
  'auctionId',
  'autoAuction',
])

const preAutoAuctionData = ref(null)

const isPreAutoAuctionHappen = computed(() => {
  return !!(preAutoAuctionData.value)
})

const isAutoAuctionTabShow = ref(false)

const showAutoAuctionTab = () => {
  isAutoAuctionTabShow.value = true
}
const showAuctionTab = () => {
  isAutoAuctionTabShow.value = false
}

const placebidPrice = ref('')

const autoAuctionData = ref({
  maxPrice: '',
  deltaTime: '',
  deltaPrice: '0',
})

const resetAllState = () => {
  autoAuctionData.value.maxPrice = ''
  autoAuctionData.value.deltaTime = ''
  autoAuctionData.value.deltaPrice = ''
  placebidPrice.value = ''
}

const onAuctionSubmit = () => {
  auctionService.placeBidMannual(props.auctionId, currencyFormatter.fromStyledStringToNumber(placebidPrice.value))
  .then(_ => {
    emit("placeBidSuccess")
  })
  .catch(_ => {
    emit("placeError")
  })
  .finally(() => {
    resetAllState()
  })
}

const getPayloadFromFormState = () => {
  return {
    maxPrice : currencyFormatter.fromStyledStringToNumber(autoAuctionData.value.maxPrice),
    deltaTime : currencyFormatter.fromStyledStringToNumber(autoAuctionData.value.deltaTime) * 60000,
    deltaPrice : currencyFormatter.fromStyledStringToNumber(autoAuctionData.value.deltaPrice),
  }
}

const onUpdateAutoAuctionSubmit = () => {
  const payload = getPayloadFromFormState()

  auctionService.updateAutoBid(preAutoAuctionData.value.id, payload)
    .then(_ => {
      emit("placeAutoAuctionSuccess")
    })
    .catch(_ => {
      emit("placeError")
    })
    .finally(() => {
      resetAllState()
    })
}

const onAutoAuctionSubmit = () => {
    const payload = getPayloadFromFormState()
    auctionService.placeAutoBid(props.auctionId, payload)
    .then(_ => {
      emit("placeAutoAuctionSuccess")
    })
    .catch(_ => {
      emit("placeError")
    })
    .finally(() => {
      resetAllState()
    })
}

const onCancelClick = () => {
  resetAllState()
  emit('modalCancel')
}

const fetchAutoAuctionData = async () => {
  const response = await auctionService.getAutoBidDetail(props.auctionId)
  if(response.data && response.data.length > 0){
    preAutoAuctionData.value = response.data[0]
    autoAuctionData.value.deltaPrice = currencyFormatter.fromNumberToStyledString(preAutoAuctionData.value.deltaPrice)
    autoAuctionData.value.deltaTime = currencyFormatter.fromNumberToStyledString(preAutoAuctionData.value.deltaTime)
    autoAuctionData.value.maxPrice = currencyFormatter.fromNumberToStyledString(preAutoAuctionData.value.maxPrice)
  }
}

onMounted(async () => {
  fetchAutoAuctionData()
})

</script>
<template>
<div class="bg-white rounded-lg space-y-4 mt-[-20px]">
    <div class="my-4 w-full px-8">
        <div class="font-semibold text-lg mb-2">Thông tin cần biết</div>
        <div class="rounded-lg border-[1px] border-blue-600 p-2">
            <div class="flex items-center py-1">
                <div class="font-semibold w-[250px]">Giá khởi điểm: </div><div class="text-xl text-blue-600 font-semibold">{{ startPrice ? formatCurrency(startPrice) : "N/A" }}</div>
            </div>
            <div class="flex items-center py-1">
                <div class="font-semibold w-[250px]">Giá cao nhất hiện tại: </div><div class="text-xl text-blue-600 font-semibold">{{ highestPrice ? formatCurrency(highestPrice) : "N/A" }}</div>
            </div>
            <div class="flex items-center py-1">
                <div class="font-semibold w-[250px]">Bước nhảy tối thiểu: </div><div class="text-xl text-blue-600 font-semibold">{{ formatCurrency(jump) }}</div>
            </div>
            <div class="flex items-center py-1">
                <div class="font-semibold w-[250px]">Giá mua ngay: </div><div class="text-xl text-blue-600 font-semibold">{{ buyNowPrice ? formatCurrency(buyNowPrice) : "N/A"}}</div>
            </div>
        </div>
    </div>
    <!-- Tab buttons -->
    <div class="flex space-x-4 px-8">
      <button @click="showAuctionTab()" :class="{
        'bg-blue-500 hover:bg-blue-600 text-white': !isAutoAuctionTabShow,
        'bg-gray-300 hover:bg-gray-400 text-gray-600': isAutoAuctionTabShow
      }" class="px-4 py-3 rounded-md focus:outline-none transition flex-grow">
        ĐẤU GIÁ THỦ CÔNG
      </button>

      <button @click="showAutoAuctionTab()" :class="{
        'bg-blue-500 hover:bg-blue-600 text-white': isAutoAuctionTabShow,
        'bg-gray-300 hover:bg-gray-400 text-gray-600': !isAutoAuctionTabShow
      }" class="px-4 py-3 rounded-md focus:outline-none transition flex-grow">
        ĐẤU GIÁ TỰ ĐỘNG
      </button>
    </div>

    <!-- Thủ công Tab -->
    <div :hidden="isAutoAuctionTabShow">
        <form class="bg-white rounded px-8 mb-4">
        <div class="mb-4">
          <label class="block text-lg font-semibold mb-2" for="title">
            GIÁ BẠN ĐẶT:
          </label>
          <CurrencyInput v-model="placebidPrice" placeholder="" />
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="onCancelClick()"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button">
            Hủy
          </button>
          <button @click="onAuctionSubmit()"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button">
            ĐẶT ĐẤU GIÁ
          </button>
        </div>
      </form>
    </div>

    <!-- Tự động Tab -->
    <div :hidden="!isAutoAuctionTabShow">
      <form class="bg-white rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
            GIÁ CAO NHẤT CÓ THỂ ĐẶT:
          </label>
          <CurrencyInput v-model="autoAuctionData.maxPrice" placeholder="Max price" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
            KHOẢNG THỜI GIAN DELAY ĐẶT LẠI GIÁ SAU KHI CÓ GIÁ MỚI (phút):
          </label>
          <CurrencyInput v-model="autoAuctionData.deltaTime" placeholder="Delay time in minute" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
            BƯỚC NHẢY:
          </label>
          <CurrencyInput v-model="autoAuctionData.deltaPrice" placeholder="Jump" />
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="onCancelClick()"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button">
            Hủy
          </button>
          <button @click="onAutoAuctionSubmit()" v-if="!isPreAutoAuctionHappen"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button">
            ĐẶT ĐẤU GIÁ
          </button>
          <button @click="onUpdateAutoAuctionSubmit()" v-else
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button">
            CẬP NHẬT THÔNG TIN ĐẤU GIÁ TỰ ĐỘNG
          </button>
        </div>
      </form>
    </div>
  </div>
</template>