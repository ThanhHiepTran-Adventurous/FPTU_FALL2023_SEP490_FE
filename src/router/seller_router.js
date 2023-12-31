import ManagerAllPage from '@/views/seller/ManagerAllPage.vue'
import ComingSoonPage from '@/views/common/ComingSoonPage.vue'
import ProductStore from '@/components/manage-product/ProductStore.vue'
import ProductAuction from '@/components/manage-product/ProductAuction.vue'
import ProductReject from '@/components/manage-product/ProductReject.vue'
import ProductReportImmediate from '@/views/seller/report_page/ReportPageImmediate.vue'
import ProductReportIntermediate from '@/views/seller/report_page/ReportPageIntermediate.vue'
import Transaction from '@/components/manage-product/ProductTransactionHistory.vue'
import ProductInOrderImmediate from '@/components/manage-product/ProductInOrderImmediate.vue'
import ProductInOrderIntermediate from '@/components/manage-product/ProductInOrderIntermediate.vue'
import SellerReturnTrackPage from '@/views/seller/SellerReturnTrackPage.vue'
import WithdrawPage from '@/views/seller/WithdrawPage.vue'
import TestComponent from '@/views/TestComponent.vue'
import ProductSellImmediate from '@/components/manage-product/ProductSellImmediate.vue'
import ProductSellIntermediate from '@/components/manage-product/ProductSellIntermediate.vue'

const seller_router = [
  {
    name: 'all-page-seller',
    path: '/',
    component: ManagerAllPage,
    children: [
      {
        name: 'test',
        path: '/test',
        component: TestComponent
      },
      {
        name: 'product-store',
        path: '/manage/product-inventory',
        component: ProductStore,
      },
      {
        name: 'product-on-stock',
        path: '/manage/on-selling',
        component: ProductAuction,
      },
      {
        name: 'product-sold-immediate',
        path: '/manage/auctioned/immediate',
        component: ProductSellImmediate,
      },
      {
        name: 'product-sold-intermediate',
        path: '/manage/auctioned/intermediate',
        component: ProductSellIntermediate,
      },
      {
        name: 'product-rejected',
        path: '/manage/product-rejected',
        component: ProductReject,
      },
      {
        name: 'withdraw-seller',
        path: '/seller/withdraw',
        component: WithdrawPage,
      },
      {
        name: 'product-in-order-immediate',
        path: '/manage/orders/immediate',
        component: ProductInOrderImmediate,
      },
      {
        name: 'product-transaction',
        path: '/manage/transaction',
        component: Transaction,
      },
      {
        name: 'product-in-order-intermediate',
        path: '/manage/orders/intermediate',
        component: ProductInOrderIntermediate,
      },
      {
        name: 'order-return',
        path: '/manage/return-request',
        component: SellerReturnTrackPage,
      },
      {
        name: 'product-report-immediate',
        path: '/manage/report/immediate',
        component: ProductReportImmediate,
      },
      {
        name: 'product-report-intermediate',
        path: '/manage/report/intermediate',
        component: ProductReportIntermediate,
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
