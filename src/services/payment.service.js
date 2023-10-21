import utils from '@/utils/customAxios'
import url from '@/common/urlConstant'

const paymentOption2 = async (auctionId, returnUrl) => {
  const serviceUrl = url.endpoint.transaction.option2VnPay

  try {
    const response = await utils.axiosLocalHost.post(serviceUrl, {
      auctionId,
      returnUrl,
    })

    if (response && response.data) {
      // Payment successful, you can return response.data or perform other actions
      return response.data
    } else {
      // Handle payment failure
      throw new Error('Payment failed')
    }
  } catch (error) {
    // Handle any errors that may occur during the payment process
    console.error('Payment error:', error)
    throw error // Customize error handling based on your needs
  }
}

const paymentForChat = async (auctionId, returnUrl) => {
    const serviceUrl = url.endpoint.transaction.paymentForChatVnPay
  
    const response = await utils.axiosLocalHost.post(serviceUrl, {
        auctionId,
        returnUrl,
    })

    return response ? response.data : response
  }
export default {
  paymentOption2, paymentForChat,
}
