import utils from "@/utils/customAxios"
import url from "../common/urlConstant";

const fetchAllProvinces = async () => {
    const serviceUrl = url.endpoint.address.allProvinces
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
}

const fetchAllDistrictOfProvinces = async (provinceId) => {
    const serviceUrl = url.endpoint.address.allDistrictsOfProvince.replace('{code}', provinceId)
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
}

const fetchAllWardOfDistrict = async (districtId) => {
    const serviceUrl = url.endpoint.address.allWardsOfDistrict.replace('{code}', districtId)
    const response = await utils.axiosLocalHost.get(serviceUrl)
    return response ? response.data : response
}

export default {
    fetchAllDistrictOfProvinces, fetchAllProvinces, fetchAllWardOfDistrict
}