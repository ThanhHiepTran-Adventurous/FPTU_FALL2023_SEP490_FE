import utils from '@/utils/customAxios'
import url from '../common/urlConstant'

const getAll = async () => {
  const serviceUrl = url.endpoint.bankAccountFetch.allBankAccount
  try {
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error('Error fetching data bank:', error)
    throw error
  }
}
export default {
  getAll,
}
