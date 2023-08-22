import ENUM from "@/models/enum.js";

const lazyLoad = (componentPath) => () => import(componentPath);

const buyer_router = [
  {
    name: "all-page-buyer",
    path: "/",
    component: lazyLoad("@/views/buyer/ManageAllPage.vue"),
    children: [
      {
        name: "landing",
        path: "landing",
        component: lazyLoad("@/views/common/LandingPage.vue"),
        meta: {
          requiresAuth: false,
          roles: [ENUM.BUYER.ROLE_ID],
        },
      },
      {
        name: "sign-in",
        path: "sign-in",
        component: lazyLoad("@/views/common/SignInPage.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      {
        name: "sign-up",
        path: "sign-up",
        component: lazyLoad("@/views/common/SignUpPage.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      {
        name: "forgot-password",
        path: "forgot-password",
        component: lazyLoad("@/views/common/ForgotPasswordPage.vue"),
        meta: {
          requiresAuth: false,
          roles: [ENUM.BUYER.ROLE_ID, ENUM.SELLER.ROLE_ID],
        },
      },
    ],
  },
];

export default buyer_router;
