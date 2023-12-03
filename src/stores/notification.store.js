import { defineStore } from "pinia";
import { NotiReadEnum, Role } from "@/common/contract"
import userService from "@/services/user.service";
import { useUserStore } from "./user.store";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    isContainNewNoti: false,
    notifications: []
  }),
  actions: {
    getNotifications(){
        if(this.notifications.length === 0){
            this.syncNotifications()
        }
        return this.notifications
    },
    async syncNotifications(){
        const userStore = useUserStore()
        const role = userStore.getRoleAndGetFromLocalStorageIfNotExist()
        if(!userStore.getTokenAndGetFromLocalStorageIfNotExist() || role === Role.admin.value || role === Role.staff.value){
            return
        }
        const response = await userService.getAllNotification()
        this.notifications = response.data || []
        const notReadArr = this.notifications.filter(n => n.isRead !== NotiReadEnum.READ)
        if(notReadArr.length > 0){
            this.isContainNewNoti = true
        }
    },
    newMessageArrive(){
        this.isContainNewNoti = true
    },
    justRead(){
        this.isContainNewNoti = false
        this.notifications = this.notifications.map(n => {
            n.isRead = NotiReadEnum.READ
            return n
        })
    },
    addNewNoti(id, title, body, createAt){
        const data = {
            id, title, body, createAt,
            isRead: "NOT_READ"
        }
        this.notifications = [data, ...this.notifications]
    }
  },
});
