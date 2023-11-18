import axios from 'axios';
import { useUserStore } from "@/stores/user.store";
import url from '@/common/urlConstant';

const axiosClient = axios.create({
    baseURL: url.base,
})

axiosClient.interceptors.request.use((config) => {
    const userStore = useUserStore();
    if(userStore.getTokenAndGetFromLocalStorageIfNotExist()){
        config.headers.Authorization = `Bearer ${userStore.getTokenAndGetFromLocalStorageIfNotExist()}`
    }
    if(userStore.getRefreshTokenAndGetFromLocalStorageIfNotExist()){
        config.headers.set("refreshToken", userStore.getRefreshTokenAndGetFromLocalStorageIfNotExist())
    }
    config.headers.Accept = "application/json;charset=UTF-8"
    return config;
})

axiosClient.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
        const userStore = useUserStore();
        const refreshToken = userStore.getRefreshTokenAndGetFromLocalStorageIfNotExist()
        if(!refreshToken){
            return Promise.reject(err)
        }
      const originalConfig = err.config;

      if (originalConfig.url !== url.endpoint.auth.refreshToken && err.response) {

        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;

          try {
            const rs = await axiosClient.post(url.endpoint.auth.refreshToken, {
              refreshToken: refreshToken,
            });

            const accessToken = rs.data.data;
            userStore.setTokenAndSaveToLocalStorage(accessToken)

            return axiosClient(originalConfig);
          } catch (_error) {
            userStore.clear()
            return Promise.reject(_error);
          }
        }
      }

      return Promise.reject(err);
    }
  );

export default {
    axiosLocalHost : axiosClient,
}