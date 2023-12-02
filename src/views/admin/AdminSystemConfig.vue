<script setup>
import { useSystemStore } from '@/stores/system-config.store';
import { ref, onMounted } from 'vue';
import AdminHeader from './common/AdminHeader.vue';

const systemStore = useSystemStore()

const formData = ref({
    PercentageProfit: 0,
    PaymentDeadline: 0,
    ReturnDuring: 0,
    MaximumReportEachUser: 0,
    NumberSoldProductToAutoConfirm: 0,
    NumberRateProductToAutoConfirm: 0
})

onMounted(async () => {
    await systemStore.syncData()
    formData.value.PercentageProfit = systemStore.PercentageProfit
    formData.value.PaymentDeadline = systemStore.PaymentDeadline
    formData.value.ReturnDuring = systemStore.ReturnDuring
    formData.value.MaximumReportEachUser = systemStore.MaximumReportEachUser
    formData.value.NumberSoldProductToAutoConfirm = systemStore.NumberSoldProductToAutoConfirm
    formData.value.NumberRateProductToAutoConfirm = systemStore.NumberRateProductToAutoConfirm
})

</script>

<template>
    <div class="w-full">
        <AdminHeader />
        <section class="bg-white pl-96 pt-[100px]">
            <div class="text-3xl font-semibold text-blue-700 mb-8">Cấu hình hệ thống</div>
            <div class="mb-5 flex items-center w-full px-10">
                <label for="PercentageProfit" class="block mb-2 text-md font-medium text-gray-900 dark:text-white w-[40%]">
                    Phần trăm hoa hồng:
                </label>
                <input
                    id="PercentageProfit"
                    v-model="formData.PercentageProfit"
                    type="text"
                    class="w-[20%] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
            </div>
            <div class="mb-5 flex items-center w-full px-10">
                <label for="PaymentDeadline" class="block mb-2 text-md font-medium text-gray-900 dark:text-white w-[40%]">
                    Thời gian để trả tiền (ngày):
                </label>
                <input
                    id="PaymentDeadline"
                    v-model="formData.PaymentDeadline"
                    type="text"
                    class="w-[20%] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
            </div>
            <div class="mb-5 flex items-center w-full px-10">
                <label for="ReturnDuring" class="block mb-2 text-md font-medium text-gray-900 dark:text-white w-[40%]">
                    Trả hàng trong vòng (ngày):
                </label>
                <input
                    id="ReturnDuring"
                    v-model="formData.ReturnDuring"
                    type="text"
                    class="w-[20%] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
            </div>
            <div class="mb-5 flex items-center w-full px-10">
                <label for="MaximumReportEachUser" class="block mb-2 text-md font-medium text-gray-900 dark:text-white w-[40%]">
                    Ban user nếu bị report vượt quá (lần):
                </label>
                <input
                    id="MaximumReportEachUser"
                    v-model="formData.MaximumReportEachUser"
                    type="text"
                    class="w-[20%] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
            </div>
            <div class="mb-5 flex items-center w-full px-10">
                <label for="NumberSoldProductToAutoConfirm" class="block mb-2 text-md font-medium text-gray-900 dark:text-white w-[40%]">
                    Số sản phẩm đã bán tối thiểu để được tự động duyệt:
                </label>
                <input
                    id="NumberSoldProductToAutoConfirm"
                    v-model="formData.NumberSoldProductToAutoConfirm"
                    type="text"
                    class="w-[20%] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
            </div>
            <div class="mb-5 flex items-center w-full px-10">
                <label for="NumberRateProductToAutoConfirm" class="block mb-2 text-md font-medium text-gray-900 dark:text-white w-[40%]">
                    Số rating tối thiểu để được tự động duyệt:
                </label>
                <input
                    id="NumberRateProductToAutoConfirm"
                    v-model="formData.NumberRateProductToAutoConfirm"
                    type="text"
                    class="w-[20%] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
            </div>
            <div class="mb-5 flex items-center gap-3 w-full px-10">
                <button class="text-black bg-white border focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Reset</button>
                <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Chỉnh sửa</button>
            </div>
        </section>
    </div>
</template>