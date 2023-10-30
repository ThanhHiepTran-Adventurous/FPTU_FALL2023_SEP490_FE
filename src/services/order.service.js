import utils from '@/utils/customAxios'
import url from '@/common/urlConstant'
import { OrderStatus } from '@/common/contract'

const getAllOrders = async (query, page, perPage, sortQuery) => {
  const serviceUrl = `${url.endpoint.order.getOrders}?query=${query}&page=${page}&size=${perPage}&sort=${sortQuery}`
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}

const newToDeliveringUpdateRequest = async orderId => {
  const serivceUrl = url.endpoint.order.newToDelivering.replace('{orderId}', orderId)
  const response = await utils.axiosLocalHost.put(serivceUrl)
  return response ? response.data : response
}
const deliveringToDeliveredRequest = async orderId => {
  const serviceUrl = url.endpoint.order.deleveringToDelivered.replace('{orderId}', orderId)
  const response = await utils.axiosLocalHost.put(serviceUrl)
  return response ? response.data : response
}
const deliveredToConfirmDeliveryRequest = async orderId => {
  const serviceUrl = url.endpoint.order.deliveredToConfirmDelivery.replace('{orderId}', orderId)
  const response = await utils.axiosLocalHost.put(serviceUrl)
  return response ? response.data : response
}
const confirmDeliveryToDoneRequest = async orderId => {
  const serviceUrl = url.endpoint.order.deliveryToDone.replace('{orderId}', orderId)
  const response = await utils.axiosLocalHost.put(serviceUrl)
  return response ? response.data : response
}

const updateStatus = async (curStatus, orderId) => {
  console.log(curStatus)
  if (curStatus === OrderStatus.NEW.value) {
    return await newToDeliveringUpdateRequest(orderId)
  }
  if (curStatus === OrderStatus.DELIVERING.value) {
    return await deliveringToDeliveredRequest(orderId)
  }
  if (curStatus === OrderStatus.DELIVERED.value) {
    return await deliveredToConfirmDeliveryRequest(orderId)
  }
  if (curStatus === OrderStatus.CONFIRM_DELIVERY.value) {
    return await confirmDeliveryToDoneRequest(orderId)
  }
}
const getOrdersByAuctionId = async auctionId => {
  const serviceUrl = url.endpoint.order.getOrdersByAuctionId.replace('{auctionId}', auctionId)
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}
const updateAddressBuyerOpt2 = async (orderId, updatedAddressData) => {
  try {
    const serviceUrl = url.endpoint.order.updateAdressBuyerOpt2.replace('{orderId}', orderId)
    const response = await utils.axiosLocalHost.put(serviceUrl, updatedAddressData)
    return response ? response.data : response
  } catch (error) {
    console.error('Error during address update:', error)
    throw error
  }
}
export default {
  getAllOrders,
  newToDeliveringUpdateRequest,
  deliveringToDeliveredRequest,
  deliveredToConfirmDeliveryRequest,
  confirmDeliveryToDoneRequest,
  updateStatus,
  getOrdersByAuctionId,
  updateAddressBuyerOpt2,
}
