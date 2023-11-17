<script setup>
import OuterModal from './common-components/OuterModal.vue';
import Button from './common-components/Button.vue'
import { ref } from 'vue'

const reason = ref('')

const emit = defineEmits(['confirm', 'decline'])

const onModalDecline = () => {
  emit('decline')
}
const onModalConfirm = () => {
  emit('confirm', reason.value)
}

</script>

<template>
  <OuterModal
    :widthClass="'w-[900px]'"
    :hasOverFlowVertical="true"
    :hasButton="true"
    title="Từ chối xử lý tố cáo"
    @decline-modal="onModalDecline()"
    @confirm-modal="onModalDecline()">
    <div class="form mb-4">
      <div class="text-black text-lg flex flex-col">
        <label for="description" class="font-bold mt-4 mb-2">Lí do</label>
        <textarea
          v-model="reason"
          class="appearance-none w-full border border-gray-200 p-2 h-40 focus:outline-none focus:border-gray-500"
          placeholder="Enter your description"></textarea>
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
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded border focus:outline-none focus:shadow-outline"
          type="button">
          Từ chối
        </button>
      </div>
    </template>
  </OuterModal>
</template>
