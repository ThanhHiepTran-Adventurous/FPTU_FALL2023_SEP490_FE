import ENUM from "@/models/enum.js";

const lazyLoad = (componentPath) => () => import(componentPath);

const buyer_router = [
  {
    name: "all-page-buyer",
    path: "/",
    component: lazyLoad("../views/buyer/ManagerAllPage.vue"),
    children: [
      {
        name: "landing-page",
        path: "/",
        component: lazyLoad("../views/common/LandingPage.vue"),
        meta: {
          requiresAuth: false,
          roles: [ENUM.BUYER.ROLE_ID],
        },
      },
      {
        name: "sign-in",
        path: "sign-in",
        component: lazyLoad("../views/common/LoginPage.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      {
        name: "sign-up",
        path: "sign-up",
        component: lazyLoad("../views/common/CreateAccountPage.vue"),
        meta: {
          requiresAuth: false,
        },
      }, 
       {
        name: "forbidden",
        path: "forbidden",
        component: lazyLoad("../views/common/ComingSoonPage.vue"),
        meta: {
          requiresAuth: false,
        },
      },
   
    ],
  },
];

export default buyer_router;
