import utils from '@/utils/customAxios'
import url from '../common/urlConstant'

const getAllReportData = async () => {
  const serviceUrl = url.endpoint.report.getAllReportData + '?page=1&size=1000'
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}

const sellerReportBuyerOption1 = async (orderId, formData) => {
  const serviceUrl = url.endpoint.report.sellerReportBuyerOpt1.replace("{orderId}", orderId)

  const response = await utils.axiosLocalHost.post(serviceUrl, formData, {
    headers: {
      'Content-Type': undefined,
    },
  })
  return response ? response.data : response
}

const buyerReportSellerOption1 = async (orderId, formData) => {
  const serviceUrl = url.endpoint.report.buyerReportSellerOpt1.replace("{orderId}", orderId)

  const response = await utils.axiosLocalHost.post(serviceUrl, formData, {
    headers: {
      'Content-Type': undefined,
    },
  })
  return response ? response.data : response
}
const getAllReportDataBuyerOrSeller = async () => {
  const serviceUrl = url.endpoint.report.getAllReportDataBuyerOrSeller + '?page=1&size=1000'
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}

const getAllReportDataStaff = async () => {
  const serviceUrl = url.endpoint.report.getAllReportDataStaff + '?page=1&size=1000'
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}
export default {
  sellerReportBuyerOption1,
  buyerReportSellerOption1,
  getAllReportData,
  getAllReportDataBuyerOrSeller,
  getAllReportDataStaff,
}
