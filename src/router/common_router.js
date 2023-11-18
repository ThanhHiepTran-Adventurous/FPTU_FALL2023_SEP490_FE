import Messenger from '@/views/common/Messenger.vue'
import ProfilePageVue from '@/views/common/ProfilePage.vue'

// Import other admin views as needed

const common_router = [
  {
    name: 'messenger',
    path: '/messenger/:groupId',
    component: Messenger,
  },
  {
    name: 'profile',
    path: '/profile',
    component: ProfilePageVue
  }
]


export default common_router
