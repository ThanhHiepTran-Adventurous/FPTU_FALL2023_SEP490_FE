const getCurDateUTCMilis = () => {
    return new Date().getTime() - new Date().getTimezoneOffset()*60000
}

export default {
    getCurDateUTCMilis
}