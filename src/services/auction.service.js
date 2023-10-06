import utils from '@/utils/customAxios'
import url from '@/common/urlConstant'

const sendAuctionRequest = async (productId, data) => {
  const serviceUrl = url.endpoint.auctions.productAuctionRequest.replace("{productId}", productId)
  const response = await utils.axiosLocalHost.post(serviceUrl, data)
  return response ? response.data : response
}

const getAllActiveAuctions = async () => {
  const serviceUrl = url.endpoint.auctions.getAll + "?page=1&size=100&query=status:IN_PROCESS"
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}

const getAuctionDetail = async id => {
  const serviceUrl = url.endpoint.auctions.getDetail.replace("{id}", id)
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}

export default {
  sendAuctionRequest, getAllActiveAuctions, getAuctionDetail
}
