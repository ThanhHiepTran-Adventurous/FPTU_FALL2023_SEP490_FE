import utils from '@/utils/customAxios'
import url from '@/common/urlConstant'

const getAllChatMessage = async (groupId) => {
  const serviceUrl = url.endpoint.chat.getAllMessages.replace("{groupId}", groupId)
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}

const getGroupInfo = async groupId => {
  const serviceUrl = url.endpoint.chat.getChatGroupInfo.replace("{chatGroupId}", groupId)
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}

export default {
    getAllChatMessage, getGroupInfo
}
