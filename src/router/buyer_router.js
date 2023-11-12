import ENUM from '@/common/enum.js'
import ManagerAllPage from '@/views/buyer/ManagerAllPage.vue'
import ComingSoonPage from '@/views/common/ComingSoonPage.vue'
import ProductDetailPage from '@/views/buyer/child-page/ProductDetailPage.vue'
import BoughtPageIntermediate from '@/views/buyer/child-page/bought_page/BoughtPageIntermediate.vue'
import BoughtPageImmediate from '@/views/buyer/child-page/bought_page/BoughtPageImmediate.vue'
import WishListPage from '@/views/buyer/child-page/WishlistPage.vue'
import ComparePage from '@/views/buyer/child-page/ComparePage.vue'
import LandingPage from '@/views/buyer/child-page/LandingPage.vue'
import AuctionListPage from '@/views/buyer/child-page/AuctionListPage.vue'
import ReportUserPage from '@/views/buyer/child-page/ReportUserPage.vue'
import OrdersPageIntermediate from '@/views/buyer/child-page/order_page/OrdersPageIntermediate.vue'
import OrdersPageImmediate from '@/views/buyer/child-page/order_page/OrdersPageImmediate.vue'
import ReportPage from '@/views/buyer/child-page/ReportPage.vue'
import TransactionPage from '@/views/buyer/child-page/TransactionPage.vue'
import RefundPage from '@/views/buyer/child-page/RefundPage.vue'
import ProfilePage from '@/views/common/ProfilePage.vue'

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
        name: 'bought-intermediate',
        path: '/bought/intermediate',
        component: BoughtPageIntermediate
      },
      {
        name: 'bought-immediate',
        path: '/bought/immediate',
        component: BoughtPageImmediate
      },
      {
        name: 'orders-intermediate',
        path: '/orders/intermediate',
        component: OrdersPageIntermediate,
      },
      {
        name: 'orders-immediate',
        path: '/orders/immediate',
        component: OrdersPageImmediate,
      },
      {
        name: 'reports',
        path: '/reports',
        component: ReportPage,
      },
      {
        name: 'refunds',
        path: '/refunds',
        component: RefundPage,
      },
      {
        name: 'transaction',
        path: '/transaction',
        component: TransactionPage,
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
  },
]

export default buyer_router
export const defaultBuyerRoute = 'all-page-buyer'
