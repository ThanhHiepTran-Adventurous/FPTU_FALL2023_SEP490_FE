import ManagerAllPage from '@/views/seller/ManagerAllPage.vue'
import ComingSoonPage from '@/views/common/ComingSoonPage.vue'
import ProfilePage from '@/views/common/ProfilePage.vue'
import ProductStore from '@/components/manage-product/ProductStore.vue'
import ProductAuction from '@/components/manage-product/ProductAuction.vue'
import ProductSell from '@/components/manage-product/ProductSell.vue'
import ProductReject from '@/components/manage-product/ProductReject.vue'
import Messenger from '@/views/common/Messenger.vue'
import ProductInOrderImmediate from '@/components/manage-product/ProductInOrderImmediate.vue'
import ProductInOrderIntermediate from '@/components/manage-product/ProductInOrderIntermediate.vue'
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
        name: 'product-in-order-immediate',
        path: '/manage/orders/immediate',
        component: ProductInOrderImmediate
      },
      {
        name: 'product-in-order-intermediate',
        path: '/manage/orders/intermediate',
        component: ProductInOrderIntermediate
      },
      {
        name: 'profile',
        path: '/profile',
        component: ProfilePage,
        meta: {
          requiresAuth: false,
        },
      },
    ],
  },
  {
    name: 'messenger',
    path: '/messenger/:groupId',
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
