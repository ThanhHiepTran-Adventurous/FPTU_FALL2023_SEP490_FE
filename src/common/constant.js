export default {
  buttonTypes: {
    ACTION: 'action',
    OUTLINE: 'outline',
    DISABLED: 'disabled',
  },
  inputTypes: {
    TEXT: 'text',
    PASSWORD: 'password',
    DATE: 'date',
  },
}

export const buyerTabs = {
  bought: {
    value: 'Thắng đấu giá',
    icon: 'streamline:computer-desktop-check-success-approve-device-display-desktop-computer',
    navLink: '/bought',
  },
  order: {
    value: 'Lịch sử Đơn hàng',
    icon: 'fluent-mdl2:product-release',
    navLink: '/orders',
  },
  reported: {
    value: 'Lịch sử báo cáo',
    icon: 'fluent-mdl2:report-warning',
    navLink: '/reports',
  },
  refundRequest: {
    value: 'Đề nghị trả hàng',
    icon: 'akar-icons:arrow-back',
    navLink: '/refunds',
  },
  transaction: {
    value: 'Lịch sử giao dịch',
    navLink: '/transaction',
  },
  favorites: {
    value: 'Yêu thích',
    icon: 'streamline:interface-favorite-heart-reward-social-rating-media-heart-it-like-favorite-love',
    navLink: '/favorites',
  },
}

export const defaultRoute = {
  buyer: '/',
  seller: '/manage/product-inventory',
  admin: '/admin/dashboard',
  staff: '/staff/manage-ship-request',
}
