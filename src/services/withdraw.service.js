import utils from '@/utils/customAxios'
import url from '../common/urlConstant'

const adminConfirmSellerwithdrawOpt2 = async withdrawAndRefundRequestsId => {
  const serviceUrl = url.endpoint.withdrawAndRefunds.adminConfirmSellerwithdrawOpt2.replace(
    '{withdrawAndRefundRequestsId}',
    withdrawAndRefundRequestsId,
  )
  try {
    const response = await utils.axiosLocalHost.put(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error('Error processing adminConfirmSellerwithdrawOpt2:', error)
    throw error
  }
}
const adminConfirmSellerWithdrawOpt1 = async withdrawAndRefundRequestsId => {
  const serviceUrl = url.endpoint.withdrawAndRefunds.adminConfirmSellerWithdrawOpt1.replace(
    '{withdrawAndRefundRequestsId}',
    withdrawAndRefundRequestsId,
  )
  try {
    const response = await utils.axiosLocalHost.put(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error('Error processing adminConfirmSellerwithdrawOpt2:', error)
    throw error
  }
}
const adminConfirmBuyerWithdraw = async withdrawId => {
  const serviceUrl = url.endpoint.withdrawAndRefunds.adminConfirmBuyerWithdraw.replace(
    '{withdrawAndRefundRequestsId}',
    withdrawId,
  )
  const response = await utils.axiosLocalHost.put(serviceUrl)
  return response ? response.data : response
}

const sellerWithdrwaOpt2 = async orderId => {
  const serviceUrl = url.endpoint.withdrawAndRefunds.sellerWithdrwaOpt2.replace('{orderId}', orderId)
  try {
    const response = await utils.axiosLocalHost.post(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error('Error processing sellerWithdrwaOpt2:', error)
    throw error
  }
}
const getAllWithdraws = async (page, size) => {
  const serviceUrl = url.endpoint.withdrawAndRefunds.getAllWithdraws
  try {
    const response = await utils.axiosLocalHost.get(serviceUrl, {
      params: {
        page,
        size,
      },
    })
    return response ? response.data : response
  } catch (error) {
    console.error('Error fetching all withdraws:', error)
    throw error
  }
}
const getWithDrawsByUser = async (page, size) => {
  const serviceUrl = url.endpoint.withdrawAndRefunds.getWithdrawsUser
  const response = await utils.axiosLocalHost.get(serviceUrl, {
    params: {
      page,
      size,
    },
  })
  return response ? response.data : response
}
const exportFileExcel = async () => {
  const serviceUrl = url.endpoint.withdrawAndRefunds.exportFileExcel

  try {
    const response = await utils.axiosLocalHost.get(serviceUrl, {
      responseType: 'blob',
    })

    if (response) {
      // Create a temporary anchor element to trigger the file download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'withdraw_refund_requests.xlsx') // Define the file name
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
  } catch (error) {
    console.error('Error exporting file:', error)
    throw error
  }
}
export default {
  getAllWithdraws,
  sellerWithdrwaOpt2,
  getWithDrawsByUser,
  adminConfirmSellerwithdrawOpt2,
  adminConfirmSellerWithdrawOpt1,
  adminConfirmBuyerWithdraw,
  exportFileExcel,
}
