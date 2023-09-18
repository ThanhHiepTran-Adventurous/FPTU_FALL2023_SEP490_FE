// admin_router.js
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminManageUsers from '@/views/admin/AdminManageUsers.vue'
import AdminManageProducts from '@/views/admin/AdminManageProducts.vue'
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
    name: 'admin-manage-products',
    path: '/admin/manage-products',
    component: AdminManageProducts,
    // meta: {
    //   requiresAuth: true,
    //   roles: [ENUM.ADMIN.ROLE_ID],
    // },
  },
  // Add more admin routes as needed
]

export default admin_router
