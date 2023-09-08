import ENUM from '@/constants/enum.js'
import ManagerAllPage from '@/views/buyer/ManagerAllPage.vue'
import TestComponent from '@/views/TestComponent.vue'
import ComingSoonPage from '@/views/common/ComingSoonPage.vue'
import ProductDetailPage from '@/views/buyer/child-page/ProductDetailPage.vue'
import CreateAccountPage from '@/views/buyer/child-page/CreateAccountPage.vue'
import WishListPage from '@/views/buyer/child-page/WishlistPage.vue'
import ComparePage from '@/views/buyer/child-page/ComparePage.vue'
import LandingPage from '@/views/buyer/child-page/LandingPage.vue'
const buyer_router = [
  {
    name: 'all-page-buyer',
    path: '/',
    component: ManagerAllPage,
    children: [
      {
        name: 'test-page',
        path: '/test-components',
        component: TestComponent,
        meta: {
          requiresAuth: false,
          roles: [ENUM.BUYER.ROLE_ID],
        },
      },
      {
        name: 'landing-page',
        path: '/landing',
        component: LandingPage,
        meta: {
          requiresAuth: false,
          roles: [ENUM.BUYER.ROLE_ID],
        },
      },
      {
        name: 'wishlist',
        path: '/wishlist',
        component: WishListPage,
        meta: {
          requiresAuth: false,
          roles: [ENUM.BUYER.ROLE_ID],
        },
      },
      {
        name: 'compare',
        path: '/compare',
        component: ComparePage,
        meta: {
          requiresAuth: false,
          roles: [ENUM.BUYER.ROLE_ID],
        },
      },
      {
        name: 'product-detail',
        path: '/product-detail/:id',
        component: ProductDetailPage,
        meta: {
          requiresAuth: false,
          roles: [ENUM.BUYER.ROLE_ID],
        },
      },
      {
        name: 'sign-up',
        path: '/',
        component: LandingPage,
        meta: {
          requiresAuth: false,
        },
      },
    ],
  },
  {
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    component: ComingSoonPage,
    meta: {
      requiresAuth: false,
    },
  },
  {
    name: 'forbidden',
    path: '/forbidden',
    component: ComingSoonPage,
    meta: {
      requiresAuth: false,
    },
  },
]

export default buyer_router
