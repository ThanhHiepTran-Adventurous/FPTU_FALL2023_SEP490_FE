const SERVICE_URL = import.meta.env.VITE_SERVER_URL
const DOMAIN_URL = import.meta.env.VITE_DOMAIN_URL
const WS_URL = import.meta.env.VITE_WEB_SOCKET_SERVER_URL
const WS_AUTH = import.meta.env.VITE_WEB_SOCKET_AUTH

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
}

export default {
  domain: DOMAIN_URL,
  base: SERVICE_URL,
  ws: {
    base: WS_URL,
    subscribeFromChatGroupUrl: '/topic/messages/group/{groupId}',
    sendToChatGroupUrl: '/app/chat/{groupId}',
    authToken: WS_AUTH,
  },
  endpoint: {
    auth: {
      register: '/users/register',
      login: '/public/auth/login',
      logout: '/auth/logout',
      verifyOtp: '/users/register/otp/verify',
      resendOtp: '/users/register/otp/resend',
      refreshToken: '/auth/access-tokens/refresh',
      saveFcmToken: '/notification/fcmToken',
    },
    user: {
      info: '/users/access-token/information',
      getAll: '/users/listUser',
      getCitizenCard: '/citizenCard/imagesCitizenCard',
      verifyCitizenCard: '/citizenCard/verify-citizen-card',
      updateInfo: 'profiles/userProfile',
      updateAvatar: 'profiles/userProfile/image',
      resendEmailOtp: 'profiles/register/otp/resend',
      changeEmail: 'profiles/userProfile/changeEmail',
      verifyEmailOtp: 'profiles/userProfile/verifyOtpChangeEmail',
    },
    address: {
      allWardsOfDistrict: '/address/districts/{code}',
      allProvinces: '/address/provinces',
      allDistrictsOfProvince: '/address/provinces/{code}',
    },
    brand: {
      getAll: '/brands/listBrand',
      deleteById: '/brands/{brandId}',
      updateById: '/brands/{brandId}',
      create: '/brands',
    },
    category: {
      getAll: '/categories/listCategory',
    },
    product: {
      inventory: '/products',
      inventoryByUser: '/products/listProductBySeller',
      updateProductById: 'products/{productId}',
    },
    auctions: {
      getAll: '/auctions',
      getDetail: '/auctions/public/{id}/auction-detail',
      productAuctionRequest: '/auctions/{productId}/add-auction-product',
      approve: '/auctions/auction-sessions/{auctionId}/approve',
      reject: '/auctions/auction-sessions/{auctionId}/rejected',
      getHistoryBid: '/auctions/public/auction/{auctionId}',
      autoAuctionDetail: '/auctions/{auctionId}/auctionAutoInfo-detail',
      updateAutoAuction: '/auctions/buyer/edit-auto-auction-info/{autoAuctionId}',
      getListAuctionWin: '/auctions/getListAuctionWin',
      auctionBySeller: 'auctions/seller/getListAuction-authorize',
    },
    placeBid: {
      manual: 'auctions/buyer/manual-auction',
      auto: 'auctions/buyer/add-auto-auction-info/{auctionId}',
      buyNow: 'auctions/{auctionId}/direct-purchase-auction',
    },
    guest: {
      auctions: 'guest/auctions-guest',
      auctionDetail: 'guest/{id}/auction-detail-guest',
      auctionHistory: 'guest/auction-guest/{auctionId}',
      categories: 'guest/categories-guest',
      brands: 'guest/brands-guest',
    },
    chart: {
      countSeller: 'charts/countSellerInSystem',
      countBuyer: 'charts/countBuyerInSystem',
      countAuctionCompleted: 'charts/countAuctionCompleted',
      countAuctionInProcess: 'charts/countAuctionInProcess',
      countAuctionNew: 'charts/countAuctionNew',
      countAuctionRejected: 'charts/countAuctionRejected',
      countProductActive: 'charts/countProductActive',
      countProductApproving: 'charts/countProductApproving',
      countProductInActive: 'charts/countProductInActive',
      countProductOnSell: 'charts/countProductOnSell',
      countProductRejected: 'charts/countProductRejected',
      countProductSold: 'charts/countProductSold',
    },
    transaction: {
      option2VnPay: 'transaction/paymentAuctionOfOrder/vnPay',
      paymentForChatVnPay: 'transaction/paymentForMessaging/vnPay',
      getTransactionAdmin: 'transaction/admin/transactionsOfUser',
      getTransactionBuyerSeller: 'transaction/transactionsOfUser',
    },
    notification: {
      getAllNoti: 'notification/list-top-10-notification-user',
    },
    order: {
      getOrders: 'orders/user/getListOrder-authorize',
      newToDelivering: 'orders/{orderId}/Updated/NewToDelivering',
      deleveringToDelivered: 'orders/{orderId}/Updated/DeliveringToDelivered',
      deliveredToConfirmDelivery: 'orders/{orderId}/Updated/DeliveredToConfirmDelivery',
      deliveryToDone: 'orders/{orderId}/Confirm/ConfirmDeliveryToDone',
      getOrdersByAuctionId: 'orders/user/get-detail-order-by-auction-Id/{auctionId}',
      updateAdressBuyerOpt2: 'orders/buyer/{orderId}/edited-OrderOption-Two',
      updateAdressSellerOpt1: 'orders/{orderId}/edited-Order-Option-One',
    },
    chat: {
      getAllMessages: 'messageWebSocket/listMessageV2/{groupId}',
      getChatGroupInfo: 'messageWebSocket/chat-group-infoV2/{chatGroupId}',
      joinChatGroup: 'messageWebSocket/staff/join-chat-groupV2/{groupId}',
      createChatGroup: 'messageWebSocket/staff/create-chat-groupV2/{orderId}'
    },
    system: {
      getAllConfigData: 'systemConfig/getListSystemConfig',
    },
    ship: {
      sellerCreateShipRequest: 'shipRequest/seller/create-ship-request/{orderId}',
      getAllShipRequest: 'shipRequest/get-ship-request-not-login',
      cancelShipRequest: '',
      staffConfirmShipRequest: 'shipRequest/staff/confirm-to-waiting-for-delivery/{shipRequestId}',
      StaffChangeShipRequestToOnDelivery: 'shipRequest/staff/change-to-on-delivery/{shipRequestId}',
      StaffChangeShipRequestToDelivered: 'shipRequest/staff/change-to-delivered/{shipRequestId}',
      buyerConfirmDelivered: 'shipRequest/buyer/confirm-ship-request-delivered/{shipRequestId}',
    },
    withdrawAndRefunds: {
      getAllWithdraws: 'withdrawAndRefunds',
      adminConfirmSellerwithdrawOpt2:
        'withdrawAndRefunds/admin/{withdrawAndRefundRequestsId}/confirm-withdraw-request-option-two',
      sellerWithdrwaOpt2: 'withdrawAndRefunds/seller/{orderId}/create-withdraw-request-option-two',
    },
    report: {
      buyerReportSellerOpt1: 'report/buyer/report-seller-option1/{orderId}',
      sellerReportBuyerOpt1: 'report/seller/report-buyer-option1/{orderId}',
      getAllReportDataAdmin: 'report',
      getAllReportDataBuyerOrSeller: 'report/sellerOrBuyer/getAllReport',
      getAllReportDataStaff: 'report/staff/getAllReport',
      buyerReportSellerOpt2: 'report/buyer/report-seller-option2/{orderId}',
      confirmReportOpt1: 'report/staff/confirm-report/{reportId}',
      declineReportOpt1: 'report/staff/reject-report/{reportId}',
      confirmReportOpt2ForBuyer: 'report/staff/confirm-buyer-report/{reportId}',
      assignReport: 'report/staff/assign-report/{reportId}'
    },
  },
}

export const noImage =
  'https://firebasestorage.googleapis.com/v0/b/bidbay-project.appspot.com/o/No-Image-Placeholder.svg.png?alt=media'

export const defaultAvatar =
  'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg'
