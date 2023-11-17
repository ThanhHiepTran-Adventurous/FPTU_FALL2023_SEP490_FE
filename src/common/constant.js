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
    navLink: '/bought/immediate',
  },
  order: {
    value: 'Lịch sử Đơn hàng',
    icon: 'fluent-mdl2:product-release',
    navLink: '/orders/immediate',
  },
  reported: {
    value: 'Lịch sử báo cáo',
    icon: 'fluent-mdl2:report-warning',
    navLink: '/reports/immediate',
  },
  refundRequest: {
    value: 'Đề nghị trả hàng',
    icon: 'akar-icons:arrow-back',
    navLink: '/refunds',
  },
  transaction: {
    value: 'Lịch sử giao dịch',
    icon: 'icon-park-outline:transaction',
    navLink: '/transaction',
  },
  favorites: {
    value: 'Yêu thích',
    icon: 'streamline:interface-favorite-heart-reward-social-rating-media-heart-it-like-favorite-love',
    navLink: '/favorites',
  },
}

export const sellerTabs = {
  productRepository: {
    value: 'Kho hàng',
    icon: 'fluent-mdl2:product-list',
    navLink: '/manage/product-inventory',
  },
  rejectedProductToAuction: {
    value: 'Yêu cầu đấu giá bị từ chối',
    icon: 'iconoir:error-window',
    navLink: '/manage/product-rejected',
  },
  onAuctioning: {
    value: 'Đang đấu giá',
    icon: 'material-symbols-light:alarm-on-outline',
    navLink: '/manage/on-selling',
  },
  onAuctioned: {
    value: 'Đấu giá hoàn thành',
    icon: 'streamline:computer-desktop-check-success-approve-device-display-desktop-computer',
    navLink: '/manage/auctioned',
  },
  orders: {
    value: 'Đơn hàng',
    icon: 'fluent-mdl2:product-release',
    navLink: '/manage/orders/immediate',
  },
  backOrders: {
    value: 'Đơn hàng trả về',
    icon: 'akar-icons:arrow-back',
    navLink: '/manage/return-request',
  },
  reported: {
    value: 'Lịch sử báo cáo',
    icon: 'fluent-mdl2:report-warning',
    navLink: '/manage/report/immediate',
  },
  transactions: {
    value: 'Lịch sử giao dịch',
    icon: 'icon-park-outline:transaction',
    navLink: '/manage/transaction',
  }
}

export const staffTabs = {
  shipRequests: {
    value: 'Yêu cầu giao hàng',
    icon: 'gridicons:shipping',
    navLink: '/staff/manage-ship-request',
  },
  allReports: {
    value: 'Danh sách khiếu nại',
    icon: 'ep:document',
    navLink: '/staff/report/unassigned'
  },
  reports: {
    value: 'Giải quyết khiếu nại',
    icon: 'fluent-mdl2:report-warning',
    navLink: '/staff/report/immediate'
  },
}

export const defaultRoute = {
  buyer: '/',
  seller: '/manage/product-inventory',
  admin: '/admin/dashboard',
  staff: '/staff/manage-ship-request',
}

export const SIMPLE_TABLE_ITEMS_PER_PAGE = 8