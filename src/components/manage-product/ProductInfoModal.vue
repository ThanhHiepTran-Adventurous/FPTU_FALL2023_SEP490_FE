<script setup>
import moment from 'moment'
import { computed, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { initFlowbite } from 'flowbite'
import Dropdown from '@/components/common-components/Dropdown.vue'
import AuctionService from '@/services/auction.service'
import CurrencyInput from '../common-components/CurrencyInput.vue'
import currencyFormatter from '@/utils/currencyFormatter'
import toastOption from '@/utils/toast-option'
import { ProductStatus } from '@/common/contract'
import {
  immediateMessage,
  intermediateMessage,
  selectedDefaultDuration,
  durationData,
} from '@/common/commonStaticState'
import ErrorMessage from '../common-components/ErrorMessage.vue'
import AuctionConfirmModal from '../AuctionConfirmModal.vue'
import Modal from '../common-components/Modal.vue'

const tableTab = 'table'
const formTab = 'form'

const emit = defineEmits(['sendSuccess', 'sendError', 'justSubmitted'])

const duration = ref(selectedDefaultDuration)
const durationInput = ref(1)

const props = defineProps({
  product: {
    required: true,
  },
})

const canSendRequest = computed(() => {
  return props.product?.status === ProductStatus.ACTIVE.value
})

const formData = ref({
  startPrice: '',
  jump: '',
  buyNowPrice: '',
  modelType: 0,
  hoursOfDuration: 0,
  minutesOfDuration: 0,
  minimumAuctioneers: '',
})

const currentTab = ref(tableTab)
const isConfirmModalActive = ref(false)

const showTableTab = () => {
  currentTab.value = tableTab
}

const showFormTab = () => {
  currentTab.value = formTab
}
const manualAuctionErrorState = ref({
  startPrice: '',
  buyNowPrice: '',
  modelType: '',
  jump: '',
  minimumAuctioneers: '',
})
const resetErrorState = () => {
  manualAuctionErrorState.value = {
    startPrice: '',
    buyPrice: '',
    modelType: '',
    jump: '',
    minimumAuctioneers: '',
  }
}
const validateManual = () => {
  let result = true
  if (!formData.value.startPrice) {
    manualAuctionErrorState.value.startPrice = 'Vui lòng nhập giá khởi điểm'
    result = false
  }
  if (!formData.value.buyNowPrice) {
    manualAuctionErrorState.value.buyNowPrice = 'Vui lòng nhập giá mua ngay'
    result = false
  }
  if (!formData.value.modelType) {
    manualAuctionErrorState.value.modelType = 'Vui lòng chọn hình thức mua bán'
    result = false
  }
  if (!formData.value.minimumAuctioneers) {
    manualAuctionErrorState.value.minimumAuctioneers = 'Vui lòng nhập số người tham gia tối thiểu'
    result = false
  }
  if (!formData.value.jump) {
    manualAuctionErrorState.value.jump = 'Vui lòng nhập bước nhảy tối thiểu'
    result = false
  }

  return result
}
const onSubmit = () => {
  resetErrorState()
  if (!validateManual()) {
    return
  }
  isConfirmModalActive.value = true
}

const onSubmitConfirm = () => {
  const data = getPayload()
  emit('justSubmitted')
  const toastId = toastOption.toastLoadingMessage('Đang tiến hành gửi yêu cầu lên đấu giá')
  AuctionService.sendAuctionRequest(props.product.id, data)
    .then(_ => {
      emit('sendSuccess', toastId)
    })
    .catch(error => {
      emit('sendError', toastId, error)
    })
    .finally(() => {
      isConfirmModalActive.value = false
      currentTab.value = tableTab
      resetData()
    })
}

const getPayload = () => {
  const durationValue = duration.value?.value ? duration.value.value : durationInput.value
  return {
    startPrice: currencyFormatter.fromStyledStringToNumber(formData.value.startPrice) || 0,
    jump: currencyFormatter.fromStyledStringToNumber(formData.value.jump),
    buyNowPrice: currencyFormatter.fromStyledStringToNumber(formData.value.buyNowPrice) || 0,
    modelType: formData.value.modelType,
    hoursOfDuration: durationValue,
    minimumAuctioneers: formData.value.minimumAuctioneers,
  }
}

const resetData = () => {
  formData.value = {
    startPrice: '',
    jump: '',
    buyNowPrice: '',
    modelType: 0,
    hoursOfDuration: 0,
    minutesOfDuration: 0,
    minimumAuctioneers: '',
  }
  duration.value = {
    label: '3 tiếng',
    value: 3,
  }
  durationInput.value = 1
}

const onCloseModal = () => {
  resetData()
  emit('justSubmitted')
}

onMounted(() => {
  initFlowbite()
})
</script>

<template>
  <Modal
    :widthClass="'w-[900px]'"
    :hasOverFlowVertical="true"
    :hasButton="false"
    title="Thông tin"
    @decline-modal="onCloseModal"
    @confirm-modal="onCloseModal">
      <div class="bg-white rounded-lg space-y-4">
        <!-- Tab buttons -->
        <div class="flex space-x-4">
          <button
            @click="showTableTab"
            :class="{
              'bg-blue-500 hover:bg-blue-600 text-white': currentTab === tableTab,
              'bg-gray-300 hover:bg-gray-400 text-gray-600': currentTab !== tableTab,
            }"
            class="px-4 py-3 rounded-md focus:outline-none transition flex-grow">
            Chi tiết
          </button>
    
          <button
            :hidden="!canSendRequest"
            @click="showFormTab"
            :class="{
              'bg-blue-500 hover:bg-blue-600 text-white': currentTab === formTab,
              'bg-gray-300 hover:bg-gray-400 text-gray-600': currentTab !== formTab,
            }"
            class="px-4 py-3 rounded-md focus:outline-none transition flex-grow">
            Gửi Yêu Cầu Đấu Giá
          </button>
        </div>
    
        <!-- Table Tab -->
        <div :hidden="currentTab !== tableTab">
          <ul class="space-y-2 text-gray-700 pb-8 pt-4">
            <ul class="mt-2 text-gray-700">
              <li class="flex border-y py-2">
                <span class="font-bold w-50">Tên Sản Phẩm:</span>
                <span class="text-gray-700">{{ product?.name || 'N/A' }}</span>
              </li>
              <li class="flex border-b py-2">
                <span class="font-bold w-50">Ngày Khởi Tạo:</span>
                <span class="text-gray-700">{{
                  product?.createAt ? moment.utc(product?.createAt).format('DD/MM/YYYY HH:MM:ss') : 'N/A'
                }}</span>
              </li>
              <li class="flex border-b py-2">
                <span class="font-bold w-50">Trạng Thái:</span>
                <span class="text-gray-700">{{ product?.status }}</span>
              </li>
              <li class="flex border-b py-2">
                <span class="font-bold w-50">Brand:</span>
                <span class="text-gray-700">{{ product?.brand.name || 'N/A' }}</span>
              </li>
              <li class="flex border-b py-2">
                <span class="font-bold w-50">Loại Sản Phẩm:</span>
                <span class="text-gray-700">{{ product?.category.name || 'N/A' }} </span>
              </li>
              <li class="flex border-b py-2">
                <span class="font-bold w-50">Giới Thiệu :</span>
                <span class="text-gray-700 w-50">{{ product?.description }}</span>
              </li>
            </ul>
            <!-- Add more table rows as needed -->
            <div class="text-lg font-bold text-blue-500 px-8 py-8">Hình ảnh:</div>
            <div class="mb-4 w-full overflow-x-auto" v-if="product?.imageUrls.length > 0">
              <div v-for="src in product?.imageUrls" :key="src" class="inline-block mr-2 border-[1px] border-blue-500">
                <img :src="src" alt="product image" class="w-40 h-40 border-4 border-blue-500" />
              </div>
            </div>
          </ul>
        </div>
    
        <!-- Form Tab -->
        <div :hidden="currentTab !== formTab">
          <form class="bg-white rounded px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="title"> GIÁ KHỞI ĐIỂM </label>
              <CurrencyInput v-model="formData.startPrice" placeholder="" />
              <ErrorMessage :text="manualAuctionErrorState.startPrice" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="jump">
                BƯỚC NHẢY TỐI THIỂU <span class="text-red-500 text-lg">*</span>
              </label>
              <div class="w-full items-center">
                <CurrencyInput v-model="formData.jump" placeholder="" w="w-full" />
              </div>
              <ErrorMessage :text="manualAuctionErrorState.jump" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="description"> GIÁ MUA NGAY </label>
              <CurrencyInput v-model="formData.buyNowPrice" placeholder="" />
              <ErrorMessage :text="manualAuctionErrorState.buyNowPrice" />
            </div>
            <div class="mb-4 flex items-center">
              <div class="mr-[20%]">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="jump">
                  THỜI GIAN ĐẤU GIÁ <span class="text-red-500 text-lg">*</span>
                </label>
                <div class="flex gap-3 items-center">
                  <Dropdown :data="durationData" v-model="duration" class="!w-[200px]" />
                  <input
                  v-model="durationInput"
                  v-if="!duration.value"
                  type="number"
                  class="shadow appearance-none border rounded w-[20%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="duration"
                  placeholder="" />
                  <div class="block text-gray-700 text-sm font-bold">giờ</div>
                </div>
              </div>
              <div>
                <label class="block text-gray-700 text-sm font-bold mb-2" for="jump">
                  SỐ NGƯỜI TỐI THIỂU THAM GIA ĐẤU GIÁ <span class="text-red-500 text-lg">*</span>
                </label>
                <div class="flex items-center gap-3">
                  <input
                  v-model="formData.minimumAuctioneers"
                  type="number"
                  min="1"
                  class="shadow appearance-none border rounded !w-[100px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="duration"
                  placeholder="" />
                  <div class="block text-gray-700 text-sm font-bold">người</div>
                </div>
                <ErrorMessage :text="manualAuctionErrorState.minimumAuctioneers" />
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
                HÌNH THỨC MUA BÁN <span class="text-red-500 text-lg">*</span>
              </label>
              <div class="w-full flex items-center py-2">
                <div class="flex items-center gap-3 mr-[20%]">
                  <input type="radio" id="immediate" name="modelType" value="IMMEDIATE" v-model="formData.modelType" />
                  <label for="immediate" class="font-semibold text-black">TỰ TRAO ĐỔI MUA BÁN</label>
                  <button data-tooltip-target="tooltip-hover" data-tooltip-trigger="hover" type="button">
                    <Icon icon="mdi:information" class="text-[20px]" />
                  </button>
                  <div
                    id="tooltip-hover"
                    role="tooltip"
                    class="absolute !z-[1002] w-[20vw] invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                    {{ immediateMessage }}
                    <div class="tooltip-arrow" data-popper-arrow></div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <input type="radio" id="intermediate" value="INTERMEDIATE" v-model="formData.modelType" />
                  <label for="intermediate" class="font-semibold text-black">TRUNG GIAN QUA HỆ THỐNG</label>
                  <div>
                    <button data-tooltip-target="tooltip-hover-1" data-tooltip-trigger="hover" type="button">
                      <Icon icon="mdi:information" class="text-[20px]" />
                    </button>
                    <div
                      id="tooltip-hover-1"
                      role="tooltip"
                      class="absolute !z-[1002] w-[20vw] invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                      {{ intermediateMessage }}
                      <div class="tooltip-arrow" data-popper-arrow></div>
                    </div>
                  </div>
                </div>
              </div>
              <ErrorMessage :text="manualAuctionErrorState.modelType" />
            </div>
            <AuctionConfirmModal v-if="isConfirmModalActive === true" :model-type="formData.modelType" @decline="isConfirmModalActive = false" @confirm="onSubmitConfirm"/>
            <div class="flex items-center gap-3">
              <button
                @click="emit('justSubmitted')"
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button">
                Hủy
              </button>
              <button
                @click="onSubmit"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button">
                Gửi Yêu Cầu
              </button>
            </div>
          </form>
        </div>
      </div>
  </Modal>
</template>
