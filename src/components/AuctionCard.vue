<script setup>
import { AuctionModelType } from "@/common/contract";
import { noImage } from "@/common/urlConstant";
import { Icon } from "@iconify/vue";
import formatCurrency from "@/utils/currency-output-formatter";
import moment from "moment";
import AuctionType from "./common-components/badge/AuctionType.vue";

const props = defineProps({
    imageUrl: {
        type: String,
        default: noImage
    },
    productName: {
        type: String,
        default: "Product Name"
    },
    auctionType: {
        type: String,
        default: AuctionModelType.intermediate
    },
    price: {
        type: Number,
        default: 100000
    },
    catchedAt: {
        type: String,
        default: "2023-11-11"
    }
})

const emit = defineEmits(["action-triggered"])

</script>
<template>
    <div class="w-[23rem]">
        <div class="bg-white border border-[1px] border-gray-200 rounded-lg w-full hover:bg-gray-100 p-3">
            <div class="flex items-start">
                <div>
                    <img class="object-cover rounded-lg h-32 w-32"
                    :src="imageUrl" alt="auction" />
                </div>
                <div class="leading-normal ml-6">
                    <AuctionType :type="auctionType" />
                    <div class="font-normal mt-2">
                        <div>Giá đạt được </div>
                        <div class="text-blue-600 text-xl font-semibold">{{ formatCurrency(price) }}</div>
                    </div>
                    <div class="mt-2">
                        <div>
                            Thời gian
                        </div>
                        <div class="!text-gray-400">{{ moment.utc(catchedAt).format('DD/MM/YYYY HH:mm:ss') }}</div>
                    </div>
                </div>
            </div>
            <div class="mt-3 flex justify-center" v-if="auctionType === AuctionModelType.intermediate">
                <button type="button" @click="emit('action-triggered')"
                    class="flex items-center text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 focus:outline-none">
                    <span class="w-max font-semibold">Thanh toán</span>
                </button>
            </div>
        </div>
        <div class="text-xl font-semibold my-2 tracking-tight flex justify-center">
            {{ productName }}
        </div>
    </div>
</template>