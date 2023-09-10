import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    username: "",
    userId: "",
    token: "",
    role: "",
  }),
  actions: {
    resetUsername(){
        this.username = "";
    },
    getUsernameAndGetFromLocalStorageIfNotExist(){
      if(this.username){
        return this.username;
      }
      const usernameInLocalStorage = localStorage.getItem("username");
      this.username = usernameInLocalStorage || "";
      return this.username;
    },
    getUserIdAndGetFromLocalStorageIfNotExist(){
      if(this.userId){
        return this.userId;
      }
      const usernameInLocalStorage = localStorage.getItem("userId");
      this.userId = usernameInLocalStorage || "";
      return this.userId;
    },
    getTokenAndGetFromLocalStorageIfNotExist(){
      if(this.token){
        return this.token;
      }
      const tokenInLocalStorage = localStorage.getItem("token");
      this.token = tokenInLocalStorage || "";
      return this.token;
    },
    setUsernameAndSaveToLocalStorage(value){
      this.username = value;
      localStorage.setItem("username", value);
    },
    setUserIdAndSaveToLocalStorage(value){
      this.userId = value;
      localStorage.setItem("userId", value);
    },
    setTokenAndSaveToLocalStorage(value){
      this.token = value;
      localStorage.setItem("token", value);
    },
    setRoleAndSaveToLocalStorage(value){
      this.role = value;
      localStorage.setItem("role", value)
    },
    getRoleAndGetFromLocalStorageIfNotExist() {
      if(this.role) {
        return this.role
      }
      const roleInLocalStorage = localStorage.getItem("role")
      this.role = roleInLocalStorage || ""
      return this.role
    },
    clear(){
      this.userId = "";
      this.username = "";
      this.token = "";
      this.role = "";
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  },
});
