import ManagerAllPage from '@/views/seller/ManagerAllPage.vue'
import ComingSoonPage from '@/views/common/ComingSoonPage.vue'
import ProductManagerPage from '@/views/seller/child-page/ManageProductPage.vue'
import CreateAccountPage from '@/views/common/CreateAccountPage.vue'
const seller_router = [
  {
    name: 'all-page-seller',
    path: '/',
    component: ManagerAllPage,
    children: [
      {
        name: 'product-manager',
        path: '/product-manager',
        component: ProductManagerPage,
      }
        ,
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
