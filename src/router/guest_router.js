import ENUM from '@/common/enum.js'
import CreateAccountPageVue from '@/views/common/CreateAccountPage.vue'

const guest_router = [
    {
        name: 'sign-up',
        path: '/register',
        component: CreateAccountPageVue,
        meta: {
          requiresAuth: false,
        },
    },
]

export default guest_router
