<script setup>
import { AuctionModelType } from "@/common/contract"
import { Icon } from "@iconify/vue"

const props = defineProps({
    immediateOptionNav: {
        type: String,
        default: "/bought/immediate"
    },
    intermediateOptionNav: {
        type: String,
        default: "/bought/intermediate"
    },
    curTab: {
        type: String,
        default: AuctionModelType.immediate
    }
})

</script>

<template>
    <div class="w-max border-b border-gray-200 dark:border-gray-700">
        <ul class="flex w-full -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            <li>
                <router-link :to="immediateOptionNav"
                    class="inline-flex items-center justify-center w-[15rem] px-4 py-2 hover:text-gray-600 hover:border-gray-300 hover:bg-gray-200 group"
                    :class="curTab === AuctionModelType.immediate ? 'border-b-2 text-blue-600 border-blue-600 bg-gray-100' : 'border-b-1'">
                    <Icon icon="game-icons:card-exchange" class="w-6 h-6 mr-3 stroke-current" />
                    <span>Tự trao đổi</span>
                </router-link>
            </li>
            <li>
                <router-link :to="intermediateOptionNav"
                class="inline-flex items-center justify-center px-2 w-[15rem] py-2 active hover:bg-gray-200 group"
                :class="curTab === AuctionModelType.intermediate ? 'border-b-2 text-blue-600 border-blue-600 bg-gray-100' : 'border-b-1'">
                    <Icon icon="entypo:align-horizontal-middle" class="w-6 h-6 mr-3 stroke-current" />
                    <span>Trung gian qua hệ thống</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>