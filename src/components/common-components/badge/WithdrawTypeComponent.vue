<script setup>
import { WithdrawRequestType } from '@/common/contract';
const props = defineProps({
    status: {
        type: String,
        default: WithdrawRequestType.WITHDRAW.value
    }
})
</script>

<template>
    <div v-if="status === WithdrawRequestType.WITHDRAW.value" class="bg-gray-50 border border-gray-300 text-blue-600 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5">
        {{ WithdrawRequestType.WITHDRAW.label }}
    </div>

    <div v-if="status === WithdrawRequestType.REFUND_TYPE_IMMEDIATE.value" class="bg-gray-50 border border-gray-300 text-blue-600 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5">
        {{ WithdrawRequestType.REFUND_TYPE_IMMEDIATE.label }}
    </div>

    <div v-if="status === WithdrawRequestType.REFUND_TYPE_INTERMEDIATE.value" class="bg-gray-50 border border-gray-300 text-blue-600 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5">
        {{ WithdrawRequestType.REFUND_TYPE_INTERMEDIATE.label }}
    </div>
</template>