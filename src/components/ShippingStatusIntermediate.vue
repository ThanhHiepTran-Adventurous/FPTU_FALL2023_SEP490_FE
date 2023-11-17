<script setup>
import { StatusShipRequest } from '@/common/contract';
import { Icon } from '@iconify/vue'

const props = defineProps({
    status: {
        type: String,
        default: StatusShipRequest.waitingForDelivery.value
    },
    isDense: {
        type: Boolean,
        default: true
    }
})
</script>
<template>
    <div
        v-if="status === StatusShipRequest.waitingForConfirmation.value"
        class="bg-gray-100 text-gray-800 border-[1px] border-gray-500 text-[20px] font-medium inline-flex items-center gap-2 px-2.5 py-0.5 rounded "
        :class="isDense === true ? '!text-[15px]' : ''">
        <Icon :icon="StatusShipRequest.waitingForConfirmation.icon" />
        <div>{{ StatusShipRequest.waitingForConfirmation.label }}</div>
    </div>
    <div
        v-if="status === StatusShipRequest.waitingForDelivery.value"
        class="bg-indigo-100 text-indigo-800 border-[1px] border-indigo-500 text-[20px] font-medium inline-flex items-center gap-2 px-2.5 py-0.5 rounded "
        :class="isDense === true ? '!text-[15px]' : ''">
        <Icon :icon="StatusShipRequest.waitingForDelivery.icon" />
        <div>{{ StatusShipRequest.waitingForDelivery.label }}</div>
    </div>
    <div
        v-if="status === StatusShipRequest.onDelivery.value"
        class="bg-blue-100 text-blue-800 border-[1px] border-blue-500 text-[20px] font-medium inline-flex items-center gap-2 px-2.5 py-0.5 rounded "
        :class="isDense === true ? '!text-[15px]' : ''">
        <Icon :icon="StatusShipRequest.onDelivery.icon" />
        <div>{{ StatusShipRequest.onDelivery.label }}</div>
    </div>
    <div
        v-if="status === StatusShipRequest.delivered.value"
        class="bg-green-100 text-green-800 border-[1px] border-green-500 text-[20px] font-medium inline-flex items-center gap-2 px-2.5 py-0.5 rounded "
        :class="isDense === true ? '!text-[15px]' : ''">
        <Icon :icon="StatusShipRequest.delivered.icon" />
        <div>{{ StatusShipRequest.delivered.label }}</div>
    </div>
    <div
        v-if="status === StatusShipRequest.cancelled.value"
        class="bg-red-100 text-red-800 border-[1px] border-red-500 text-[20px] font-medium inline-flex items-center gap-2 px-2.5 py-0.5 rounded "
        :class="isDense === true ? '!text-[15px]' : ''">
        <Icon :icon="StatusShipRequest.cancelled.icon" />
        <div>{{ StatusShipRequest.cancelled.label }}</div>
    </div>
    <div
        v-if="status === StatusShipRequest.returns.value"
        class="bg-red-100 text-red-800 border-[1px] border-red-500 text-[20px] font-medium inline-flex items-center gap-2 px-2.5 py-0.5 rounded "
        :class="isDense === true ? '!text-[15px]' : ''">
        <Icon :icon="StatusShipRequest.returns.icon" />
        <div>{{ StatusShipRequest.returns.label }}</div>
    </div>
</template>