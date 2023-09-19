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

// const updateEmail = async () => {

// }

export default {
    updateProfileData, updateAvatar
}