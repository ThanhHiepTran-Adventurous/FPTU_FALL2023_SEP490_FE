import ManagerAllPage from '@/views/seller/ManagerAllPage.vue'
import ComingSoonPage from '@/views/common/ComingSoonPage.vue'
import ProductManagerPage from '@/views/seller/child-page/ManageProductPage.vue'
import CreateAccountPage from '@/views/common/CreateAccountPage.vue'
import ProfilePage from '@/views/common/ProfilePage.vue'
import CCCD from '@/components/page-sections/UploadCCCD.vue'
const seller_router = [
  {
    name: 'all-page-seller',
    path: '/',
    component: ManagerAllPage,
    children: [
      {
        name: 'manage-product',
        path: '/manage',
        component: ProductManagerPage,
      },

      {
        name: 'profile',
        path: '/profile',
        component: ProfilePage,
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'cccd',
        path: '/cccd',
        component: CCCD,
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
