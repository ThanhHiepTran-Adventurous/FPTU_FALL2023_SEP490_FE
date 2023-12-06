<script setup>
import { AuctionModelType } from "@/common/contract";
import { noImage } from "@/common/urlConstant";
import { Icon } from "@iconify/vue";
import formatCurrency from "@/utils/currency-output-formatter";
import moment from "moment";
import AuctionType from "./common-components/badge/AuctionType.vue";
import {Tooltip} from 'ant-design-vue'
import { useSystemStore } from "@/stores/system-config.store";
import { computed } from "vue";

const systemStore = useSystemStore()

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

const isExpired = computed(() => {
    console.log(props.catchedAt)
    const expiredDate = moment.utc(props.catchedAt).add(systemStore.PaymentDeadline, "d")
    console.log(expiredDate)
    console.log(moment(new Date()))
    return moment(new Date()).isAfter(expiredDate)
})

const emit = defineEmits(["action-triggered"])
const onPaymentClick = () => {
    if(isExpired.value === false){
        emit('action-triggered')
    }
}
</script>
<template>
    <div class="w-[23rem]">
        <div class="border border-[1px] border-gray-200 rounded-lg w-full p-3"
            :class="auctionType === AuctionModelType.intermediate && isExpired ? 'bg-red-200' : 'bg-white'">
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
        </div>
        <div class="text-xl font-semibold my-2 tracking-tight flex justify-center items-center gap-3">
            <Tooltip class="relative ml-3" placement="bottom">
              <template #title>{{ productName }}</template>
              <div :class="auctionType === AuctionModelType.intermediate ? 'w-[80%] text-center truncate' : 'truncate'">
                  {{ productName }}
              </div>
            </Tooltip>
            <div class="flex justify-center" v-if="auctionType === AuctionModelType.intermediate">
                
                    <Tooltip class="relative" placement="bottom">
                        <template #title>{{ isExpired ? 'Hết hạn thanh toán' : 'Thanh toán' }}</template>
                        <button type="button" @click="onPaymentClick"
                            class="flex items-center text-black bg-white border-[1px] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 focus:outline-none"
                            :class="isExpired ? 'border-red-500' : 'border-green-500'">
                            <Icon icon="arcticons:budgetbakers-wallet" class="text-black text-[20px]"/>
                        </button>
                    </Tooltip>
            </div>
        </div>
    </div>
</template>