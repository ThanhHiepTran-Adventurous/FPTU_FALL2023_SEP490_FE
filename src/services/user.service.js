import utils from "@/utils/customAxios"
import url from "@/common/urlConstant";


const updateProfileData = async (data) => {
    const serviceUrl = url.endpoint.user.updateInfo;
    const payload = {...data};
    const response = await utils.axiosLocalHost.put(serviceUrl, payload);
    return response ? response.data : response;
}

const updateAvatar = async (formData) => {
    const serviceUrl = url.endpoint.user.updateAvatar;
    const response = await utils.axiosLocalHost.put(serviceUrl, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
          }
        )
    return response ? response.data : response
}

const updateEmail = async (email, password) => {
  const serviceUrl = url.endpoint.user.changeEmail
  const payload = {
    email: email,
    password: password,
  }
  const response = await utils.axiosLocalHost.post(serviceUrl, payload);
  return response ? response.data : response
}

const resendEmailOtp = async (email) => {
  const serviceUrl = url.endpoint.user.resendEmailOtp + "?email=" + email
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response;
}

const verifyEmailOtp = async (otp, email) => {
  const serviceUrl = url.endpoint.user.verifyEmailOtp
  const payload = {otp, email}
  const response = await utils.axiosLocalHost.put(serviceUrl, payload)
  return response ? response.data : response
}

const uploadCCCD = async (formData) => {
  const serviceUrl = url.endpoint.user.verifyCitizenCard
  const response = await utils.axiosLocalHost.post(serviceUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    }
  )
  return response ? response.data : response
}

const getCCCD = async () => {
  const serviceUrl = url.endpoint.user.getCitizenCard
  const response = await utils.axiosLocalHost.get(serviceUrl)
  return response ? response.data : response;
}

export default {
  updateProfileData, updateAvatar, updateEmail, resendEmailOtp, verifyEmailOtp, uploadCCCD, getCCCD
}