// admin_router.js
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminManageUsers from '@/views/admin/AdminManageUsers.vue'
import AdminManageBrands from '@/views/admin/AdminManageBrands.vue'
import AdminManageCategories from '@/views/admin/AdminManageCategories.vue'
import AdminReviewAuctions from '@/views/admin/AdminReviewAuctions.vue'
// Import other admin views as needed

const admin_router = [
  {
    name: 'admin-dashboard',
    path: '/admin/dashboard',
    component: AdminDashboard,
    // meta: {
    //   requiresAuth: true, // Requires authentication for admin dashboard
    //   roles: [ENUM.ADMIN.ROLE_ID], // Replace with your admin role ID
    // },
  },
  {
    name: 'admin-manage-users',
    path: '/admin/manage-users',
    component: AdminManageUsers,
    // meta: {
    //   requiresAuth: true,
    //   roles: [ENUM.ADMIN.ROLE_ID],
    // },
  },
  {
    name: 'admin-manage-brands',
    path: '/admin/manage-brands',
    component: AdminManageBrands,
    // meta: {
    //   requiresAuth: true,
    //   roles: [ENUM.ADMIN.ROLE_ID],
    // },
  },
  {
    name: 'admin-manage-categories',
    path: '/admin/manage-categories',
    component: AdminManageCategories,
    // meta: {
    //   requiresAuth: true,
    //   roles: [ENUM.ADMIN.ROLE_ID],
    // },
  },
  {
    name: 'admin-review-auctions',
    path: '/admin/review-auctions',
    component: AdminReviewAuctions,
    // meta: {
    //   requiresAuth: true,
    //   roles: [ENUM.ADMIN.ROLE_ID],
    // },
  },
  // Add more admin routes as needed
]

export default admin_router
