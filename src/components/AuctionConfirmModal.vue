<script setup>
import OuterModal from './common-components/OuterModal.vue';
import Button from './common-components/Button.vue';
import { AuctionModelType } from '@/common/contract';
import { useSystemStore } from '@/stores/system-config.store';
import { computed } from 'vue';

const props = defineProps(['modelType'])
const systemStore = useSystemStore()

const emit = defineEmits(['confirm', 'decline'])

const onModalDecline = () => {
  emit('decline')
}
const onModalConfirm = () => {
  emit('confirm')
}

const profit = computed(() => {
    return systemStore.PercentageProfit
})
</script>

<template>
  <OuterModal
    :widthClass="'w-[600px]'"
    :hasOverFlowVertical="true"
    :hasButton="true"
    title="Xác nhận"
    @decline-modal="onModalDecline()"
    @confirm-modal="onModalDecline()">
    <div class="mb-4">
      <div class="text-black text-lg flex flex-col">
        <div>
            Nếu bạn chọn hình thức bán <span class="font-semibold text-blue-500">Tự trao đổi</span>
            , bạn sẽ phải trả một khoản phí tương đương <span class="font-semibold text-red-500">{{ profit }}%</span> cho hệ thống. Với hình thức <span class="font-semibold text-blue-500">Tự trao đổi</span> sau <span class="font-semibold text-red-500">{{ profit }}</span> ngày nếu bạn không thanh toán cho hệ thống, 
              bạn sẽ bị 1 lần cảnh cáo, và cuộc đấu giá đó sẽ bị huỷ. 
            <br /><br/>Nếu bạn chọn hình thức bán <span class="font-semibold text-green-500">Trung gian qua hệ thống</span>, sau khi đấu giá, 
            người mua sẽ thanh toán toàn bộ qua hệ thống. Sau đó bạn sẽ tạo yêu cầu giao hàng cho người mua, nếu bạn không tạo thì sau 1 ngày hệ thống sẽ
            tự động tạo cho bạn. Nếu sau đó người mua không có yêu cầu trả hàng, 
            hệ thống sẽ trả cho bạn số tiền bán được trừ đi <span class="font-semibold text-red-500">{{ profit }}%</span>
            , số tiền đó sẽ được trả cho hệ thống để duy trì.<br /><br />
             Với trường hợp khoảng phí dưới <span class="font-semibold text-red-500">10.000 đ</span>, hệ thống sẽ lấy <span class="font-semibold text-red-500">10.000 đ</span>.
              <br /><br />Bạn đang chọn hình thức bán <span class="font-semibold" :class="modelType === AuctionModelType.intermediate ? 'text-green-500' : 'text-blue-500'">{{ modelType === AuctionModelType.intermediate ? 'Trung gian qua hệ thống' : 'Tự trao đổi'}}</span>, bạn có chắc chắn không?
        </div>
      </div>
    </div>
    <template #button>
      <div>
        <button
          @click="onModalDecline()"
          class="bg-white hover:!bg-blue-200 text-black font-bold py-2 px-4 rounded border focus:outline-none focus:shadow-outline"
          type="button">
          Đóng
        </button>
      </div>
      <div>
        <button
          @click="onModalConfirm()"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border focus:outline-none focus:shadow-outline"
          type="button">
          Xác nhận
        </button>
      </div>
    </template>
  </OuterModal>
</template>