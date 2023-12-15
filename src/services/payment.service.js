import utils from '@/utils/customAxios'
import url from '@/common/urlConstant'

const paymentOption2 = async (auctionId, returnUrl) => {
  const serviceUrl = url.endpoint.transaction.option2VnPay

  try {
    const response = await utils.axiosLocalHost.post(serviceUrl, {
      auctionId,
      returnUrl,
    })

    if (response && response.data) {
      return response.data
    } else {
      throw new Error('Payment failed')
    }
  } catch (error) {
    console.error('Payment error:', error)
    throw error
  }
}

const paymentForChat = async (auctionId, returnUrl) => {
  const serviceUrl = url.endpoint.transaction.paymentForChatVnPay

  const response = await utils.axiosLocalHost.post(serviceUrl, {
    auctionId,
    returnUrl,
  })

  return response ? response.data : response
}
const getTransactionAdmin = async () => {
  const serviceUrl = url.endpoint.transaction.getTransactionAdmin + '?page=1&limit=1000'

  try {
    const response = await utils.axiosLocalHost.get(serviceUrl)

    if (response && response.data) {
      return response.data
    } else {
      throw new Error('No transaction data found')
    }
  } catch (error) {
    console.error('Error fetching transaction data:', error)
    throw error
  }
}

const getTransactionBuyerSeller = async () => {
  const serviceUrl = url.endpoint.transaction.getTransactionBuyerSeller + '?page=1&limit=1000'

  try {
    const response = await utils.axiosLocalHost.get(serviceUrl)

    if (response && response.data) {
      return response.data
    } else {
      throw new Error('No transaction data found')
    }
  } catch (error) {
    console.error('Error fetching transaction data:', error)
    throw error
  }
}
const exportFileExcel = async () => {
  const serviceUrl = url.endpoint.transaction.exportFileExcel

  try {
    const response = await utils.axiosLocalHost.get(serviceUrl, {
      responseType: 'blob',
    })

    if (response) {
      // Process the file download
      const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
      const url = window.URL.createObjectURL(blob)

      // Create a link element to trigger the download
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'transaction_data.xlsx') // Set the file name
      document.body.appendChild(link)
      link.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } else {
      throw new Error('No file data found')
    }
  } catch (error) {
    console.error('Error exporting file:', error)
    throw error
  }
}

export default {
  paymentOption2,
  paymentForChat,
  getTransactionAdmin,
  getTransactionBuyerSeller,
  exportFileExcel,
}
