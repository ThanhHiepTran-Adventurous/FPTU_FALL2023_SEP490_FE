import ENUM from '@/common/enum.js'
import ManagerAllPage from '@/views/buyer/ManagerAllPage.vue'
import ComingSoonPage from '@/views/common/ComingSoonPage.vue'
import ProductDetailPage from '@/views/buyer/child-page/ProductDetailPage.vue'
import BoughtPage from '@/views/buyer/child-page/BoughtPage.vue'
import WishListPage from '@/views/buyer/child-page/WishlistPage.vue'
import ComparePage from '@/views/buyer/child-page/ComparePage.vue'
import LandingPage from '@/views/buyer/child-page/LandingPage.vue'
import AuctionListPage from '@/views/buyer/child-page/AuctionListPage.vue'
import ReportUserPage from '@/views/buyer/child-page/ReportUserPage.vue'
const buyer_router = [
  {
    name: 'all-page-buyer',
    path: '/',
    component: ManagerAllPage,
    children: [
      {
        name: 'auction-list',
        path: '/auctions',
        component: AuctionListPage,
        meta: {
          requiresAuth: false,
        },
      },
      {
        name: 'auction-detail',
        path: '/auctions/:id',
        component: ProductDetailPage,
        meta: {
          requiresAuth: false,
          roles: [ENUM.BUYER.ROLE_ID],
        },
      },
        {
        name: 'report-page',
        path: '/report/:id',
        component: ReportUserPage,
        meta: {
          requiresAuth: false,
        },
      },
      {
        name: 'landing-page',
        path: '/',
        component: LandingPage,
        meta: {
          requiresAuth: false,
          roles: [ENUM.BUYER.ROLE_ID],
        },
      },
      {
        name: 'bought',
        path: '/bought',
        component: BoughtPage
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
  }
]

export default buyer_router
export const defaultBuyerRoute = 'all-page-buyer'
