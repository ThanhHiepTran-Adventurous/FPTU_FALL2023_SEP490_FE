import utils from "@/utils/customAxios"
import url from "../common/urlConstant"

const addProductToInventory = async formData => {
    const serviceUrl = url.endpoint.product.inventory;
    const response = await utils.axiosLocalHost.post(serviceUrl, formData, {
            headers: {
              'Content-Type': undefined
            },
          }
        )
    return response ? response.data : response
}

const getProducts = async (query) => {
  const serviceUrl = `${url.endpoint.product.inventoryByUser}?query=${query}&page=1&size=10000`;
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
}


export default {
  addProductToInventory, getProducts
}