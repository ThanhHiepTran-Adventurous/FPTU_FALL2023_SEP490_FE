const stringIsIntegerAndBiggerThanZeroValidator = (inp) => {
    try {
        const parsedNum = parseInt(inp)
        if(parsedNum > 0){
            return true
        }
    } catch (_) {
        return false
    }
}
const stringIsIntegerAndBiggerThanOrEqualZeroValidator = (inp) => {
    try {
        const parsedNum = parseInt(inp)
        if(parsedNum >= 0){
            return true
        }
    } catch (_) {
        return false
    }
}

export default {
    stringIsIntegerAndBiggerThanZeroValidator,
    stringIsIntegerAndBiggerThanOrEqualZeroValidator
}