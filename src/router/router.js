import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import ENUM from "@/constants/enum.js";
import buyer_routes from "./buyer_router";
import seller_routes from "./seller_router";
import TokenService from "@/services/token/token.service.js";

const ROUTE_NAMES = {
  SIGN_IN: "login",
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

const determineNextRoute = (to, currentUser) => {
  if (to.name === ROUTE_NAMES.HOME) {
    const currentRoleId = currentUser.RoleIds[0];
    return currentRoleId === ENUM.BUYER.ROLE_ID ? null : "/seller/dashboard";
  }
  return null;
};

const router = createRouter({
  mode: "history",
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requireAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requireAuth && !isAuthenticated()) {
    next({ name: ROUTE_NAMES.SIGN_IN });
  } else {
    const currentUser = isAuthenticated();

    if (shouldRedirectToHome(to, currentUser)) {
      next("/");
    } else if (requireAuth) {
      if (currentUser) {
        if (isAuthorized(to, currentUser)) {
          next();
        } else {
          next("forbidden");
        }
      }
    } else {
      next();
    }
  }
});

export default router;
