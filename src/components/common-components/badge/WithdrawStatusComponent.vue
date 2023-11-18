<script setup>
import { WithdrawRequestStatus } from '@/common/contract';
const props = defineProps({
    status: {
        type: String,
        default: WithdrawRequestStatus.PENDING.value
    }
})
</script>

<template>
    <div v-if="status === WithdrawRequestStatus.PENDING.value" class="w-max bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-blue-400">
        {{ WithdrawRequestStatus.PENDING.label }}
    </div>

    <div v-if="status === WithdrawRequestStatus.SUCCESS.value" class="w-max bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-red-400">
        {{ WithdrawRequestStatus.SUCCESS.label }}
    </div>
</template>