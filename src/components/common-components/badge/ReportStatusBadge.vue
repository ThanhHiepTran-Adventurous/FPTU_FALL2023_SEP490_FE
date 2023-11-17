<script setup>
import { ReportStatus } from '@/common/contract';
const props = defineProps({
    status: {
        type: String,
        default: ReportStatus.PROCESSING.value
    }
})
</script>

<template>
    <div v-if="status === ReportStatus.PROCESSING.value" class="w-max bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-blue-400">
        {{ ReportStatus.PROCESSING.label }}
    </div>

    <div v-if="status === ReportStatus.REJECTED.value" class="w-max bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-red-400">
        {{ ReportStatus.REJECTED.label }}
    </div>

    <div v-if="status === ReportStatus.PROCESSED.value" class="w-max bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-green-400">
        {{ ReportStatus.PROCESSED.label }}
    </div>
</template>