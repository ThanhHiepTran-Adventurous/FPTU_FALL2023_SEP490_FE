const SERVICE_URL = import.meta.env.VITE_SERVER_URL
const DOMAIN_URL = import.meta.env.VITE_DOMAIN_URL
const WS_URL = import.meta.env.VITE_WEB_SOCKET_SERVER_URL
const WS_AUTH = import.meta.env.VITE_WEB_SOCKET_AUTH

export default {
  domain: DOMAIN_URL,
  base: SERVICE_URL,
  ws: {
    base: WS_URL,
    subscribeFromChatGroupUrl: "/topic/messages/group/{groupId}",
    sendToChatGroupUrl: "/app/chat/{groupId}",
    authToken: WS_AUTH
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
      auctions: 'guest/auctions',
      auctionDetail: 'guest/{id}/auction-detail',
      auctionHistory: 'guest/auction/{auctionId}',
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
      paymentForChatVnPay: 'transaction/paymentForMessaging/vnPay'
    },
    notification: {
      getAllNoti: 'notification/list-top-10-notification-user'
    },
    order: {
      getOrders: 'orders/user/getListOrder-authorize'
    }
  },
}

export const noImage =
  'https://firebasestorage.googleapis.com/v0/b/bidbay-project.appspot.com/o/No-Image-Placeholder.svg.png?alt=media'

export const defaultAvatar = 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg'
