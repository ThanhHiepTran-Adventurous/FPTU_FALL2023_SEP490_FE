import utils from '@/utils/customAxios'
import url from '@/common/urlConstant'

const fetchAllBrands = async () => {
  const serviceUrl = url.endpoint.brand.getAll
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response
}

const deleteBrandById = async brandId => {
  const serviceUrl = url.endpoint.brand.deleteById.replace('{brandId}', brandId)
  const response = await utils.axiosLocalHost.delete(serviceUrl)
  return response ? response.data : response
}
const updateBrandById = async (brandId, formData, updateBrandRequest) => {
  try {
    // Append the updateBrandRequest as a JSON string to the FormData
    formData.append('updateBrandRequest', new Blob([JSON.stringify(updateBrandRequest)], { type: 'application/json' }))

    const serviceUrl = url.endpoint.brand.updateById.replace('{brandId}', brandId)

    const response = await utils.axiosLocalHost.put(serviceUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the content type to FormData
      },
    })

    return response ? response.data : response
  } catch (error) {
    console.error(error)
    throw error
  }
}
const creatNewBrand = async (formData, addBrandAndCategoryRequest) => {
  try {
    // Append the updateBrandRequest as a JSON string to the FormData
    formData.append(
      'addBrandAndCategoryRequest',
      new Blob([JSON.stringify(addBrandAndCategoryRequest)], { type: 'application/json' }),
    )

    const serviceUrl = url.endpoint.brand.create

    const response = await utils.axiosLocalHost.post(serviceUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the content type to FormData
      },
    })

    return response ? response.data : response
  } catch (error) {
    console.error(error)
    throw error
  }
}
const getAllAuctions = async (page, size) => {
  try {
    const serviceUrl = url.endpoint.auctions.getAll
    const response = await utils.axiosLocalHost.get(serviceUrl, {
      params: {
        page,
        size,
      },
    })

    return response ? response.data : response
  } catch (error) {
    console.error(error)
    throw error
  }
}
const approveAuction = async auctionId => {
  try {
    const serviceUrl = url.endpoint.auctions.approve.replace('{auctionId}', auctionId)
    const response = await utils.axiosLocalHost.post(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error(error)
    throw error
  }
}
const rejectAuction = async (auctionId, rejectReason) => {
  try {
    const serviceUrl = url.endpoint.auctions.reject.replace('{auctionId}', auctionId)
    const response = await utils.axiosLocalHost.delete(serviceUrl, {
      data: rejectReason, // Pass the rejectReason as the data parameter
    })
    return response ? response.data : response
  } catch (error) {
    console.error(error)
    throw error
  }
}
const getAllCategories = async () => {
  try {
    const serviceUrl = url.endpoint.category.getAll
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error(error)
    throw error
  }
}
export default {
  fetchAllBrands,
  deleteBrandById,
  updateBrandById,
  creatNewBrand,
  getAllAuctions,
  approveAuction,
  rejectAuction,
  getAllCategories,
}
