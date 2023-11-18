import utils from '@/utils/customAxios'
import url from '../common/urlConstant'

const addProductToInventory = async formData => {
  const serviceUrl = url.endpoint.product.inventory
  const response = await utils.axiosLocalHost.post(serviceUrl, formData, {
    headers: {
      'Content-Type': undefined,
    },
  })
  return response ? response.data : response
}

const getProducts = async query => {
  const serviceUrl = `${url.endpoint.product.inventoryByUser}?query=${query}&page=1&size=10000`
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}

const updateProductById = async (productId, updateRequest) => {
  const serviceUrl = `${url.endpoint.product.inventory}/${productId}`

  try {
    const jsonBlob = new Blob([JSON.stringify(updateRequest)], { type: 'application/json' })

    const formData = new FormData()
    formData.append('updateProductRequest', jsonBlob)

    const response = await utils.axiosLocalHost.put(serviceUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response ? response.data : response
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}
export default {
  addProductToInventory,
  getProducts,
  updateProductById,
}
