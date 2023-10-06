import { noImage } from "@/common/urlConstant"

const getPrimaryImageFromList = imgList => {
    return imgList && imgList.length > 0 ? imgList[0] : noImage
}
const getSecondaryImageFromList = imgList => {
    return imgList && imgList.length > 1 ? imgList[1] : imgList && imgList.length > 0 ? imgList[0] : noImage
}

export default {
    getPrimaryImageFromList, getSecondaryImageFromList
}