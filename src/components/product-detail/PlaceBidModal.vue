<script setup>
import auctionService from "@/services/auction.service";
import formatCurrency from "@/utils/currency-output-formatter";
import { computed, onMounted, ref } from "vue"
import CurrencyInput from "../common-components/CurrencyInput.vue";
import currencyFormatter from "@/utils/currencyFormatter";
import { useUserStore } from "@/stores/user.store";
import ErrorMessage from "../common-components/ErrorMessage.vue";
import Validator from "@/utils/validator"
import toastOption from "@/utils/toast-option";

const emit = defineEmits(['placeBidSuccess', 'placeAutoAuctionSuccess', 'placeError', 'modalCancel', 'closeModal'])

const props = defineProps([
  'startPrice',
  'highestPrice',
  'jump',
  'buyNowPrice',
  'auctionId',
  'autoAuction',
  'minimumOfAuctioneers'
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
  deltaPrice: '',
})
const autoAuctionErrorState = ref({
  maxPrice: '',
  deltaTime: '',
  deltaPrice: '',
})
const manualAuctionErrorState = ref('')

const resetErrorState = () => {
  autoAuctionErrorState.value = {
    maxPrice: '',
    deltaTime: '',
    deltaPrice: '',
  }
  manualAuctionErrorState.value = ''
}

const resetAllState = () => {
  autoAuctionData.value.maxPrice = ''
  autoAuctionData.value.deltaTime = ''
  autoAuctionData.value.deltaPrice = ''
  placebidPrice.value = ''
}

const validateManual = () => {
  const placebidValue = currencyFormatter.fromStyledStringToNumber(placebidPrice.value)
  if(placebidValue <= props.highestPrice){
    manualAuctionErrorState.value = 'Giá bạn đặt phải lớn hơn giá cao nhất hiện tại'
    return false
  }
  if(placebidValue < props.highestPrice + props.jump){
    manualAuctionErrorState.value = 'Bước nhảy phải lớn hơn bước nhảy tối thiểu'
    return false
  }
  if(placebidValue >= props.buyNowPrice){
    manualAuctionErrorState.value = 'Giá bạn đặt phải nhỏ hơn giá mua ngay, nếu bạn muốn mua ngay có thể quay lại và chọn \'Mua ngay\''
    return false
  }
  return true
}
const validateAutoContainsError = () => {
  const maxPriceValue = currencyFormatter.fromStyledStringToNumber(autoAuctionData.value.maxPrice)
  const deltaPrice = currencyFormatter.fromStyledStringToNumber(autoAuctionData.value.deltaPrice)

  let isError = false
  if(maxPriceValue < props.highestPrice + props.jump){
    autoAuctionErrorState.value.maxPrice = 'Giá cao nhất có thể đặt không được thấp hơn giá cao nhất hiện tại cộng với bước nhảy tối thiểu'
    isError = true
  }
  if(maxPriceValue > props.buyNowPrice){
    autoAuctionErrorState.value.maxPrice = 'Giá cao nhất có thể đặt không được lớn hơn giá mua ngay'
    isError = true
  }
  if(!Validator.stringIsIntegerAndBiggerThanOrEqualZeroValidator(autoAuctionData.value.deltaTime)){
    autoAuctionErrorState.value.deltaTime = 'Thời gian phải là một số nguyên lớn hơn hoặc bằng 0'
    isError = true
  }
  if(deltaPrice < props.jump){
    autoAuctionErrorState.value.deltaPrice = 'Bước nhảy bạn cấu hình phải lớn hơn hoặc bằng bước nhảy của phiên đấu giá'
    isError = true
  }
  if(deltaPrice > props.buyNowPrice){
    autoAuctionErrorState.value.deltaPrice = 'Bước nhảy bạn cấu hình không được lớn hơn giá mua ngay'
    isError = true
  }

  return isError

}

const onAuctionSubmit = async () => {
  resetErrorState()
  if(!validateManual()){
    return
  }
  emit('closeModal')
  const toastId = toastOption.toastLoadingMessage('Đang tiến hành đặt đấu giá...')
  auctionService.placeBidManual(props.auctionId, currencyFormatter.fromStyledStringToNumber(placebidPrice.value))
  .then(_ => {
    toastOption.updateLoadingToast(toastId, 'Đặt giá thành công', false)
    emit("placeBidSuccess")
  })
  .catch(_ => {
    toastOption.updateLoadingToast(toastId, 'Có lỗi khi đặt giá, bạn hãy thử tải lại trang và thử lại', true)
    emit("placeError")
  })
  .finally(() => {
    resetAllState()
  })
}

const getPayloadFromFormState = () => {
  return {
    maxPrice : currencyFormatter.fromStyledStringToNumber(autoAuctionData.value.maxPrice),
    deltaTime : autoAuctionData.value.deltaTime * 60000,
    deltaPrice : currencyFormatter.fromStyledStringToNumber(autoAuctionData.value.deltaPrice),
  }
}

const onUpdateAutoAuctionSubmit = async () => {
  resetErrorState()
  if(validateAutoContainsError()){
    return
  }
  
  emit('closeModal')

  const payload = getPayloadFromFormState()

  const toastId = toastOption.toastLoadingMessage('Đang tiến hành đặt đấu giá tự động...')
  auctionService.updateAutoBid(preAutoAuctionData.value.id, payload)
    .then(_ => {
      toastOption.updateLoadingToast(toastId, 'Đặt giá tự động thành công', false)
      emit("placeAutoAuctionSuccess")
    })
    .catch(_ => {
      toastOption.updateLoadingToast(toastId, 'Có lỗi khi đặt giá, bạn hãy thử tải lại trang và thử lại', true)
      emit("placeError")
    })
    .finally(() => {
      resetAllState()
    })
}

const onAutoAuctionSubmit = async () => {
  resetErrorState()
  if(validateAutoContainsError()){
    return
  }

  emit('closeModal')

  const payload = getPayloadFromFormState()

  const toastId = toastOption.toastLoadingMessage('Đang tiến hành cập nhật đấu giá tự động...')
  auctionService.placeAutoBid(props.auctionId, payload)
  .then(_ => {
    toastOption.updateLoadingToast(toastId, 'Cập nhật đấu giá giá tự động thành công', false)
    emit("placeAutoAuctionSuccess")
  })
  .catch(_ => {
    toastOption.updateLoadingToast(toastId, 'Có lỗi khi đặt giá, bạn hãy thử tải lại trang và thử lại', true)
    emit("placeError")
  })
  .finally(() => {
    resetAllState()
  })
}

const onCancelClick = () => {
  resetAllState()
  resetErrorState()
  emit('modalCancel')
}

const fetchAutoAuctionData = async () => {
  const response = await auctionService.getAutoBidDetail(props.auctionId)
  if(response.data && response.data.length > 0){
    preAutoAuctionData.value = response.data[0]
    autoAuctionData.value.deltaPrice = currencyFormatter.fromNumberToStyledString(preAutoAuctionData.value.deltaPrice)
    autoAuctionData.value.deltaTime = parseInt(preAutoAuctionData.value.deltaTime)/60000
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
            <div class="flex items-center py-1">
              <div class="font-semibold w-[250px]">Số người đấu giá tối thiểu: </div><div class="text-xl text-blue-600 font-semibold">{{ minimumOfAuctioneers ? minimumOfAuctioneers : "N/A"}}</div>
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
          <ErrorMessage :text="manualAuctionErrorState" />
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
          <label class="block text-gray-700 text-sm font-bold mb-2" for="highestPrice">
            GIÁ CAO NHẤT CÓ THỂ ĐẶT:
          </label>
          <CurrencyInput v-model="autoAuctionData.maxPrice" placeholder="Giá cao nhất có thể đặt" />
          <ErrorMessage :text="autoAuctionErrorState.maxPrice" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="delayTime">
            KHOẢNG THỜI GIAN DELAY ĐẶT LẠI GIÁ SAU KHI CÓ GIÁ MỚI (phút):
          </label>
          <input 
            v-model="autoAuctionData.deltaTime"
            type="number"
            class="bg-white focus:bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full h-10 py-1 pl-6"
            name="delayTime"
            id="delayTime"
            placeholder="Thời gian delay đặt lại giá theo phút"
          />
          <ErrorMessage :text="autoAuctionErrorState.deltaTime" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
            BƯỚC NHẢY:
          </label>
          <CurrencyInput v-model="autoAuctionData.deltaPrice" placeholder="Bước nhảy" />
          <ErrorMessage :text="autoAuctionErrorState.deltaPrice" />
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