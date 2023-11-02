import { createRouter, createWebHashHistory } from 'vue-router'
import buyer_routes, { defaultBuyerRoute } from './buyer_router'
import seller_routes, { defaultSellerRoute } from './seller_router'
import admin_router from './admin_router'
import staff_router from './staff_router'
import { useUserStore } from '@/stores/user.store'
import guest_router from './guest_router'

const ROUTE_NAMES = {
  SIGN_IN: 'all-page-buyer',
  SIGN_UP: 'create-account',
  FORGOT_PASSWORD: 'forgot-password',
  HOME: 'home',
}

const routes = [...buyer_routes, ...seller_routes, ...admin_router, ...guest_router, ...staff_router]

const router = createRouter({
  mode: 'history',
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const requireAuth = to.matched.some(record => record.meta.requiresAuth)
  const userStore = useUserStore()
  const userId = userStore.getUserIdAndGetFromLocalStorageIfNotExist()
  // const role = userStore.getRoleAndGetFromLocalStorageIfNotExist()

  if (requireAuth && !userId) {
    next({ name: ROUTE_NAMES.SIGN_IN })
  } else {
    next()
  }
})

export default router
