const stringIsIntegerAndBiggerThanZeroValidator = (inp) => {
    if(!Number.isInteger(inp)){
        return false
    }
    const parsedNum = parseInt(inp)
    if(parsedNum > 0){
        return true
    }
    return false
}
const stringIsIntegerAndBiggerThanOrEqualZeroValidator = (inp) => {
    if(!Number.isInteger(inp)){
        return false
    }
    const parsedNum = parseInt(inp)
    if(parsedNum >= 0){
        return true
    }
    return false
}

export default {
    stringIsIntegerAndBiggerThanZeroValidator,
    stringIsIntegerAndBiggerThanOrEqualZeroValidator
}