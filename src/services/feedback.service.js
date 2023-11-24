import utils from '@/utils/customAxios'
import url from '../common/urlConstant'
const getFeedbackBySellerId = async sellerId => {
  const query = `feedbackProduct_sellerId:${sellerId}`
  const serviceUrl = `${url.endpoint.feedback.getFeedbackBySellerId}?query=${query}&page=1&size=999`
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}
const buyerCreateFeedBack = async formData => {
  const serviceUrl = url.endpoint.feedback.buyerCreateFeedBack
  const response = await utils.axiosLocalHost.post(serviceUrl, formData, {
    headers: {
      'Content-Type': undefined,
    },
  })
  return response ? response.data : response
}
export default {
  getFeedbackBySellerId,
  buyerCreateFeedBack,
}
