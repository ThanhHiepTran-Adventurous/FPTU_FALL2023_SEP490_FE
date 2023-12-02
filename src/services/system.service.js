import utils from '@/utils/customAxios'
import url from '@/common/urlConstant'

const getAllConfigsData = async () => {
  const serviceUrl = url.endpoint.system.getAllConfigData
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}

const updateConfigData = async (payload) => {
  const serviceUrl = url.endpoint.system.updateBatch
  const response = await utils.axiosLocalHost.post(serviceUrl, payload)
  return response ? response.data : response
}

export default {
  getAllConfigsData, updateConfigData
}