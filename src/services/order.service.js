import utils from '@/utils/customAxios'
import url from '@/common/urlConstant'

const getAllOrders = async (query, page, perPage, sortQuery) => {
  const serviceUrl = `${url.endpoint.order.getOrders}?query=${query}&page=${page}&size=${perPage}&sort=${sortQuery}`
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}

export default {
    getAllOrders,
}
