import utils from "@/utils/customAxios"
import url from "../common/urlConstant"

const getAllCategories = async () => {
    const serviceUrl = url.endpoint.category.getAll
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
}

export default {
    getAllCategories,
}