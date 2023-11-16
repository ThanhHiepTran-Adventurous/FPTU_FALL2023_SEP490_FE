import utils from '@/utils/customAxios'
import url from '../common/urlConstant'

const getAllReportData = async () => {
  const serviceUrl = url.endpoint.report.getAllReportDataAdmin + '?page=1&size=1000'
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}

const sellerReportBuyerOption1 = async (orderId, formData) => {
  const serviceUrl = url.endpoint.report.sellerReportBuyerOpt1.replace('{orderId}', orderId)

  const response = await utils.axiosLocalHost.post(serviceUrl, formData, {
    headers: {
      'Content-Type': undefined,
    },
  })
  return response ? response.data : response
}

const buyerReportSellerOption1 = async (orderId, formData) => {
  const serviceUrl = url.endpoint.report.buyerReportSellerOpt1.replace('{orderId}', orderId)

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
const buyerReportSellerOpt2 = async (orderId, formData) => {
  const serviceUrl = url.endpoint.report.buyerReportSellerOpt2.replace('{orderId}', orderId)

  const response = await utils.axiosLocalHost.post(serviceUrl, formData, {
    headers: {
      'Content-Type': undefined,
    },
  })

  return response ? response.data : response
}

const staffAssignReport = async (reportId) => {
  const serviceUrl = url.endpoint.report.assignReport.replace("{reportId}", reportId)
  const response = await utils.axiosLocalHost.put(serviceUrl)
  return response ? response.data : response
}

const staffConfirmReportOpt1 = async (reportId) => {
  const serviceUrl = url.endpoint.report.confirmReportOpt1.replace("{reportId}", reportId)
  const response = await utils.axiosLocalHost.put(serviceUrl)
  return response ? response.data : response
}
const staffDeclineReportOpt1 = async (reportId) => {
  const serviceUrl = url.endpoint.report.declineReportOpt1.replace("{reportId}", reportId)
  const response = await utils.axiosLocalHost.put(serviceUrl)
  return response ? response.data : response
}
const staffConfirmReturnRequest = async (reportId) => {
  const serviceUrl = url.endpoint.report.confirmReportOpt2ForBuyer.replace("{reportId}", reportId)
  const response = await utils.axiosLocalHost.post(serviceUrl)
  return response ? response.data : response
}

export default {
  sellerReportBuyerOption1,
  buyerReportSellerOption1,
  getAllReportData,
  getAllReportDataBuyerOrSeller,
  getAllReportDataStaff,
  buyerReportSellerOpt2,
  staffAssignReport,
  staffConfirmReportOpt1,
  staffDeclineReportOpt1,
  staffConfirmReturnRequest
}
