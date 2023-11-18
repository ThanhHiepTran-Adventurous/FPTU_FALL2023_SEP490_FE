<script setup>
import { Icon } from '@iconify/vue'
import { onMounted, ref, watch } from 'vue'
import { base64Image } from '@/utils/imageFile'
import loginService from '../../services/login.service'
import locationService from '../../services/location.service'
import userService from '../../services/user.service'
import moment from 'moment'
import Dropdown from '@/components/common-components/Dropdown.vue'
import toast from '../../utils/toast-option'
import Modal from '@/components/common-components/Modal.vue'
import OtpInput from '@/components/common-components/OtpInput.vue'
import { Role } from '../../common/contract'
import * as yup from 'yup'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { defaultAvatar } from '@/common/urlConstant'
import { useUserStore } from '@/stores/user.store'
import Navbar from '@/components/page-sections/Navbar.vue'

const userStore = useUserStore()

//------------------------------------------------------------
const isImageUpdating = ref(false)
const isVerifyOtpShow = ref(false)
const isModalActive = ref(false)

const otp = ref('')
const newEmail = ref('')
const emailPassword = ref('')
const districts = ref([])
const selectedDistrict = ref({
  label: '',
  data: '',
})
const selectedProvince = ref({
  label: '',
  data: '',
})
const selectedWard = ref({
  label: '',
  data: '',
})
const provinces = ref([])
const wards = ref([])
const isInEditMode = ref(false)

const profileModelData = ref({
  name: '',
  birthday: '',
  address: '',
})

const profileModel = ref({
  name: '',
  birthday: '',
  createdAt: '',
  phone: '',
  email: '',
  address: '',
  imageUrl: '',
  isCCVerified: false,
  role: '',
  fileFront: '',
  fileBack: '',
  bankAccountNumber: '',
  bankOwnerName: '',
  bankInformation: ''
})

const fileFrontImg = ref(undefined)
const fileBackImg = ref(undefined)
const fileAvatar = ref(undefined)

const backImgSrc = ref('')
const frontImgSrc = ref('')
const avtImgSrc = ref('')

const handleFileFrontUpload = async e => {
  fileFrontImg.value = e.target.files[0]
  frontImgSrc.value = await base64Image(fileFrontImg.value)
}

const handleFileBackUpload = async e => {
  fileBackImg.value = e.target.files[0]
  backImgSrc.value = await base64Image(fileBackImg.value)
}

const handleFileAvtUpload = async e => {
  fileAvatar.value = e.target.files[0]
  avtImgSrc.value = await base64Image(fileAvatar.value)
}

const setProfileModel = userInfo => {
  profileModel.value.address = userInfo.address
  profileModel.value.createdAt = userInfo.createAt
  profileModel.value.birthday = userInfo.birthday
  profileModel.value.phone = userInfo.phoneNum
  profileModel.value.email = userInfo.email
  profileModel.value.name = userInfo.fullname
  profileModel.value.imageUrl = userInfo.avatarUrl
  profileModel.value.isCCVerified = userInfo.citizenCardVerified
  profileModel.value.role = userInfo.role
  profileModel.value.bankAccountNumber = userInfo.bankAccountNumber
  profileModel.value.bankOwnerName = userInfo.bankOwnerName
  profileModel.value.bankInformation = userInfo.bankInformation
}
const setProfileModelData = (userInfo) => {
    profileModelData.value.address = ""
    profileModelData.value.birthday = userInfo.birthday ? moment.utc(userInfo.birthday).format("YYYY-MM-DD") : ""
    profileModelData.value.name = userInfo.fullname
    profileModelData.value.bankAccountNumber = userInfo.bankAccountNumber
    profileModelData.value.bankOwnerName = userInfo.bankOwnerName
    profileModelData.value.bankInformation = userInfo.bankInformation
}
const resetProfileModelData = () => {
    profileModelData.value.address = ""
    profileModelData.value.birthday = profileModel.value.birthday ? moment.utc(profileModel.value.birthday).format("YYYY-MM-DD") : ""
    profileModelData.value.name = profileModel.value.name
    profileModelData.value.bankAccountNumber = profileModel.value.bankAccountNumber
    profileModelData.value.bankOwnerName = profileModel.value.bankOwnerName
    profileModelData.value.bankInformation = profileModel.value.bankInformation
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

  isImageUpdating.value = true
  userService
    .updateAvatar(formData)
    .then(response => {
      fetchUserdata()
      toast.toastSuccess('Cập nhật avatar thành công.')
      isImageUpdating.value = false
    })
    .catch(err => {
      toast.toastError('Không thể cập nhật avatar, có thể file quá lớn hoặc do hệ thống.')
    })
}

const onPostCCCD = () => {
  let formData = new FormData()
  formData.append('frontImage', fileFrontImg.value)
  formData.append('backImage', fileBackImg.value)

  const toastId = toast.toastLoadingMessage('Hệ thống đang kiểm tra căn cước của bạn')

  userService
    .uploadCCCD(formData)
    .then(response => {
      toast.updateLoadingToast(toastId, 'Kiểm tra thành công', false)
      fetchUserdata()
    })
    .catch(err => {
      const messageError = err.response.data.message
      if (messageError.includes('Unable to find ID card in the image')) {
        toast.updateLoadingToast(toastId, 'Không tìm thấy ID trong căn cước của bạn, kiểm tra thất bại.', true)
      } else if (messageError.includes('Send pictures in the correct order from front to back')) {
        toast.updateLoadingToast(toastId, 'Bạn hãy nhập đúng thứ tự hình mặt trước và mặt sau', true)
      } else if (messageError.includes('This citizen card already existed in system')) {
        toast.updateLoadingToast(
          toastId,
          'Ảnh căn cước công dân đã tồn tại trong hệ thống, mời bạn thử lại bằng hình khác',
          true,
        )
      } else {
        toast.updateLoadingToast(toastId, 'Kiểm tra thất bại, mời bạn thử lại bằng hình khác.', true)
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
    ward: selectedWard.value.label,
    bankAccountNumber: profileModelData.value.bankAccountNumber,
    bankOwnerName: profileModelData.value.bankOwnerName,
    bankInformation: profileModelData.value.bankInformation
  }
  const toastId = toast.toastLoadingMessage('Đang cập nhật thông tin của bạn')
  userService
    .updateProfileData(data)
    .then(_ => {
      fetchUserdata().then(() => onUpdateCancel())
      toast.updateLoadingToast(toastId, 'Cập nhật thông tin thành công', false)
    })
    .catch(_ => {
      toast.updateLoadingToast(toastId, 'Có lỗi khi cập nhật thông tin', true)
    })
}
const onOtpInputChange = value => {
  otp.value = value
}

// validate email schema
const schemaEmail = yup.object().shape({
  newEmail: yup.string().email('Email không hợp lệ').required('Email không được để trống'),
  emailPassword: yup.string().required('Mật khẩu không được để trống'),
})
const validateEmail = ref(true)

// -----------------------------
const sendEmail = async () => {
  try {
    await schemaEmail.validate(newEmail.value, { abortEarly: false })
  } catch (validationErrors) {
    return
  }
  validateEmail.value = true

  if (validateEmail) {
    userService
      .updateEmail(newEmail.value, emailPassword.value)
      .then(response => {
        toast.toastSuccess('Thành công. Mời bạn kiểm tra email và nhập mã OTP')
        isVerifyOtpShow.value = true
      })
      .catch(err => {
        if (err.response.data.message.includes('password')) {
          toast.toastError('Mật khẩu nhập vào không đúng')
        } else {
          toast.toastError('Có lỗi khi gửi yêu cầu')
        }
      })
  }
}
const resendOtp = async () => {
  userService
    .resendEmailOtp(newEmail.value)
    .then(response => {
      toast.toastSuccess('Yêu cầu gửi lại OTP thành công')
    })
    .catch(error => toast.toastError('Yêu cầu gửi lại OTP thất bại'))
}
const confirmOtp = async () => {
  userService
    .verifyEmailOtp(otp.value, newEmail.value)
    .then(response => {
      toast.toastSuccess('Cập nhật email thành công.')
      isVerifyOtpShow.value = false
      isModalActive.value = false
      isInEditMode.value = false
      fetchUserdata()
    })
    .catch(_ => {
      toast.toastError('Mã không đúng hoặc có lỗi khi xử lý.')
    })
}

watch(selectedProvince, async () => {
  const districtsFetch = await locationService.fetchAllDistrictOfProvinces(selectedProvince.value.data)
  districts.value = districtsFetch.data.map(p => {
    return {
      label: p.name,
      data: p.code,
    }
  })
})

watch(selectedDistrict, async () => {
  const wardFetch = await locationService.fetchAllWardOfDistrict(selectedDistrict.value.data)
  wards.value = wardFetch.data.map(p => {
    return {
      label: p.name,
      data: p.code,
    }
  })
})

const fetchUserdata = async () => {
  const userInfo = await loginService.fetchUserInfo()
  setProfileModel(userInfo.data)
  setProfileModelData(userInfo.data)
  if (userInfo.data.role === Role.seller.value) {
    fetchCCCD()
  }

  // sync the data in local storage
  userStore.setUsernameAndSaveToLocalStorage(userInfo.data.fullname)
  userStore.setAvatarUrlAndSaveToLocalStorage(userInfo.data.avatarUrl)
  userStore.setIsVerifiedCCCDAndSaveToLocalStorage(userInfo.data.citizenCardVerified)
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
      data: p.code,
    }
  })
})
</script>
<template>
  <Navbar />
  <div class="h-full bg-gray-200 p-8 mt-10">
    <Modal
      v-if="isModalActive"
      title="Xác thực email"
      @decline-modal="() => (isModalActive = false)"
      width-class="w-[600px] top-[100px]"
      :has-button="false">
      <Form @submit="sendEmail" :validation-schema="schemaEmail">
        <div class="w-full flex items-center">
          <div class="tt-item bg-white w-[100%]">
            <div class="form-default mb-8">
              <div v-if="!isVerifyOtpShow">
                <div class="w-full flex flex-col items-center">
                  <h2 class="tt-title text-center mb-3">NHẬP EMAIL MỚI</h2>

                  <Field
                    name="newEmail"
                    type="email"
                    v-model="newEmail"
                    class="bg-white focus:bg-gray-50 border border-gray-300 text-gray-900 w-[60%] text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block py-2" />

                  <ErrorMessage as="div" name="newEmail" class="text-start text-danger pt-2 fs-6" />
                </div>
                <div class="w-full flex flex-col items-center">
                  <h2 class="tt-title text-center my-3">XÁC NHẬN MẬT KHẨU</h2>
                  <Field
                    name="emailPassword"
                    type="password"
                    v-model="emailPassword"
                    class="bg-white focus:bg-gray-50 border border-gray-300 text-gray-900 w-[60%] text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block py-2" />

                  <ErrorMessage as="div" name="emailPassword" class="text-start text-danger pt-2 fs-6" />
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
      </Form>
    </Modal>
    <div class="bg-white rounded-lg shadow-xl pb-8">
      <div class="w-full h-[250px]">
        <img
          src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"
          alt="avt"
          class="w-full h-full rounded-tl-lg rounded-tr-lg" />
      </div>
      <div class="flex flex-col items-center -mt-20">
        <img
          @click="$refs.fileAvt.click()"
          :src="avtImgSrc || profileModel.imageUrl || defaultAvatar"
          alt="avt"
          class="w-40 h-40 border-4 border-white rounded-full" />
          <button
          v-if="isImageUpdating"
          class="flex items-center justify-center w-[300px] bg-blue-400 hover:bg-[#437b9c] text-gray-100 mt-3 px-4 py-2 rounded text-sm space-x-2 transition duration-100 hover:cursor-not-allowed">
          <svg class="animate-spin h-5 w-5 mr-3 !text-white" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              class="opacity-100"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Đang cập nhật...</span>
        </button>
        <button
          v-else
          @click="() => onUploadImage()"
          class="flex items-center justify-center bg-blue-600 w-[300px] hover:bg-[#437b9c] text-gray-100 mt-3 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
          <Icon icon="tdesign:upload" />
          <span>Cập nhật ảnh đại diện</span>
        </button>
        <div class="text-sm text-gray-500">{{ profileModel.address }}</div>
      </div>
    </div>

    <div class="my-4 flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4">
      <div class="w-full flex flex-col" :class="{ '2xl:w-[40%]': profileModel.role === Role.seller }">
        <div class="flex-1 bg-white rounded-lg shadow-xl p-8">
          <div class="flex items-center">
            <div class="text-xl text-gray-900 font-bold mr-3">Thông tin cá nhân</div>
            <Icon
              icon="iconamoon:edit-duotone"
              class="text-[26px] text-blue-500 hover:cursor-pointer hover:text-blue-600"
              @click="isInEditMode = true" />
          </div>
          <ul class="mt-2 text-gray-700">
            <li class="flex border-y py-2">
              <span class="font-bold w-28">Tên:</span>
              <input
                v-if="isInEditMode"
                v-model="profileModelData.name"
                type="text"
                class="bg-white focus:bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block py-1 w-[60%]" />
              <span v-else class="text-gray-700">{{ profileModel.name }}</span>
            </li>
            <li class="flex border-b py-2">
              <span class="font-bold w-28">Ngày sinh:</span>
              <input
                v-if="isInEditMode"
                v-model="profileModelData.birthday"
                type="date"
                class="bg-white focus:bg-gray-50 border border-gray-300 text-gray-900 w-[60%] text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block py-1" />
              <span v-else class="text-gray-700">{{
                profileModel.birthday ? moment(profileModel.birthday).format('DD/MM/YYYY') : 'N/A'
              }}</span>
            </li>
            <li class="flex border-b py-2">
              <span class="font-bold w-28">Tạo ngày:</span>
              <span class="text-gray-700">{{ profileModel.createdAt ? moment(profileModel.createdAt).format('DD/MM/YYYY') : 'N/A' }}</span>
            </li>
            <li class="flex border-b py-2">
              <span class="font-bold w-28">Điện thoại:</span>
              <span class="text-gray-700">{{ profileModel.phone }}</span>
            </li>
            <li class="flex border-b py-2">
              <span class="font-bold w-28">Email:</span>
              <button
                v-if="isInEditMode"
                @click="onUpdateEmailClick"
                class="flex items-center bg-blue-600 hover:bg-[#437b9c] text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
                <span>Thay đổi email</span>
              </button>
              <span v-else class="text-gray-700">{{ profileModel.email || 'N/A' }}</span>
            </li>
            <li class="flex border-b py-2">
              <span class="font-bold w-28">Địa chỉ:</span>
              <div v-if="isInEditMode" class="w-full ml-4">
                <input
                  v-model="profileModelData.address"
                  type="text"
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
              <span v-else class="text-gray-700">{{ profileModel.address || 'N/A' }}</span>
            </li>
            <li class="flex border-b py-2">
              <span class="font-bold w-28">Số tài khoản:</span>
              <input
                v-if="isInEditMode"
                v-model="profileModelData.bankAccountNumber"
                class="bg-white focus:bg-gray-50 border border-gray-300 text-gray-900 w-[60%] text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block py-1 px-2" />
              <span v-else class="text-gray-700">{{
                profileModel.bankAccountNumber ? profileModel.bankAccountNumber : 'N/A'
              }}</span>
            </li>
            <li class="flex border-b py-2">
              <span class="font-bold w-28">Tên ngân hàng:</span>
              <input
                v-if="isInEditMode"
                v-model="profileModelData.bankInformation"
                class="bg-white focus:bg-gray-50 border border-gray-300 text-gray-900 w-[60%] text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block py-1 px-2" />
              <span v-else class="text-gray-700">{{
                profileModel.bankInformation ? profileModel.bankInformation : 'N/A'
              }}</span>
            </li>
            <li class="flex border-b py-2">
              <span class="font-bold w-28">Tên chủ khoản:</span>
              <input
                v-if="isInEditMode"
                v-model="profileModelData.bankOwnerName"
                class="bg-white focus:bg-gray-50 border border-gray-300 text-gray-900 w-[60%] text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block py-1 px-2" />
              <span v-else class="text-gray-700">{{
                profileModel.bankOwnerName ? profileModel.bankOwnerName : 'N/A'
              }}</span>
            </li>
          </ul>
          <div class="flex items-center" v-if="isInEditMode">
            <button
              @click="onUpdateCancel"
              class="flex items-center bg-[#E4E6EA] hover:!bg-gray-300 text-gray-800 mt-3 px-4 py-2 rounded text-sm space-x-2 transition duration-100 mr-2">
              <span>Hủy</span>
            </button>
            <button
              @click="onSaveUpdate"
              class="flex items-center bg-blue-600 hover:bg-[#437b9c] text-gray-100 mt-3 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
              <span>Lưu</span>
            </button>
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full 2xl:w-2/3">
        <div class="flex-1 bg-white rounded-lg shadow-xl p-8">
          <div class="flex items-center justify-between">
            <div class="text-xl text-gray-900 font-bold">Căn cước công dân</div>
            <div
              v-if="profileModel.isCCVerified === true"
              class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
              Đã phê duyệt
            </div>
            <div v-else class="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
              Chưa phê duyệt
            </div>
          </div>
          <div class="flex items-center flex-col md:flex-row gap-4">
            <div class="w-full md:w-[50%] flex justify-center">
              <article
                aria-label="File Upload Modal"
                class="relative flex flex-col bg-white shadow-xl rounded-md overflow-hidden"
                :class="{ 'w-[464px] h-[256px]': !profileModel.isCCVerified && !frontImgSrc }">
                <input type="file" hidden v-on:change="handleFileFrontUpload($event)" ref="fileFront" />
                <section
                  v-if="!profileModel.isCCVerified && !frontImgSrc"
                  class="overflow-auto p-8 w-full h-full flex flex-col">
                  <header
                    class="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                    <div class="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                      <span>Tải lên <span class="text-red-500">mặt trước</span> căn cước</span>
                    </div>
                    <button
                      @click="$refs.fileFront.click()"
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
              <article
                aria-label="File Upload Modal"
                class="relative flex flex-col bg-white shadow-xl rounded-md overflow-hidden"
                :class="{ 'w-[464px] h-[256px]': !profileModel.isCCVerified && !backImgSrc }">
                <input type="file" hidden v-on:change="handleFileBackUpload($event)" ref="fileBack" />
                <section
                  v-if="!profileModel.isCCVerified && !backImgSrc"
                  class="overflow-auto p-8 w-full h-full flex flex-col">
                  <header
                    class="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                    <div class="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                      <span>Tải lên <span class="text-red-500">mặt sau</span> căn cước</span>
                    </div>
                    <button
                      @click="$refs.fileBack.click()"
                      class="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none">
                      Tải lên
                    </button>
                  </header>
                </section>
                <div v-else class="w-full h-full" @click="profileModel.isCCVerified || $refs.fileBack.click()">
                  <img :src="profileModel.fileBack || backImgSrc" alt="Mặt sau" class="object-contain" />
                </div>
              </article>
            </div>
          </div>
          <div v-if="!profileModel.isCCVerified === true" class="w-full text-center flex justify-center mt-3">
            <button
              @click="() => onPostCCCD()"
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
