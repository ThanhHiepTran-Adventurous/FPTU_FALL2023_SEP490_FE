import { defineStore } from "pinia";
import { useUserStore } from "./user.store";

export const useGlobalStore = defineStore("global", {
    state: () => ({
        showLoginModal: false
    }),
    actions: {
        isAlreadyLogin(){
            const userStore = useUserStore()
            return !!(userStore.getUserIdAndGetFromLocalStorageIfNotExist() && userStore.getTokenAndGetFromLocalStorageIfNotExist())
        }
    }
})