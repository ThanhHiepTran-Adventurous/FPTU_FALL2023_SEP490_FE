import utils from '@/utils/customAxios'
import url from '../common/urlConstant'

const adminConfirmSellerwithdrawOpt2 = async withdrawAndRefundRequestsId => {
  const serviceUrl = url.endpoint.withdrawAndRefunds.adminConfirmSellerwithdrawOpt2.replace(
    '{withdrawAndRefundRequestsId}',
    withdrawAndRefundRequestsId,
  )
  try {
    const response = await utils.axiosLocalHost.put(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error('Error processing adminConfirmSellerwithdrawOpt2:', error)
    throw error
  }
}

const sellerWithdrwaOpt2 = async orderId => {
  const serviceUrl = url.endpoint.withdrawAndRefunds.sellerWithdrwaOpt2.replace('{orderId}', orderId)
  try {
    const response = await utils.axiosLocalHost.post(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error('Error processing sellerWithdrwaOpt2:', error)
    throw error
  }
}
const getAllWithdraws = async (page, size) => {
  const serviceUrl = url.endpoint.withdrawAndRefunds.getAllWithdraws
  try {
    const response = await utils.axiosLocalHost.get(serviceUrl, {
      params: {
        page,
        size,
      },
    })
    return response ? response.data : response
  } catch (error) {
    console.error('Error fetching all withdraws:', error)
    throw error
  }
}
export default {
  getAllWithdraws,
  sellerWithdrwaOpt2,
  adminConfirmSellerwithdrawOpt2,
}
