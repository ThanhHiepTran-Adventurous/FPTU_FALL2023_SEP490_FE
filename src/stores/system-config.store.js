import { defineStore } from "pinia";
import { useUserStore } from "./user.store";
import systemService from "@/services/system.service";

export const useSystemStore = defineStore("system", {
    state: () => ({
        //showLoginModal: false
    }),
    actions: {
        async syncData(){
            const response = await systemService.getAllConfigsData()
        }
    }
})