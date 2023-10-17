<script setup>
import { AuctionModelType } from '@/common/contract';
import { Icon } from '@iconify/vue';

const props = defineProps(['type'])

</script>

<template>
    <div v-if="type === AuctionModelType.intermediate" class="flex items-center gap-2 bg-green-50 text-green-800 text-xs font-medium font-semibold mr-2 px-2.5 py-0.5 rounded border-[1px] border-green-400">
        <div><Icon icon="ic:outline-verified-user" class="text-green-600 text-[16px]"/></div>
        <div>Trung gian qua hệ thống</div>
    </div>
    <div v-if="type === AuctionModelType.immediate" class="bg-gray-100 text-gray-800 text-xs font-medium font-semibold mr-2 px-2.5 py-0.5 rounded border-[1px] border-gray-700">Tự trao đổi</div>
</template>