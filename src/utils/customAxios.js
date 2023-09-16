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
export default {
    axiosLocalHost : axiosClient,
}