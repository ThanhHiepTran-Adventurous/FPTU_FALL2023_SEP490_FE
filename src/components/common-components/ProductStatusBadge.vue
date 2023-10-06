<script setup>
import { ProductStatus } from '@/common/contract';

const props = defineProps({
    status: {
        type: String,
        default: ProductStatus.ACTIVE.value
    }
})

</script>

<template>
    <span v-if="status === ProductStatus.ACTIVE.value" class="bg-gray-100 text-gray-800 text-xs font-medium font-semibold mr-2 px-2.5 py-0.5 rounded">{{ ProductStatus.ACTIVE.label }}</span>
    <span v-if="status === ProductStatus.APPROVING.value" class="bg-indigo-100 text-indigo-800 text-xs font-medium font-semibold mr-2 px-2.5 py-0.5 rounded">{{ ProductStatus.APPROVING.label }}</span>
    <span v-if="status === ProductStatus.REJECTED.value" class="bg-red-100 text-red-800 text-xs font-medium font-semibold mr-2 px-2.5 py-0.5 rounded">{{ ProductStatus.REJECTED.label }}</span>
    <span v-if="status === ProductStatus.ON_SELL.value" class="bg-green-100 text-green-800 text-xs font-medium font-semibold mr-2 px-2.5 py-0.5 rounded">{{ ProductStatus.ON_SELL.label }}</span>
    <span v-if="status === ProductStatus.INACTIVE.value" class="bg-green-100 text-green-800 text-xs font-medium font-semibold mr-2 px-2.5 py-0.5 rounded">{{ ProductStatus.INACTIVE.label }}</span>
    <span v-if="status === ProductStatus.SOLD.value" class="bg-green-100 text-green-800 text-xs font-medium font-semibold mr-2 px-2.5 py-0.5 rounded">{{ ProductStatus.SOLD.label }}</span>
    <span v-if="status === ProductStatus.NO_AUCTIONEER.value" class="bg-purple-100 text-purple-800 text-xs font-medium font-semibold mr-2 px-2.5 py-0.5 rounded">{{ ProductStatus.NO_AUCTIONEER.label }}</span>
</template>