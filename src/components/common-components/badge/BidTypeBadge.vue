<script setup>
import { BidType } from '@/common/contract';

const props = defineProps({
    typeBid: {
        type: String,
        default: BidType.MANUAL.value
    }
})

</script>

<template>
    <span v-if="typeBid === BidType.MANUAL.value" class="bg-blue-100 text-blue-800 text-xs font-medium font-semibold mr-2 px-2.5 py-0.5 rounded">{{ BidType.MANUAL.label }}</span>
    <span v-if="typeBid === BidType.AUTO.value" class="bg-purple-100 text-purple-800 text-xs font-medium font-semibold mr-2 px-2.5 py-0.5 rounded">{{ BidType.AUTO.label }}</span>
    <span v-if="typeBid === BidType.DIRECT.value" class="bg-red-100 text-red-800 text-xs font-medium font-semibold mr-2 px-2.5 py-0.5 rounded">{{ BidType.DIRECT.label }}</span>
</template>