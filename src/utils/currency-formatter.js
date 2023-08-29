const formatCurrency = (input) => {
    try {
        let currency = parseInt(input)
        return currency.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})
    } catch (e) {
        return ''
    }
}

export default formatCurrency