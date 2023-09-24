<script setup>
import { Icon } from '@iconify/vue';
import { onMounted, ref, watch } from 'vue';
import { base64Image } from '@/utils/imageFile'
import loginService from '../../services/login.service';
import locationService from '../../services/location.service'
import userService from '../../services/user.service'
import moment from 'moment';
import Dropdown from '@/components/common-components/Dropdown.vue';
import toast from '../../utils/toast-option'
import Modal from '@/components/common-components/Modal.vue';
import OtpInput from '@/components/common-components/OtpInput.vue';
import { Role } from '../../common/contract';

//------------------------------------------------------------
const isVerifyOtpShow = ref(false)
const isModalActive = ref(false)
const otp = ref("")
const newEmail = ref("")
const emailPassword = ref("")
const districts = ref([])
const selectedDistrict = ref({
    label: "",
    data: ""
})
const selectedProvince = ref({
    label: "",
    data: ""
})
const selectedWard = ref({
    label: "",
    data: ""
})
const provinces = ref([])
const wards = ref([])
const isInEditMode = ref(false)

const profileModelData = ref({
    name: "",
    birthday: "",
    address: "",
})

const profileModel = ref({
    name: "",
    birthday: "",
    createdAt: "",
    phone: "",
    email: "",
    address: "",
    imageUrl: "",
    isCCVerified: false,
    role: "",
    fileFront: "",
    fileBack: "",
})

const fileFrontImg = ref(undefined)
const fileBackImg = ref(undefined)
const fileAvatar = ref(undefined)

const backImgSrc = ref('')
const frontImgSrc = ref('')
const avtImgSrc = ref('')

const handleFileFrontUpload = async (e) => {
    fileFrontImg.value = e.target.files[0]
    frontImgSrc.value = await base64Image(fileFrontImg.value)
}

const handleFileBackUpload = async (e) => {
    fileBackImg.value = e.target.files[0]
    backImgSrc.value = await base64Image(fileBackImg.value)
}

const handleFileAvtUpload = async (e) => {
    fileAvatar.value = e.target.files[0]
    avtImgSrc.value = await base64Image(fileAvatar.value)
}

const setProfileModel = (userInfo) => {
    profileModel.value.address = userInfo.address
    profileModel.value.createdAt = userInfo.createAt
    profileModel.value.birthday = userInfo.birthday
    profileModel.value.phone = userInfo.phoneNum
    profileModel.value.email = userInfo.email
    profileModel.value.name = userInfo.fullname
    profileModel.value.imageUrl = userInfo.avatarUrl
    profileModel.value.isCCVerified = userInfo.citizenCardVerified
    profileModel.value.role = userInfo.role
}
const setProfileModelData = (userInfo) => {
    profileModelData.value.address = ""
    profileModelData.value.birthday = userInfo.birthday ? moment(userInfo.birthday).format("YYYY-MM-DD") : ""
    profileModelData.value.name = userInfo.fullname
}
const resetProfileModelData = () => {
    profileModelData.value.address = ""
    profileModelData.value.birthday = profileModel.value.birthday ? moment(profileModel.value.birthday).format("YYYY-MM-DD") : ""
    profileModelData.value.name = profileModel.value.name
    selectedDistrict.value = {
        label: "",
        data: ""
    }
    selectedProvince.value = {
        label: "",
        data: "",
    }
    selectedWard.value = {
        label: "",
        data: "",
    }
    districts.value = []
    wards.value = []
}

const onUploadImage = () => {
    let formData = new FormData()
    formData.append('image', fileAvatar.value)

    userService.updateAvatar(formData).then(response => {
        fetchUserdata()
        toast.toastSuccess("Cập nhật avatar thành công.")
    }).catch(err => {
        toast.toastError("Không thể cập nhật avatar, có thể file quá lớn hoặc do hệ thống.")
    })
}

const onPostCCCD = () => {
    let formData = new FormData()
    formData.append('frontImage', fileFrontImg.value)
    formData.append('backImage', fileBackImg.value)

    const toastId = toast.toastLoadingMessage("Hệ thống đang kiểm tra căn cước của bạn")

    userService.uploadCCCD(formData).then(response => {
        toast.updateLoadingToast(toastId, "Kiểm tra thành công", false)
        fetchUserdata()
    }).catch(err => {
        const messageError = err.response.data.message
        if(messageError.includes("Unable to find ID card in the image")){
            toast.updateLoadingToast(toastId, "Không tìm thấy ID trong căn cước của bạn, kiểm tra thất bại.", true)
        } else if(messageError.includes("Send pictures in the correct order from front to back")) {
            toast.updateLoadingToast(toastId, "Bạn hãy nhập đúng thứ tự hình mặt trước và mặt sau", true)
        } else {
            toast.updateLoadingToast(toastId, "Kiểm tra thất bại, mời bạn thử lại bằng hình khác.", true)
        }
        fetchUserdata()
    })

}
const onUpdateEmailClick = () => {
    isModalActive.value = true
}
const onUpdateCancel = () => {
    resetProfileModelData()
    isInEditMode.value = false
}
const onSaveUpdate = () => {
    const data = {
        fullname: profileModelData.value.name,
        birthday: profileModelData.value.birthday,
        addressNum: profileModelData.value.address,
        province: selectedProvince.value.label,
        district: selectedDistrict.value.label,
        ward: selectedWard.value.label
    }
    const toastId = toast.toastLoadingMessage("Đang cập nhật thông tin của bạn")
    userService.updateProfileData(data).then(_ => {
        fetchUserdata().then(() => onUpdateCancel())
        toast.updateLoadingToast(toastId, "Cập nhật thông tin thành công", false)
    })
        .catch(_ => {
            toast.updateLoadingToast(toastId, "Có lỗi khi cập nhật thông tin", true)
        })
}
const onOtpInputChange = (value) => {
    otp.value = value
}

const sendEmail = async () => {
    userService.updateEmail(newEmail.value, emailPassword.value)
        .then(response => {
            toast.toastSuccess("Thành công. Mời bạn kiểm tra email và nhập mã OTP")
            isVerifyOtpShow.value = true
        })
        .catch(err => {
            if(err.response.data.message.includes("password")){
                toast.toastError("Mật khẩu nhập vào không đúng")
            } else {
                toast.toastError("Có lỗi khi gửi yêu cầu")
            }
        })

}
const resendOtp = async () => {
    userService.resendEmailOtp(newEmail.value)
    .then(response => {
    	toast.toastSuccess("Yêu cầu gửi lại OTP thành công")
    })
    .catch(error => toast.toastError("Yêu cầu gửi lại OTP thất bại"))
}
const confirmOtp = async () => {
    userService.verifyEmailOtp(otp.value, newEmail.value).then(response => {
        toast.toastSuccess("Cập nhật email thành công.")
        isVerifyOtpShow.value = false
        isModalActive.value = false
        isInEditMode.value = false
        fetchUserdata()
    }).catch(_ => {
        toast.toastError("Mã không đúng hoặc có lỗi khi xử lý.")
    })
}

watch(selectedProvince, async () => {
    const districtsFetch = await locationService.fetchAllDistrictOfProvinces(selectedProvince.value.data)
    districts.value = districtsFetch.data.map(p => {
        return {
            label: p.name,
            data: p.code
        }
    })
})

watch(selectedDistrict, async () => {
    const wardFetch = await locationService.fetchAllWardOfDistrict(selectedDistrict.value.data)
    wards.value = wardFetch.data.map(p => {
        return {
            label: p.name,
            data: p.code
        }
    })
})

const fetchUserdata = async () => {
    const userInfo = await loginService.fetchUserInfo()
    setProfileModel(userInfo.data)
    setProfileModelData(userInfo.data)
    if(userInfo.data.role === Role.seller.value){
        fetchCCCD()
    }
}

const fetchCCCD = async () => {
    const data = await userService.getCCCD()
    profileModel.value.fileFront = data.data.imageFront
    profileModel.value.fileBack = data.data.imageBack
}

onMounted(async () => {
    await fetchUserdata()
    const provincesFetch = await locationService.fetchAllProvinces()
    provinces.value = provincesFetch.data.map(p => {
        return {
            label: p.name,
            data: p.code
        }
    })
})

</script>
<template>
    <div class="h-full bg-gray-200 p-8">
        <Modal v-if="isModalActive" title="Xác thực email" @decline-modal="() => isModalActive = false"
            width-class="w-[600px] top-[100px]" :has-button="false">
            <div class="w-full flex items-center">
                <div class="tt-item bg-white w-[100%]">
                    <div class="form-default mb-8">
                        <div v-if="!isVerifyOtpShow">
                            <div class="w-full flex flex-col items-center">
                                <h2 class="tt-title text-center mb-3">NHẬP EMAIL MỚI</h2>
                                <input v-model="newEmail" type="email"
                                    class="bg-white focus:bg-gray-50 border border-gray-300 text-gray-900 w-[60%] text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block py-2" />
                            </div>
                            <div class="w-full flex flex-col items-center">
                                <h2 class="tt-title text-center my-3">XÁC NHẬN MẬT KHẨU</h2>
                                <input v-model="emailPassword" type="password"
                                    class="bg-white focus:bg-gray-50 border border-gray-300 text-gray-900 w-[60%] text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block py-2" />
                            </div>
                            <div class="w-full mt-4 gap-6 flex justify-center">
                                <button class="btn btn-border" @click="resendOtp">GỬI LẠI</button>
                                <button class="btn btn-primary" @click="sendEmail">GỬI MÃ CODE</button>
                            </div>
                        </div>
                        <div v-if="isVerifyOtpShow">
                            <div class="w-full flex flex-col items-center">
                                <h2 class="tt-title text-center my-3">NHẬP MÃ OTP</h2>
                                <OtpInput @valueChange="onOtpInputChange" />
                            </div>
                            <div class="w-full mt-4 gap-6 flex justify-center">
                                <button class="btn btn-primary" @click="confirmOtp">XÁC NHẬN</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
        <div class="bg-white rounded-lg shadow-xl pb-8">
            <div class="w-full h-[250px]">
                <img src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg" alt="avt"
                    class="w-full h-full rounded-tl-lg rounded-tr-lg">
            </div>
            <div class="flex flex-col items-center -mt-20">
                <img @click="$refs.fileAvt.click()"
                    :src="avtImgSrc || profileModel.imageUrl || 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg'"
                    alt="avt" class="w-40 h-40 border-4 border-white rounded-full">

                <input type="file" hidden v-on:change="handleFileAvtUpload($event)" ref="fileAvt" />
                <button @click="() => onUploadImage()"
                    class="flex items-center bg-blue-600 hover:bg-[#437b9c] text-gray-100 mt-3 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
                    <Icon icon="tdesign:upload" />
                    <span>Upload image</span>
                </button>
                <div class="flex items-center space-x-2">
                    <p class="text-2xl">{{ profileModel.name }}</p>
                    <span v-if="profileModel.isCCVerified === true" class="bg-blue-500 rounded-full p-1" title="Verified">
                        <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-100 h-2.5 w-2.5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </span>
                </div>
                <p class="text-sm text-gray-500">{{ profileModel.address }}</p>
            </div>
        </div>

        <div class="my-4 flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4">
            <div class="w-full flex flex-col" :class="{ '2xl:w-[40%]': profileModel.role === Role.seller }">
                <div class="flex-1 bg-white rounded-lg shadow-xl p-8">
                    <div class="flex items-center">
                        <div class="text-xl text-gray-900 font-bold mr-3">Thông tin cá nhân</div>
                        <Icon icon="iconamoon:edit-duotone"
                            class="text-[26px] text-blue-500 hover:cursor-pointer hover:text-blue-600"
                            @click="isInEditMode = true" />
                    </div>
                    <ul class="mt-2 text-gray-700">
                        <li class="flex border-y py-2">
                            <span class="font-bold w-28">Tên:</span>
                            <input v-if="isInEditMode" v-model="profileModelData.name" type="text"
                                class="bg-white focus:bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block py-1 w-[60%]" />
                            <span v-else class="text-gray-700">{{ profileModel.name }}</span>
                        </li>
                        <li class="flex border-b py-2">
                            <span class="font-bold w-28">Ngày sinh:</span>
                            <input v-if="isInEditMode" v-model="profileModelData.birthday" type="date"
                                class="bg-white focus:bg-gray-50 border border-gray-300 text-gray-900 w-[60%] text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block py-1" />
                            <span v-else class="text-gray-700">{{ profileModel.birthday ?
                                moment(profileModel.birthday).format("DD/MM/YYYY HH:MM:ss") : "N/A" }}</span>
                        </li>
                        <li class="flex border-b py-2">
                            <span class="font-bold w-28">Tạo ngày:</span>
                            <span class="text-gray-700">{{ moment(profileModel.createdAt).format("DD/MM/YYYY HH:MM:ss")
                            }}</span>
                        </li>
                        <li class="flex border-b py-2">
                            <span class="font-bold w-28">Điện thoại:</span>
                            <span class="text-gray-700">{{ profileModel.phone }}</span>
                        </li>
                        <li class="flex border-b py-2">
                            <span class="font-bold w-28">Email:</span>
                            <button v-if="isInEditMode" @click="onUpdateEmailClick"
                                class="flex items-center bg-blue-600 hover:bg-[#437b9c] text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
                                <span>Thay đổi email</span>
                            </button>
                            <span v-else class="text-gray-700">{{ profileModel.email || "N/A" }}</span>
                        </li>
                        <li class="flex border-b py-2">
                            <span class="font-bold w-28">Địa chỉ:</span>
                            <div v-if="isInEditMode" class="w-full ml-4">
                                <input v-model="profileModelData.address" type="text"
                                    class="bg-white focus:bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block py-1 w-[63%]" />
                                <div class="flex flex-col w-[full] gap-3 mt-3">
                                    <div class="flex flex-col items-left gap-1">
                                        <div>Tỉnh / Thành phố:</div>
                                        <Dropdown v-model="selectedProvince" :data="provinces" class="!w-[300px]" />
                                    </div>
                                    <div class="flex flex-col items-left gap-1">
                                        <div>Quận / Huyện:</div>
                                        <Dropdown v-model="selectedDistrict" :data="districts" class="!w-[300px]" />
                                    </div>
                                    <div class="flex flex-col items-left gap-1">
                                        <div>Phường / Xã:</div>
                                        <Dropdown v-model="selectedWard" :data="wards" class="!w-[300px]" />
                                    </div>
                                </div>
                            </div>
                            <span v-else class="text-gray-700">{{ profileModel.address || "N/A" }}</span>
                        </li>
                    </ul>
                    <div class="flex items-center" v-if="isInEditMode">
                        <button @click="onUpdateCancel"
                            class="flex items-center bg-[#E4E6EA] hover:!bg-gray-300 text-gray-800 mt-3 px-4 py-2 rounded text-sm space-x-2 transition duration-100 mr-2">
                            <span>Hủy</span>
                        </button>
                        <button @click="onSaveUpdate"
                            class="flex items-center bg-blue-600 hover:bg-[#437b9c] text-gray-100 mt-3 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
                            <span>Lưu</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex flex-col w-full 2xl:w-2/3" >
                <div class="flex-1 bg-white rounded-lg shadow-xl p-8">
                    <div class="flex items-center justify-between">
                        <div class="text-xl text-gray-900 font-bold">Căn cước công dân</div>
                        <div v-if="profileModel.isCCVerified === true"
                            class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Đã phê duyệt
                        </div>
                        <div v-else class="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Chưa phê
                            duyệt</div>
                    </div>
                    <div class="flex items-center flex-col md:flex-row gap-4">
                        <div class="w-full md:w-[50%] flex justify-center">
                            <article aria-label="File Upload Modal"
                                class="relative flex flex-col bg-white shadow-xl rounded-md overflow-hidden"
                                :class="{'w-[464px] h-[256px]' :!profileModel.isCCVerified && !frontImgSrc}">
                                <input type="file" hidden v-on:change="handleFileFrontUpload($event)" ref="fileFront" />
                                <section v-if="!profileModel.isCCVerified && !frontImgSrc" class="overflow-auto p-8 w-full h-full flex flex-col">
                                    <header
                                        class="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                                        <p class="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                                            <span>Tải lên <span class="text-red-500">mặt trước</span> căn cước</span>
                                        </p>
                                        <button @click="$refs.fileFront.click()"
                                            class="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none">
                                            Tải lên
                                        </button>
                                    </header>
                                </section>
                                <div v-else class="w-full h-full" @click="profileModel.isCCVerified || $refs.fileFront.click()">
                                    <img :src="profileModel.fileFront || frontImgSrc" alt="mặt trước" />
                                </div>
                            </article>
                        </div>
                        <div class="w-full md:w-[50%] flex justify-center">
                            <article aria-label="File Upload Modal"
                                class="relative flex flex-col bg-white shadow-xl rounded-md overflow-hidden"
                                :class="{'w-[464px] h-[256px]' :!profileModel.isCCVerified && !backImgSrc}">
                                <input type="file" hidden v-on:change="handleFileBackUpload($event)" ref="fileBack" />
                                <section v-if="!profileModel.isCCVerified && !backImgSrc" class="overflow-auto p-8 w-full h-full flex flex-col">
                                    <header
                                        class="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                                        <p class="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                                            <span>Tải lên <span class="text-red-500">mặt sau</span> căn cước</span>
                                        </p>
                                        <button @click="$refs.fileBack.click()"
                                            class="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none">
                                            Tải lên
                                        </button>
                                    </header>
                                </section>
                                <div v-else class="w-full h-full" @click="profileModel.isCCVerified  || $refs.fileBack.click()">
                                    <img :src="profileModel.fileBack || backImgSrc" alt="Mặt sau" class="object-contain" />
                                </div>
                            </article>
                        </div>
                    </div>
                    <div v-if="!profileModel.isCCVerified === true" class="w-full text-center flex justify-center mt-3">
                        <button @click="() => onPostCCCD()"
                            class="flex items-center bg-blue-600 hover:bg-[#437b9c] text-gray-100 mt-3 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
                            <Icon icon="tdesign:upload" />
                            <span>Gửi yêu cầu kiểm tra căn cước</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>