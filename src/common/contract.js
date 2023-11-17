export const Role = {
  staff: {
    id: 4,
    value: 'STAFF',
  },
  admin: {
    id: 3,
    value: 'ADMIN',
  },
  seller: {
    id: 1,
    value: 'SELLER',
  },
  buyer: {
    id: 2,
    value: 'BUYER',
  },
}

export const AuctionModelType = {
  intermediate: 'INTERMEDIATE',
  immediate: 'IMMEDIATE',
}

export const ProductStatus = {
  ACTIVE: {
    label: 'TỒN TẠI',
    value: 'ACTIVE',
  },
  APPROVING: {
    label: 'ĐANG CHỜ DUYỆT',
    value: 'APPROVING',
  },
  REJECTED: {
    label: 'BỊ TỪ CHỐI',
    value: 'REJECTED',
  },
  ON_SELL: {
    label: 'ĐANG ĐẤU GIÁ',
    value: 'ON_SELL',
  },
  INACTIVE: {
    label: 'ĐÃ XÓA',
    value: 'INACTIVE',
  },
  SOLD: {
    label: 'ĐÃ BÁN',
    value: 'SOLD',
  },
  NOT_REACH_NUM_AUCTIONEER: {
    label: 'KHÔNG ĐỦ LƯỢT ĐẤU GIÁ',
    value: 'NOT_REACH_NUM_AUCTIONEER',
  },
  NOT_PAYMENT: {
    label: 'KHÔNG THANH TOÁN',
    value: 'NOT_PAYMENT',
  },
  PAID: {
    label: 'ĐÃ THANH TOÁN',
    value: 'PAID',
  },
}

export const BidType = {
  MANUAL: {
    label: 'Thủ công',
    value: 'MANUAL',
  },
  AUTO: {
    label: 'Tự động',
    value: 'AUTO',
  },
  DIRECT: {
    label: 'Mua ngay',
    value: 'DIRECT',
  },
}

export const NotiReadEnum = {
  READ: 'READ',
}

export const OrderStatus = {
  NEW: {
    value: 'NEW',
    icon: 'solar:box-broken',
    text: 'Đơn hàng được tạo',
    pendingText: '',
  },
  DELIVERING: {
    value: 'DELIVERING',
    icon: 'la:shipping-fast',
    text: 'Đơn hàng sẵn sàng được giao',
    pendingText: 'Đơn hàng đang chuẩn bị...',
  },
  DELIVERED: {
    value: 'DELIVERED',
    icon: 'flat-color-icons:shipped',
    text: 'Đơn hàng được giao',
    pendingText: 'Đơn hàng đang giao...',
  },
  CONFIRM_DELIVERY: {
    value: 'CONFIRM_DELIVERY',
    icon: 'mdi:box-success-outline',
    text: 'Xác nhận giao hàng',
    pendingText: 'Chờ xác nhận giao hàng...',
  },
  DONE: {
    value: 'DONE',
    icon: 'ep:success-filled',
    text: 'Đơn hàng hoàn tất',
    pendingText: 'Chờ bên mua xác nhận...',
  },
}

export const Configuration = {
  PaymentDeadline: {
    key: 'PAYMENTDEADLINE',
    value: 3,
  },
  ReturnPolicyDay: {
    key: 'RETURNPOLICYDAY',
    value: 0,
  },
  PercentageProfit: {
    key: 'PERCENTAGECONFIGVALUE',
    value: 0,
  },
}

export const StatusShipRequest = {
  waitingForConfirmation: {
    icon: 'mdi:package-variant-closed-delivered',
    label: 'Đang chờ xác nhận',
    value: 'WAITING_FOR_CONFIRMATION'
  },
  waitingForDelivery: {
    icon: 'iconamoon:delivery',
    label: 'Đang chờ vận chuyển',
    value: 'WAITING_FOR_DELIVERY'
  },
  onDelivery: {
    icon: 'carbon:delivery',
    label: 'Đang vận chuyển',
    value: 'ON_DELIVERY'
  },
  delivered: {
    icon: 'mdi:archive-success-outline',
    label: 'Đã vận chuyển',
    value: 'DELIVERED'
  },
  cancelled: {
    icon: 'mdi:package-variant-closed-remove',
    label: 'Đã bị hủy',
    value: 'CANCELLED'
  },
  returns: {
    icon: 'ri:refund-line',
    label: 'Trả hàng',
    value: 'RETURNS'
  }
}

export const ShipRequestType = {
  SELLER_SHIP: "SELLER_SHIP",
  BUYER_RETURN: "BUYER_RETURN"
}

export const ReportStatus = {
  PROCESSING: {
    label: "Đang xử lý",
    value: "PROCESSING"
  },
  PROCESSED: {
    label: "Đã xử lý",
    value: "CONFIRMED"
  },
  REJECTED: {
    label: "Từ chối xử lý",
    value: "REJECTED"
  },
}