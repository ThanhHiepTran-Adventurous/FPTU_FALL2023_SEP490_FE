const SERVICE_URL = import.meta.env.VITE_SERVER_URL

export default {
    base: SERVICE_URL,
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
            verifyEmailOtp: 'profiles/userProfile/verifyOtpChangeEmail'
        },
        address: {
            allWardsOfDistrict: '/address/districts/{code}',
            allProvinces: '/address/provinces',
            allDistrictsOfProvince: '/address/provinces/{code}'
        },
        brand: {
          getAll: '/brands/listBrand',
          deleteById: '/brands/{brandId}',
          updateById: '/brands/{brandId}',
          create: '/brands',
        },
        category: {
            getAll: '/categories/listCategory'
        },
        product: {
            inventory: '/products',
            inventoryByUser: '/products/listProductBySeller'
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
        },
        placeBid: {
            manual: 'auctions/buyer/manual-auction',
            auto: 'auctions/buyer/add-auto-auction-info/{auctionId}',
            buyNow: 'auctions/{auctionId}/direct-purchase-auction',
        },
        guest: {
            auctions: 'guest/auctions',
            auctionDetail: 'guest/{id}/auction-detail',
            auctionHistory: 'guest/auction/{auctionId}'
        }
    }
}

export const noImage = "https://firebasestorage.googleapis.com/v0/b/bidbay-project.appspot.com/o/No-Image-Placeholder.svg.png?alt=media"
