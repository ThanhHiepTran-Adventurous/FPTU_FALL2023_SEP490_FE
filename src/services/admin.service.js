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
const countSellers = async () => {
  try {
    const serviceUrl = url.endpoint.chart.countSeller
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error(error)
    throw error
  }
}
const countBuyers = async () => {
  try {
    const serviceUrl = url.endpoint.chart.countBuyer
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error(error)
    throw error
  }
}
const countAuctionCompleted = async () => {
  try {
    const serviceUrl = url.endpoint.chart.countAuctionCompleted
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error(error)
    throw error
  }
}
const countAuctionInProcess = async () => {
  try {
    const serviceUrl = url.endpoint.chart.countAuctionInProcess
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error(error)
    throw error
  }
}
const countAuctionNew = async () => {
  try {
    const serviceUrl = url.endpoint.chart.countAuctionNew
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error(error)
    throw error
  }
}
const countAuctionRejected = async () => {
  try {
    const serviceUrl = url.endpoint.chart.countAuctionRejected
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error(error)
    throw error
  }
}
const countProductActive = async () => {
  try {
    const serviceUrl = url.endpoint.chart.countProductActive
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error(error)
    throw error
  }
}
const countProductApproving = async () => {
  try {
    const serviceUrl = url.endpoint.chart.countProductApproving
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error(error)
    throw error
  }
}

const countProductInActive = async () => {
  try {
    const serviceUrl = url.endpoint.chart.countProductInActive
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error(error)
    throw error
  }
}

const countProductOnSell = async () => {
  try {
    const serviceUrl = url.endpoint.chart.countProductOnSell
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error(error)
    throw error
  }
}

const countProductRejected = async () => {
  try {
    const serviceUrl = url.endpoint.chart.countProductRejected
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
  } catch (error) {
    console.error(error)
    throw error
  }
}

const countProductSold = async () => {
  try {
    const serviceUrl = url.endpoint.chart.countProductSold
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
  countSellers,
  countBuyers,
  countAuctionCompleted,
  countAuctionInProcess,
  countAuctionNew,
  countAuctionRejected,
  countProductActive,
  countProductApproving,
  countProductInActive,
  countProductOnSell,
  countProductRejected,
  countProductSold,
}
