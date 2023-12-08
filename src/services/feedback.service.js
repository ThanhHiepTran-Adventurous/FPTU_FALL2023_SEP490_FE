import utils from '@/utils/customAxios'
import url from '../common/urlConstant'
const getFeedbackBySellerId = async sellerId => {
  const query = `feedbackProduct_sellerId:${sellerId}`
  const serviceUrl = `${url.endpoint.feedback.getFeedbackBySellerId}?query=${query}&page=1&size=999`
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}
const buyerCreateFeedBack = async formData => {
  try {
    const response = await utils.axiosLocalHost.post(url.endpoint.feedback.buyerCreateFeedBack, formData)
    return response ? response.data : response
  } catch (error) {
    // Handle error
    console.error(error)
    throw new Error('Failed to create feedback')
  }
}
export default {
  getFeedbackBySellerId,
  buyerCreateFeedBack,
}
