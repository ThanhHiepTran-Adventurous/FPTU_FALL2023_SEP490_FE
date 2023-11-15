import utils from '@/utils/customAxios'
import url from '../common/urlConstant'

const sellerCreateShipRequest = async orderId => {
  console.log(orderId)
  const serviceUrl = url.endpoint.ship.sellerCreateShipRequest.replace('{orderId}', orderId)
  try {
    const response = await utils.axiosLocalHost.post(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error('Error creating ship request:', error)
    throw error
  }
}
const getAllShipRequest = async query => {
  const serviceUrl = `${url.endpoint.ship.getAllShipRequest}?query=${query}&page=1&size=1000`
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}
const staffConfirmShipRequest = async shipRequestId => {
  const serviceUrl = url.endpoint.ship.staffConfirmShipRequest.replace('{shipRequestId}', shipRequestId)
  try {
    const response = await utils.axiosLocalHost.put(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error('Error confirming ship request:', error)
    throw error
  }
}
const staffChangeShipRequestToOnDelivery = async shipRequestId => {
  const serviceUrl = url.endpoint.ship.StaffChangeShipRequestToOnDelivery.replace('{shipRequestId}', shipRequestId)
  try {
    const response = await utils.axiosLocalHost.put(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error('Error changing ship request to "ON_DELIVERY":', error)
    throw error
  }
}
const staffChangeShipRequestToDelivered = async shipRequestId => {
  const serviceUrl = url.endpoint.ship.StaffChangeShipRequestToDelivered.replace('{shipRequestId}', shipRequestId)
  try {
    const response = await utils.axiosLocalHost.put(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error('Error changing ship request to "DELIVERED":', error)
    throw error
  }
}
const buyerConfirmShipRequestDone = async shipRequestId => {
  const serviceUrl = url.endpoint.ship.buyerConfirmDelivered.replace('{shipRequestId}', shipRequestId)
  const response = await utils.axiosLocalHost.put(serviceUrl)
  return response ? response.data : response
}
export default {
  sellerCreateShipRequest,
  getAllShipRequest,
  staffConfirmShipRequest,
  staffChangeShipRequestToOnDelivery,
  staffChangeShipRequestToDelivered,
  buyerConfirmShipRequestDone
}
