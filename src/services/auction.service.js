import utils from '@/utils/customAxios'
import url from '@/common/urlConstant'

const sendAuctionRequest = async (productId, data) => {
  const serviceUrl = url.endpoint.auctions.productAuctionRequest.replace('{productId}', productId)
  const response = await utils.axiosLocalHost.post(serviceUrl, data)
  return response ? response.data : response
}

const getAllActiveAuctions = async (query, sort) => {
  const serviceUrl = `${url.endpoint.guest.auctions}?query=${query}&sort=${sort}&page=1&size=100`
  console.log(serviceUrl)
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}

const getAuctionDetail = async id => {
  const serviceUrl = url.endpoint.guest.auctionDetail.replace('{id}', id)
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}

const placeBidMannual = async (auctionId, price) => {
  const serviceUrl = url.endpoint.placeBid.manual
  const response = await utils.axiosLocalHost.post(serviceUrl, {
    auctionAmount: price,
    auctionId,
  })
  return response ? response.data : response
}

const placeAutoBid = async (auctionId, payload) => {
  const serviceUrl = url.endpoint.placeBid.auto.replace('{auctionId}', auctionId)
  const response = await utils.axiosLocalHost.post(serviceUrl, payload)
  return response ? response.data : response
}
const updateAutoBid = async (autoAuctionId, payload) => {
  const serviceUrl = url.endpoint.auctions.updateAutoAuction.replace('{autoAuctionId}', autoAuctionId)
  const response = await utils.axiosLocalHost.put(serviceUrl, payload)
  return response ? response.data : response
}

const buyNowBid = async auctionId => {
  const serviceUrl = url.endpoint.placeBid.buyNow.replace('{auctionId}', auctionId)
  const response = await utils.axiosLocalHost.post(serviceUrl)
  return response ? response.data : response
}

const getHistoryBid = async (auctionId, productId) => {
  const serviceUrl = url.endpoint.guest.auctionHistory.replace('{auctionId}', auctionId)
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}

const getAutoBidDetail = async auctionId => {
  const serviceUrl = url.endpoint.auctions.autoAuctionDetail.replace('{auctionId}', auctionId)
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}

const getListAuctionWin = async () => {
  const serviceUrl = url.endpoint.auctions.getListAuctionWin
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}

const getAuctionBySeller = async query => {
  const serviceUrl = `${url.endpoint.auctions.auctionBySeller}?query=${query}&page=1&size=1000`
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}
export default {
  sendAuctionRequest,
  getAllActiveAuctions,
  getAuctionDetail,
  placeBidMannual,
  placeAutoBid,
  buyNowBid,
  getHistoryBid,
  getAutoBidDetail,
  updateAutoBid,
  getListAuctionWin,
  getAuctionBySeller,
}
