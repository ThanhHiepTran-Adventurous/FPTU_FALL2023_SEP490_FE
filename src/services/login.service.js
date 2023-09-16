import utils from "@/utils/customAxios"
import url from "@/common/urlConstant";

const login = async (phoneNum, password) => {
    const serviceUrl = url.endpoint.auth.login;
    const payload = {phoneNum: phoneNum, password: password}
    const response = await utils.axiosLocalHost.post(serviceUrl, payload);
    return response ? response.data : response;
}

const register = async (data) => {
    const serviceUrl = url.endpoint.auth.register;
    const payload = {...data}
    const response = await utils.axiosLocalHost.post(serviceUrl, payload);
    return response ? response.data : response;
}

const logout = async () => {
    const serviceUrl = url.endpoint.auth.logout;
    const response = await utils.axiosLocalHost.post(serviceUrl);
    return response ? response.data : response;
}

const verifyOtp = async (data) => {
    const serviceUrl = url.endpoint.auth.verifyOtp;
    const payload = {...data}
    const response = await utils.axiosLocalHost.post(serviceUrl, payload);
    return response ? response.data : response;
}

const resendOtp = async (phone) => {
    const serviceUrl = url.endpoint.auth.resendOtp + "?phone=" + phone;
    const response = await utils.axiosLocalHost.post(serviceUrl);
    return response ? response.data : response;
}

const fetchUserInfo = async () => {
    const serviceUrl = url.endpoint.user.info
    const response = await utils.axiosLocalHost.get(serviceUrl);
    return response ? response.data : response;
}

export default {
    login, logout, register, verifyOtp, resendOtp, fetchUserInfo
}