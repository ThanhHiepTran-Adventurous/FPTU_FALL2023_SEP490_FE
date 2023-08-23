import ENUM from "@/models/enum.js";

const lazyLoad = (componentPath) => () => import(componentPath);

const buyer_router = [
  {
    name: "all-page-buyer",
    path: "/",
    component: lazyLoad("@/views/common/LandingPage.vue"),
    children: [
      {
        name: "landing-page",
        path: "landing-page",
        component: lazyLoad("@/views/LandingPage.vue"),
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
   
    ],
  },
];

export default buyer_router;
