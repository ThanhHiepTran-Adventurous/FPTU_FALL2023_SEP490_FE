// admin_router.js
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminManageUsers from '@/views/admin/AdminManageUsers.vue'
import AdminManageBrands from '@/views/admin/AdminManageBrands.vue'
import AdminManageCategories from '@/views/admin/AdminManageCategories.vue'
import AdminReviewAuctions from '@/views/admin/AdminReviewAuctions.vue'
import AdminManageWitdraw from '@/views/admin/AdminManageWithdraw.vue'
import AdminManageTransaction from '@/views/admin/AdminManageTransaction.vue'
import AdminSystemConfig from '@/views/admin/AdminSystemConfig.vue'

// Import other admin views as needed

const admin_router = [
  {
    name: 'admin-dashboard',
    path: '/admin/dashboard',
    component: AdminDashboard,
  },
  {
    name: 'admin-manage-users',
    path: '/admin/manage-users',
    component: AdminManageUsers,
  },
  {
    name: 'admin-manage-brands',
    path: '/admin/manage-brands',
    component: AdminManageBrands,
  },
  {
    name: 'admin-manage-categories',
    path: '/admin/manage-categories',
    component: AdminManageCategories,
  },
  {
    name: 'admin-review-auctions',
    path: '/admin/review-auctions',
    component: AdminReviewAuctions,
  },
  {
    name: 'admin-manage-withdraw',
    path: '/admin/manage-withdraw',
    component: AdminManageWitdraw,
  },
  {
    name: 'admin-manage-transaction',
    path: '/admin/manage-transaction',
    component: AdminManageTransaction,
  },
  {
    name: 'admin-manage-system',
    path: '/admin/system-config',
    component: AdminSystemConfig
  }
  // Add more admin routes as needed
]


export default admin_router
