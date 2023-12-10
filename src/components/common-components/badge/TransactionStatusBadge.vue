<script setup>
import { TransactionStatus } from '@/common/contract'
const props = defineProps({
  status: {
    type: String,
    default: TransactionStatus.PENDING.value,
  },
})
</script>

<template>
  <div
    v-if="status === TransactionStatus.SUCCESS.value"
    class="w-max bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-blue-400">
    Thành công
  </div>

  <div
    v-if="status === TransactionStatus.PENDING.value"
    class="w-max bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-red-400">
    Đang đợi
  </div>

  <div
    v-if="status === TransactionStatus.FAIL.value"
    class="w-max bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-red-400">
    <!-- {{ TransactionStatus.FAIL.label }} -->
    Thất bại
  </div>
</template>