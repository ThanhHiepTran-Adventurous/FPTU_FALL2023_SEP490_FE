import utils from '@/utils/customAxios'
import url from '@/common/urlConstant'

const getAllConfigsData = async () => {
  const serviceUrl = url.endpoint.system.getAllConfigData
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}
// PercentageProfit: "PERCENTAGE_CONFIG_VALUE",
// PaymentDeadline: "PAYMENT_DEADLINE",
// ReturnDuring: "RETURN_POLICY_DAY",
// MaximumReportEachUser: "MAXIMUM_REPORTED",
// NumberSoldProductToAutoConfirm: "NUMBER_SOLD_PRODUCT",
// NumberRateProductToAutoConfirm: "NUMBER_RATE_FEEDBACK_PRODUCT"
//const updatePercentageProfit = as

export default {
    getAllConfigsData,
}
