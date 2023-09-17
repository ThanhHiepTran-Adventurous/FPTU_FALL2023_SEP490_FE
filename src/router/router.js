import { createRouter, createWebHashHistory } from "vue-router";
import ENUM from "@/constants/enum.js";
import buyer_routes, { defaultBuyerRoute } from "./buyer_router";
import seller_routes, { defaultSellerRoute } from "./seller_router";
import TokenService from "@/services/token/token.service.js";
import { useUserStore } from '@/stores/user.store'
import { Role } from '@/common/contract'

const ROUTE_NAMES = {
  SIGN_IN: "all-page-buyer",
  SIGN_UP: "create-account",
  FORGOT_PASSWORD: "forgot-password",
  HOME: "home",
};

const routes = [...buyer_routes, ...seller_routes];

const isAuthenticated = () => {
  const currentUser = TokenService.getCookie("Token")
    ? JSON.parse(TokenService.getCookie("Token"))
    : null;
  return currentUser;
};

const isAuthorized = (to, currentUser) => {
  const currentRoleId = currentUser.RoleIds[0];
  return !to.meta.roles || to.meta.roles.includes(currentRoleId);
};

const shouldRedirectToHome = (to, currentUser) => {
  const pageUnreachableWhenAuthenticated = [
    ROUTE_NAMES.SIGN_IN,
    ROUTE_NAMES.SIGN_UP,
    ROUTE_NAMES.FORGOT_PASSWORD,
  ];

  return (
    currentUser &&
    pageUnreachableWhenAuthenticated.includes(to.name)
  );
};

const determineDefaultRouteByRole = (to, role) => {
  if(Role.seller.value === role) {
    return defaultSellerRoute
  }
  if(Role.buyer.value === role) {
    return defaultBuyerRoute
  }
  return ROUTE_NAMES.SIGN_IN
};

const router = createRouter({
  mode: "history",
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requireAuth = to.matched.some((record) => record.meta.requiresAuth);
  const userStore = useUserStore()
  const userId = userStore.getUserIdAndGetFromLocalStorageIfNotExist()
  // const role = userStore.getRoleAndGetFromLocalStorageIfNotExist()

  if (requireAuth && !userId) {
    next({ name: ROUTE_NAMES.SIGN_IN });
  } else {
    // const currentUser = isAuthenticated();

    // if (shouldRedirectToHome(to, currentUser)) {
    //   next("/");
    // } else if (requireAuth) {
    //   if (currentUser) {
    //     if (isAuthorized(to, currentUser)) {
    //       next();
    //     } else {
    //       next("forbidden");
    //     }
    //   }
    // } else {
    //   next();
    // }
    next();
  }
});

export default router;
