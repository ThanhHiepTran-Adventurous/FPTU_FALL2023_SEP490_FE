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
            inventory: '/products'
        },
        auction: {
            getAuctions: '/auctions',
            sendAuctionRequest: '/auctions/{productId}/add-auction-product',
        }
    }
}

export const noImage = "https://firebasestorage.googleapis.com/v0/b/bidbay-project.appspot.com/o/No-Image-Placeholder.svg.png?alt=media"