import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    username: "",
    userId: "",
    token: "",
    role: "",
    refreshToken: "",
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
    getRefreshTokenAndGetFromLocalStorageIfNotExist(){
      if(this.refreshToken){
        return this.refreshToken
      }
      const refreshTokenInLocalStorage = localStorage.getItem("refreshToken")
      this.refreshToken = refreshTokenInLocalStorage || ""
      return this.refreshToken
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
    getRoleAndGetFromLocalStorageIfNotExist() {
      if(this.role) {
        return this.role
      }
      const roleInLocalStorage = localStorage.getItem("role")
      this.role = roleInLocalStorage || ""
      return this.role
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
    setRefreshTokenAndSaveToLocalStorage(value){
      this.refreshToken = value
      localStorage.setItem("refreshToken", value)
    },
    clear(){
      this.userId = "";
      this.username = "";
      this.token = "";
      this.role = "";
      this.refreshToken = "";
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("userId")
      localStorage.removeItem("username")
    }
  },
});
