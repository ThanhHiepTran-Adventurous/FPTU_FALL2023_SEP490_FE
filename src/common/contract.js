export const Role = {
    admin: {
        id: 3,
        value: "ADMIN"
    },
    seller: {
        id: 1,
        value: "SELLER"
    },
    buyer: {
        id: 2,
        value: "BUYER"
    },
}

export const AuctionModelType = {
    intermediate: "INTERMEDIATE",
    immediate: "IMMEDIATE"
}

export const ProductStatus = {
    ACTIVE: {
        label: "TỒN TẠI",
        value: "ACTIVE"
    },
    APPROVING: {
        label: "ĐANG CHỜ DUYỆT",
        value: "APPROVING",
    },
    REJECTED: {
        label: "BỊ TỪ CHỐI",
        value: "REJECTED",
    },
    ON_SELL: {
        label: "ĐANG ĐẤU GIÁ",
        value: "ON_SELL",
    },
    INACTIVE: {
        label: "ĐÃ XÓA",
        value: "INACTIVE",
    },
    SOLD: {
        label: "ĐÃ BÁN",
        value: "SOLD",
    },
    NOT_REACH_NUM_AUCTIONEER: {
        label: "KHÔNG ĐỦ LƯỢT ĐẤU GIÁ",
        value: "NOT_REACH_NUM_AUCTIONEER"
    },
    NOT_PAYMENT: {
        label: "KHÔNG THANH TOÁN",
        value: "NOT_PAYMENT"
    },
    PAID: {
        label: "ĐÃ THANH TOÁN",
        value: "PAID"
    }
}

export const BidType = {
    MANUAL: {
        label: "Thủ công",
        value: "MANUAL"
    },
    AUTO: {
        label: "Tự động",
        value: "AUTO"
    },
    DIRECT: {
        label: "Mua ngay",
        value: "DIRECT"
    }
}

export const NotiReadEnum = {
    READ: "READ"
}