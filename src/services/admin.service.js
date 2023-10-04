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
    formData.append('updateBrandRequest', JSON.stringify(updateBrandRequest))

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
    formData.append('addBrandAndCategoryRequest', JSON.stringify(addBrandAndCategoryRequest))

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
export default {
  fetchAllBrands,
  deleteBrandById,
  updateBrandById,
  creatNewBrand,
}
