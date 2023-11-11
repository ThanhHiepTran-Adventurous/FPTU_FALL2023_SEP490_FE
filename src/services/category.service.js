import utils from "@/utils/customAxios"
import url from "../common/urlConstant"

const getAllCategories = async () => {
    const serviceUrl = url.endpoint.category.getAll
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
}
const getAllCategoriesGuest = async () => {
    const serviceUrl = url.endpoint.guest.categories + "?page=1&size=1000"
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
}

export default {
    getAllCategories, getAllCategoriesGuest
}