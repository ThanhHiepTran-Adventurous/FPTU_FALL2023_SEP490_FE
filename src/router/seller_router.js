import ManagerAllPage from '@/views/seller/ManagerAllPage.vue'
import ComingSoonPage from '@/views/common/ComingSoonPage.vue'
import CreateAccountPage from '@/views/common/CreateAccountPage.vue'
import ProfilePage from '@/views/common/ProfilePage.vue'
import ProductStore from '@/components/manage-product/ProductStore.vue'
import ProductAuction from '@/components/manage-product/ProductAuction.vue'
import ProductSell from '@/components/manage-product/ProductSell.vue'
import ProductReject from '@/components/manage-product/ProductReject.vue'
import Messenger from '@/views/common/Messenger.vue'
import ProductInOrder from '@/components/manage-product/ProductInOrder.vue'
const seller_router = [
  {
    name: 'all-page-seller',
    path: '/',
    component: ManagerAllPage,
    children: [
      {
        name: 'product-store',
        path: '/manage/product-inventory',
        component: ProductStore
      },
      {
        name: 'product-on-stock',
        path: '/manage/on-selling',
        component: ProductAuction
      },
      {
        name: 'product-sold',
        path: '/manage/product-sold',
        component: ProductSell
      },
      {
        name: 'product-rejected',
        path: '/manage/product-rejected',
        component: ProductReject
      },
      {
        name: 'product-in-order',
        path: '/manage/orders',
        component: ProductInOrder
      },
      {
        name: 'profile',
        path: '/profile',
        component: ProfilePage,
        meta: {
          requiresAuth: false,
        },
      },
      {
        name: 'sign-up',
        path: '/register',
        component: CreateAccountPage,
        meta: {
          requiresAuth: false,
        },
      },
    ],
  },
  {
    name: 'messenger',
    path: '/messenger',
    component: Messenger,
    meta: {
      requiresAuth: false,
    },
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

export default seller_router
export const defaultSellerRoute = 'all-page-seller'
