import utils from '@/utils/customAxios'
import url from '@/common/urlConstant'

const sendAuctionRequest = async (productId, data) => {
    const serviceUrl = url.endpoint.auction.sendAuctionRequest.replace("{productId}", productId)
  const response = await utils.axiosLocalHost.post(serviceUrl, data)
  return response ? response.data : response
}

export default {
    sendAuctionRequest,
}
