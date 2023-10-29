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
        value: "Sản phẩm thắng đấu giá",
        navLink: "/bought"
    },
    order: {
        value: "Lịch sử Đơn hàng",
        navLink: "/orders"
    },
    reported: {
        value: "Lịch sử báo cáo",
        navLink: "/reports"
    },
    refundRequest: {
        value: "Đề nghị trả hàng",
        navLink: "/refunds"
    },
}

export const defaultRoute = {
    buyer : "/",
    seller : "/manage/product-inventory",
    admin : "/admin/dashboard"
}