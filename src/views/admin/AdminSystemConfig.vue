<script setup>
import { useSystemStore } from '@/stores/system-config.store';
import validator from '@/utils/validator';
import { ref, onMounted } from 'vue';
import AdminHeader from './common/AdminHeader.vue';
import ErrorMessage from '@/components/common-components/ErrorMessage.vue';
import { GlobalConfigKey } from '@/common/contract';
import systemService from '@/services/system.service';
import toastOption from '@/utils/toast-option';

const systemStore = useSystemStore()

const originalData = ref({
    PercentageProfit: 0,
    PaymentDeadline: 0,
    ReturnDuring: 0,
    MaximumReportEachUser: 0,
    NumberSoldProductToAutoConfirm: 0,
    NumberRateProductToAutoConfirm: 0,
    MaxinumBuyNowPerDay: 0,
})

const formData = ref({
    PercentageProfit: 0,
    PaymentDeadline: 0,
    ReturnDuring: 0,
    MaximumReportEachUser: 0,
    NumberSoldProductToAutoConfirm: 0,
    NumberRateProductToAutoConfirm: 0,
    MaxinumBuyNowPerDay: 0,
})
const formErrorState = ref({
    PercentageProfit: '',
    PaymentDeadline: '',
    ReturnDuring: '',
    MaximumReportEachUser: '',
    NumberSoldProductToAutoConfirm: '',
    NumberRateProductToAutoConfirm: '',
    MaxinumBuyNowPerDay: ''
})

const resetErrorState = () => {
    formErrorState.value = {
        PercentageProfit: '',
        PaymentDeadline: '',
        ReturnDuring: '',
        MaximumReportEachUser: '',
        NumberSoldProductToAutoConfirm: '',
        NumberRateProductToAutoConfirm: '',
        MaxinumBuyNowPerDay: ''
    }
}

const formValidate = () => {
    let isValidated = true
    if (!validator.stringIsIntegerAndBiggerThanZeroValidator(formData.value.PercentageProfit)){
        formErrorState.value.PercentageProfit = 'Phần trăm hoa hồng phải là số nguyên lớn hơn 0.'
        isValidated = false
    }
    if (formData.value.PercentageProfit > 20) {
        formErrorState.value.PercentageProfit = 'Phần trăm hoa hồng không được lớn hơn 20%'
        isValidated = false
    }

    if (!validator.stringIsIntegerAndBiggerThanOrEqualZeroValidator(formData.value.PaymentDeadline)){
        formErrorState.value.PaymentDeadline = 'Thời gian để trả tiền phải là số nguyên lớn hơn hoặc bằng 0.'
    }
    if (formData.value.PaymentDeadline > 20) {
        formErrorState.value.PaymentDeadline = 'Thời gian để trả tiền không được lớn hơn 20 ngày'
        isValidated = false
    }

    if (!validator.stringIsIntegerAndBiggerThanOrEqualZeroValidator(formData.value.ReturnDuring)){
        formErrorState.value.PaymentDeadline = 'Thời gian trả hàng trong vòng x ngày phải là số nguyên lớn hơn hoặc bằng 0.'
    }
    if (formData.value.ReturnDuring > 20) {
        formErrorState.value.ReturnDuring = 'Thời gian trả hàng trong vòng x ngày không được lớn hơn 20 ngày'
        isValidated = false
    }

    if (!validator.stringIsIntegerAndBiggerThanZeroValidator(formData.value.MaximumReportEachUser)){
        formErrorState.value.MaximumReportEachUser = 'Ban user nếu bị report vượt quá x lần phải là số nguyên lớn hơn 0.'
        isValidated = false
    }
    if (!validator.stringIsIntegerAndBiggerThanZeroValidator(formData.value.NumberSoldProductToAutoConfirm)){
        formErrorState.value.NumberSoldProductToAutoConfirm = 'Số sản phẩm đã bán tối thiểu để được tự động duyệt phải là số nguyên lớn hơn 0.'
        isValidated = false
    }
    if (!validator.stringIsIntegerAndBiggerThanZeroValidator(formData.value.MaxinumBuyNowPerDay)){
        formErrorState.value.MaxinumBuyNowPerDay = 'Số sản phẩm người mua có thể mua ngay tối đa một ngày phải là số nguyên lớn hơn 0.'
        isValidated = false
    }
    if (!validator.stringIsIntegerAndBiggerThanZeroValidator(formData.value.NumberRateProductToAutoConfirm)){
        formErrorState.value.NumberRateProductToAutoConfirm = 'Số lần rating tối thiểu để được tự động duyệt phải là số nguyên lớn hơn 0.'
        isValidated = false
    }
    
    return isValidated
}

const resetFormState = () => {
    formData.value.PercentageProfit = systemStore.PercentageProfit
    formData.value.PaymentDeadline = systemStore.PaymentDeadline
    formData.value.ReturnDuring = systemStore.ReturnDuring
    formData.value.MaximumReportEachUser = systemStore.MaximumReportEachUser
    formData.value.NumberSoldProductToAutoConfirm = systemStore.NumberSoldProductToAutoConfirm
    formData.value.NumberRateProductToAutoConfirm = systemStore.NumberRateProductToAutoConfirm
    formData.value.MaxinumBuyNowPerDay = systemStore.MaxinumBuyNowPerDay
}

const onResetClick = () => {
    resetErrorState()
    resetFormState()
}

const onConfirmUpdate = () => {
    if(!formValidate()){
        return
    }
    if(confirm("Bạn có chắc muốn cập nhật cấu hình hệ thống không?")){
        const payload = getPayload()
        if(payload.length > 0){
            systemService.updateConfigData(payload)
            .then(_ => {
                toastOption.toastSuccess("Cập nhật cấu hình thành công")
            })
            .catch(_ => {
                toastOption.toastError("Có lỗi xảy ra, vui lòng thử lại sau")
            })
            .finally(async () => {
                await systemStore.syncData()

                formData.value.PercentageProfit = systemStore.PercentageProfit
                formData.value.PaymentDeadline = systemStore.PaymentDeadline
                formData.value.ReturnDuring = systemStore.ReturnDuring
                formData.value.MaximumReportEachUser = systemStore.MaximumReportEachUser
                formData.value.NumberSoldProductToAutoConfirm = systemStore.NumberSoldProductToAutoConfirm
                formData.value.NumberRateProductToAutoConfirm = systemStore.NumberRateProductToAutoConfirm
                formData.value.MaxinumBuyNowPerDay = systemStore.MaxinumBuyNowPerDay

                originalData.value.PercentageProfit = systemStore.PercentageProfit
                originalData.value.PaymentDeadline = systemStore.PaymentDeadline
                originalData.value.ReturnDuring = systemStore.ReturnDuring
                originalData.value.MaximumReportEachUser = systemStore.MaximumReportEachUser
                originalData.value.NumberSoldProductToAutoConfirm = systemStore.NumberSoldProductToAutoConfirm
                originalData.value.NumberRateProductToAutoConfirm = systemStore.NumberRateProductToAutoConfirm
                originalData.value.MaxinumBuyNowPerDay = systemStore.MaxinumBuyNowPerDay
            })
        }
    }
}

const getPayload = () => {
    const payload = []
    if(formData.value.PercentageProfit !== originalData.value.PercentageProfit){
        payload.push({
            type: GlobalConfigKey.PercentageProfit,
            value: formData.value.PercentageProfit
        })
    }
    if(formData.value.PaymentDeadline !== originalData.value.PaymentDeadline){
        payload.push({
            type: GlobalConfigKey.PaymentDeadline,
            value: formData.value.PaymentDeadline
        })
    }
    if(formData.value.ReturnDuring !== originalData.value.ReturnDuring){
        payload.push({
            type: GlobalConfigKey.ReturnDuring,
            value: formData.value.ReturnDuring
        })
    }
    if(formData.value.MaximumReportEachUser !== originalData.value.MaximumReportEachUser){
        payload.push({
            type: GlobalConfigKey.MaximumReportEachUser,
            value: formData.value.MaximumReportEachUser
        })
    }
    if(formData.value.NumberSoldProductToAutoConfirm !== originalData.value.NumberSoldProductToAutoConfirm){
        payload.push({
            type: GlobalConfigKey.NumberSoldProductToAutoConfirm,
            value: formData.value.NumberSoldProductToAutoConfirm
        })
    }
    if(formData.value.NumberRateProductToAutoConfirm !== originalData.value.NumberRateProductToAutoConfirm){
        payload.push({
            type: GlobalConfigKey.NumberRateProductToAutoConfirm,
            value: formData.value.NumberRateProductToAutoConfirm
        })
    }
    if(formData.value.MaxinumBuyNowPerDay !== originalData.value.MaxinumBuyNowPerDay){
        payload.push({
            type: GlobalConfigKey.MaxinumBuyNowPerDay,
            value: formData.value.MaxinumBuyNowPerDay
        })
    }
    return payload
}

onMounted(async () => {
    await systemStore.syncData()

    formData.value.PercentageProfit = systemStore.PercentageProfit
    formData.value.PaymentDeadline = systemStore.PaymentDeadline
    formData.value.ReturnDuring = systemStore.ReturnDuring
    formData.value.MaximumReportEachUser = systemStore.MaximumReportEachUser
    formData.value.NumberSoldProductToAutoConfirm = systemStore.NumberSoldProductToAutoConfirm
    formData.value.NumberRateProductToAutoConfirm = systemStore.NumberRateProductToAutoConfirm
    formData.value.MaxinumBuyNowPerDay = systemStore.MaxinumBuyNowPerDay

    originalData.value.PercentageProfit = systemStore.PercentageProfit
    originalData.value.PaymentDeadline = systemStore.PaymentDeadline
    originalData.value.ReturnDuring = systemStore.ReturnDuring
    originalData.value.MaximumReportEachUser = systemStore.MaximumReportEachUser
    originalData.value.NumberSoldProductToAutoConfirm = systemStore.NumberSoldProductToAutoConfirm
    originalData.value.NumberRateProductToAutoConfirm = systemStore.NumberRateProductToAutoConfirm
    originalData.value.MaxinumBuyNowPerDay = systemStore.MaxinumBuyNowPerDay
})

</script>

<template>
    <div class="w-full">
        <AdminHeader />
        <section class="bg-white pl-96 pt-[100px]">
            <div class="text-3xl font-semibold text-blue-700 mb-8">Cấu hình hệ thống</div>
            <div class="mb-5 flex items-center w-full px-10">
                <label for="PercentageProfit" class="block mb-2 text-md font-medium text-gray-900 dark:text-white w-[40%]">
                    Phần trăm hoa hồng (%):
                </label>
                <div class="w-[30%]">
                    <input
                        id="PercentageProfit"
                        v-model="formData.PercentageProfit"
                        type="number"
                        class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                    <ErrorMessage :text="formErrorState.PercentageProfit"/>
                </div>
            </div>
            <div class="mb-5 flex items-center w-full px-10">
                <label for="PaymentDeadline" class="block mb-2 text-md font-medium text-gray-900 dark:text-white w-[40%]">
                    Thời gian để trả tiền (ngày):
                </label>
                <div class="w-[30%]">
                    <input
                        id="PaymentDeadline"
                        v-model="formData.PaymentDeadline"
                        type="number"
                        class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                    <ErrorMessage :text="formErrorState.PaymentDeadline"/>
                </div>
            </div>
            <div class="mb-5 flex items-center w-full px-10">
                <label for="ReturnDuring" class="block mb-2 text-md font-medium text-gray-900 dark:text-white w-[40%]">
                    Trả hàng trong vòng (ngày):
                </label>
                <div class="w-[30%]">
                    <input
                        id="ReturnDuring"
                        v-model="formData.ReturnDuring"
                        type="number"
                        class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                    <ErrorMessage :text="formErrorState.ReturnDuring"/>
                </div>
            </div>
            <div class="mb-5 flex items-center w-full px-10">
                <label for="MaximumReportEachUser" class="block mb-2 text-md font-medium text-gray-900 dark:text-white w-[40%]">
                    Ban user nếu bị report vượt quá (lần):
                </label>
                <div class="w-[30%]">
                    <input
                        id="MaximumReportEachUser"
                        v-model="formData.MaximumReportEachUser"
                        type="number"
                        class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                    <ErrorMessage :text="formErrorState.MaximumReportEachUser"/>
                </div>
            </div>
            <div class="mb-5 flex items-center w-full px-10">
                <label for="NumberSoldProductToAutoConfirm" class="block mb-2 text-md font-medium text-gray-900 dark:text-white w-[40%]">
                    Số sản phẩm đã bán tối thiểu để được tự động duyệt (lần):
                </label>
                <div class="w-[30%]">
                    <input
                        id="NumberSoldProductToAutoConfirm"
                        v-model="formData.NumberSoldProductToAutoConfirm"
                        type="number"
                        class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                    <ErrorMessage :text="formErrorState.NumberSoldProductToAutoConfirm"/>
                </div>
            </div>
            <div class="mb-5 flex items-center w-full px-10">
                <label for="NumberRateProductToAutoConfirm" class="block mb-2 text-md font-medium text-gray-900 dark:text-white w-[40%]">
                    Số lần rating tối thiểu để được tự động duyệt (lần):
                </label>
                <div class="w-[30%]">
                    <input
                        id="NumberRateProductToAutoConfirm"
                        v-model="formData.NumberRateProductToAutoConfirm"
                        type="number"
                        class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                    <ErrorMessage :text="formErrorState.NumberRateProductToAutoConfirm"/>
                </div>
            </div>
            <div class="mb-5 flex items-center w-full px-10">
                <label for="NumberRateProductToAutoConfirm" class="block mb-2 text-md font-medium text-gray-900 dark:text-white w-[40%]">
                    Số sản phẩm có thể mua ngay tối đa trong 1 ngày (sản phẩm):
                </label>
                <div class="w-[30%]">
                    <input
                        id="NumberRateProductToAutoConfirm"
                        v-model="formData.MaxinumBuyNowPerDay"
                        type="number"
                        class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                    <ErrorMessage :text="formErrorState.MaxinumBuyNowPerDay"/>
                </div>
            </div>
            <div class="mb-5 flex items-center gap-3 w-full px-10">
                <button @click="onResetClick" class="text-black bg-white border focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Reset</button>
                <button @click="onConfirmUpdate" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Chỉnh sửa</button>
            </div>
        </section>
    </div>
</template>