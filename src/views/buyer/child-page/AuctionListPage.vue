<script setup>
import Dropdown from '@/components/common-components/Dropdown.vue';
import ItemBox from '@/components/common-components/ItemBox.vue';
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import Slider from '@vueform/slider'
import currencyFormat from '@/utils/currency-formatter.js'

const orderOptions = ref([
    {
        label: "Số lượng lượt đấu giá tăng dần",
        data: "d1",
    },
    {
        label: "Số lượng lượt đấu giá giảm dần",
        data: "d2",
    },
    {
        label: "Thời gian đấu giá còn lại dài nhất",
        data: "d3",
    },
    {
        label: "Thời gian đấu giá còn lại ngắn nhất",
        data: "d4",
    },
    {
        label: "Giá tăng dần",
        data: "d5",
    },
    {
        label: "Giá giảm dần",
        data: "d6",
    },
])
const orderSelected = ref({
    label: "Số lượng lượt đấu giá tăng dần",
    data: "d1",
})
const priceSelected = ref([100000, 5000000])
const isBrandTabOpen = ref(false)
const isCategoryTabOpen = ref(false)
const isPriceTabOpen = ref(false)


</script>
<template>
    <div class="w-full">
        <div class="container bg-white mt-3 rounded-md px-5 pt-1 overflow-auto">
            <div class="flex items-center justify-between">
                <p class="text-3xl font-bold text-black">Sản phẩm</p>
                <div class="flex items-center gap-3">
                    <p>Sắp xếp theo: </p>
                    <div class="mt-3">
                        <Dropdown v-model="orderSelected" :data="orderOptions" class="!w-[300px]" />
                    </div>
                </div>
            </div>
            <div class="flex items-start justify-between mt-7">
                <!-- Filter section -->
                <div>
                    <div>Bộ lọc</div>
                    <div class="mb-1.5 mt-2">
                        <div class="flex items-center justify-between hover:cursor-pointer"
                            @click="() => isBrandTabOpen = !isBrandTabOpen">
                            <div class="font-bold text-black">Thương hiệu</div>
                            <Icon icon="ep:arrow-down" class="text-[18px]" />
                        </div>
                        <div
                            :class="`transition-all duration-500 ${isBrandTabOpen ? 'h-[10rem] opacity-1 p-2' : 'h-0 opacity-0 overflow-hidden'}`">
                            <div class="flex items-center mb-1">
                                <input id="brand1" type="checkbox" value="brand1"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
                                <label for="default-checkbox"
                                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">JUNO</label>
                            </div>
                            <div class="flex items-center mb-1">
                                <input id="brand1" type="checkbox" value="brand1"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
                                <label for="default-checkbox"
                                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">OWEN</label>
                            </div>
                            <div class="flex items-center mb-1">
                                <input id="brand1" type="checkbox" value="brand1"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
                                <label for="default-checkbox"
                                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">BLUE EXCHANGE</label>
                            </div>
                            <div class="flex items-center mb-1">
                                <input id="brand1" type="checkbox" value="brand1"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
                                <label for="default-checkbox"
                                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">GUCCI</label>
                            </div>
                            <div class="flex items-center mb-1">
                                <input id="brand1" type="checkbox" value="brand1"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
                                <label for="default-checkbox"
                                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">VIỆT TIẾN</label>
                            </div>
                            <div class="flex items-center">
                                <input id="brand1" type="checkbox" value="brand1"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
                                <label for="default-checkbox"
                                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">UNIQLO</label>
                            </div>
                        </div>
                    </div>
                    <div class="mb-1.5">
                        <div class="flex items-center justify-between hover:cursor-pointer"
                            @click="() => isPriceTabOpen = !isPriceTabOpen">
                            <div class="font-bold text-black">Giá</div>
                            <Icon icon="ep:arrow-down" class="text-[18px]" />
                        </div>
                        <div
                            :class="`transition-all duration-500 ${isPriceTabOpen ? 'h-[10rem] opacity-1 p-2' : 'h-0 opacity-0 overflow-hidden'}`">
                            <div class="mt-5">
                                <Slider v-model="priceSelected" :max="10000000" :step="10000" />
                                <p>Giá từ {{ currencyFormat(priceSelected[0]) }} đên {{ currencyFormat(priceSelected[1]) }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="mb-1.5">
                        <div class="flex items-center justify-between hover:cursor-pointer"
                            @click="() => isCategoryTabOpen = !isCategoryTabOpen">
                            <div class="font-bold text-black">Chủng loại</div>
                            <Icon icon="ep:arrow-down" class="text-[18px]" />
                        </div>
                        <div
                            :class="`transition-all duration-500 ${isCategoryTabOpen ? 'h-[10rem] opacity-1 p-2' : 'h-0 opacity-0 overflow-hidden'}`">
                            <div class="flex items-center mb-1">
                                <input id="brand1" type="checkbox" value="brand1"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
                                <label for="default-checkbox"
                                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Áo</label>
                            </div>
                            <div class="flex items-center mb-1">
                                <input id="brand1" type="checkbox" value="brand1"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
                                <label for="default-checkbox"
                                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Quần</label>
                            </div>
                            <div class="flex items-center mb-1">
                                <input id="brand1" type="checkbox" value="brand1"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
                                <label for="default-checkbox"
                                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Phụ kiện</label>
                            </div>
                            <div class="flex items-center mb-1">
                                <input id="brand1" type="checkbox" value="brand1"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
                                <label for="default-checkbox"
                                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Giày dép</label>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Auction section -->
                <div class="w-[80%]">
                <div class="flex justify-around mb-3">
                    <ItemBox product-name="Super long long long long name long long long long" />
                    <ItemBox product-name="Super long long long" />
                    <ItemBox product-name="Super long long long" />
                </div>
                <div class="flex justify-around mb-3">
                    <ItemBox product-name="Super long long long long name long long long long" />
                    <ItemBox product-name="Super long long long" />
                    <ItemBox product-name="Super long long long" />
                </div>
                <div class="flex justify-around mb-3">
                    <ItemBox product-name="Super long long long long name long long long long" />
                    <ItemBox product-name="Super long long long" />
                    <ItemBox product-name="Super long long long" />
                </div>
                <div class="flex justify-around">
                    <ItemBox product-name="Super long long long long name long long long long" />
                    <ItemBox product-name="Super long long long" />
                    <ItemBox product-name="Super long long long" />
                </div>
            </div>
        </div>
    </div>
</div></template>
<style src="@vueform/slider/themes/default.css"></style>