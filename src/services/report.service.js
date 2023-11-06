import utils from '@/utils/customAxios'
import url from '../common/urlConstant'

const getAllReportData = async () => {
    const serviceUrl = url.endpoint.report.getAllReportData + "?page=1&size=1000"
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
}

const sellerReportBuyerOption1 = async (orderId, imgList, reportText) => {
  const serviceUrl = url.endpoint.report.sellerReportBuyerOpt1.replace("{orderId}", orderId)
  const formData = new FormData()
  const jsonData = {
    content: reportText
  }
  const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' })

  for(const imgData of imgList){
    formData.append("reportImages", imgData)
  }
  formData.append("createReportRequest", jsonBlob)


  const response = await utils.axiosLocalHost.post(serviceUrl, formData, {
    headers: {
      'Content-Type': undefined,
    },
  })
  return response ? response.data : response
}

const buyerReportSellerOption1 = async (orderId, imgList, reportText) => {
  const serviceUrl = url.endpoint.report.buyerReportSellerOpt1.replace("{orderId}", orderId)
  const formData = new FormData()
  const jsonData = {
    content: reportText
  }
  const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' })

  for(const imgData of imgList){
    formData.append("reportImages", imgData)
  }
  formData.append("createReportRequest", jsonBlob)


  const response = await utils.axiosLocalHost.post(serviceUrl, formData, {
    headers: {
      'Content-Type': undefined,
    },
  })
  return response ? response.data : response
}

export default {
    sellerReportBuyerOption1,
    buyerReportSellerOption1,
    getAllReportData
}
