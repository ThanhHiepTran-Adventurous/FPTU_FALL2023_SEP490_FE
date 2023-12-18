<script setup>
import { OrderStatus } from '@/common/contract'
const props = defineProps({
  status: {
    type: String,
    default: OrderStatus.NEW,
  },
})
</script>

<template>
  <div
    v-if="status === OrderStatus.DONE.value"
    class="w-max bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-blue-400">
    Thành công
  </div>

  <div
    v-if="status !== OrderStatus.DONE.value"
    class="w-max bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-red-400">
    Chưa hoàn thành
  </div>
</template>