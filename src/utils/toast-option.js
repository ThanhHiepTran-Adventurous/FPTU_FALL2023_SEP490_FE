import { useToast } from "vue-toastification"

const toast = useToast()

const toastLoading = (id, message) => {
    const options = {
        id: id,
        icon: {
            iconClass: 'loading-toastification my-auto',
            iconChildren: '',
            iconTag:'div'
        },
        timeout: false,
        toastClassName: 'my-toast-default-color'
    }
    toast(message, options)
}

const toastLoadingMessage = (message) => {
    const options = {
        icon: {
            iconClass: 'loading-toastification my-auto',
            iconChildren: '',
            iconTag:'div'
        },
        timeout: false,
        toastClassName: 'my-toast-default-color'
    }
    return toast(message, options)
}

const updateLoadingToast = (id, message, isError) => {
    const options = {
        icon: true,
        type: isError ? 'error' : 'success',
        timeout: isError ? false : 3000,
        toastClassName: isError ? 'my-toast-error-color' : 'my-toast-success-color',
    }
    toast.update(id, {
        content: message,
        options: options
    })
}

const closeToast = (id) => {
    toast.dismiss(id)
}
const toastInformation = (message) => {
    const options = {
        type: 'info',
        timeout: 3000,
        toastClassName: 'my-toast-default-color'
    }
    toast(message, options)
}
const toastSuccess = (message) => {
    const options = {
        type: 'success',
        timeout: 3000,
        toastClassName: 'my-toast-success-color'
    }
    toast(message, options)
}
const toastError = (message) => {
    const options = {
        type: 'error',
        timeout: 3000,
        toastClassName: 'my-toast-error-color'
    }
    toast(message, options)
}
const updateToastId = (oldId, newId, newContent) => {
    toast.dismiss(oldId)
    toastLoading(newId, newContent)
}

export default {
   toastLoading, updateLoadingToast, toastInformation, toastSuccess, toastError, updateToastId, toastLoadingMessage, closeToast
}