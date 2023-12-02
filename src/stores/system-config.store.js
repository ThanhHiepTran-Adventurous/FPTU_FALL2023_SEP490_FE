import { defineStore } from "pinia";
import systemService from "@/services/system.service";
import toastOption from "@/utils/toast-option";
import { GlobalConfigKey } from "@/common/contract";

export const useSystemStore = defineStore("system", {
    state: () => ({
        PercentageProfit: 0,
        PaymentDeadline: 0,
        ReturnDuring: 0,
        MaximumReportEachUser: 0,
        NumberSoldProductToAutoConfirm: 0,
        NumberRateProductToAutoConfirm: 0
    }),
    actions: {
        async syncData(){
            try {
                const response = await systemService.getAllConfigsData()
                this.PercentageProfit = response.data.filter(f => f.systemConfigType === GlobalConfigKey.PercentageProfit)[0].valueConfig
                this.PaymentDeadline = response.data.filter(f => f.systemConfigType === GlobalConfigKey.PaymentDeadline)[0].valueConfig
                this.ReturnDuring = response.data.filter(f => f.systemConfigType === GlobalConfigKey.ReturnDuring)[0].valueConfig
                this.MaximumReportEachUser = response.data.filter(f => f.systemConfigType === GlobalConfigKey.MaximumReportEachUser)[0].valueConfig
                this.NumberSoldProductToAutoConfirm = response.data.filter(f => f.systemConfigType === GlobalConfigKey.NumberSoldProductToAutoConfirm)[0].valueConfig
                this.NumberRateProductToAutoConfirm = response.data.filter(f => f.systemConfigType === GlobalConfigKey.NumberRateProductToAutoConfirm)[0].valueConfig
            } catch (_) {
                toastOption.toastError("Có lỗi khi lấy dữ liệu từ hệ thống.")
            }
        }
    }
})