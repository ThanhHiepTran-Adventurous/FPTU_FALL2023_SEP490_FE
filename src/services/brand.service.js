import utils from "@/utils/customAxios"
import url from "../common/urlConstant"

const getAllBrands = async () => {
    const serviceUrl = url.endpoint.brand.getAll
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
}

export default {
    getAllBrands,
}