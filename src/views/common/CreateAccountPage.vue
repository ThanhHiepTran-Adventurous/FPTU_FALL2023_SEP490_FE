<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import loginService from "../../services/login.service"
import Dropdown from '@/components/common-components/Dropdown.vue';
import OtpInput from '@/components/common-components/OtpInput.vue';
import Navbar from '@/components/page-sections/Navbar.vue';
import { Role } from '../../common/contract'
import { useUserStore } from '../../stores/user.store'
import toast from '../../utils/toast-option'
import { useRouter } from 'vue-router';


import * as yup from "yup";
import { ErrorMessage, Field, Form } from "vee-validate";

const schema = yup.object().shape({
	name: yup.string().required('Tên không được để trống'),
	phone: yup.string().required('Số điện thoại không được để trống'),
	password: yup.string().required('Mật khẩu không được để trống'),
	confirmPassword: yup
		.string()
		.required('Xác nhận mật khẩu không được để trống')
		.oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận phải trùng khớp'),
});

const router = useRouter()

const userStore = useUserStore()
const showOtpVerification = ref(false)

const roleOptions = [
	{
		label: "Người mua",
		data: Role.buyer.value
	},
	{
		label: "Người bán",
		data: Role.seller.value
	},
]
const selected = ref(roleOptions[0])

const userInfo = ref({
	name: '',
	phone: '',
	password: '',
	confirmPassword: '',
})
const otp = ref('')
const validate = ref(false)

const submitForm = async () => {

// validate form before submit
    try { 
        await schema.validate(userInfo.value, { abortEarly: false });
    } catch (validationErrors) {
        return;
    }
    validate.value = true;
// -----------------------------
	if (validate.value) {
		const data = {
			fullName: userInfo.value.name,
			phone: userInfo.value.phone,
			password: userInfo.value.password,
			confirmPassword: userInfo.value.confirmPassword,
			userRole: selected.value.data
		}
		let toastId = toast.toastLoadingMessage("Đang đăng kí...")
		loginService.register(data)
			.then((response) => {
				toast.updateLoadingToast(toastId, "Đăng kí thành công", false)
				showOtpVerification.value = true
			})
			.catch(e => {
				if (e.response.data.message.includes("already existed")) {
					toast.updateLoadingToast(toastId, "Số điện thoại đã được đăng kí", true)
				} else {
					toast.updateLoadingToast(toastId, "Đăng kí thất bại", true)
				}
			})
	}
}
const resendOtp = async () => {
	loginService.resendOtp(userInfo.value.phone)
		.then(response => {
			toast.toastSuccess("Yêu cầu gửi lại OTP thành công")
		})
		.catch(error => toast.toastError("Yêu cầu gửi lại OTP thất bại"))
}
const confirmOtp = async () => {
	const data = {
		otp: otp.value,
		phoneNum: userInfo.value.phone,
		password: userInfo.value.password,
	}
	loginService.verifyOtp(data)
		.then(async response => {
			userStore.setRefreshTokenAndSaveToLocalStorage(response.data.refreshToken)
			userStore.setTokenAndSaveToLocalStorage(response.data.accessToken)
			const informationUser = await loginService.fetchUserInfo()
			userStore.setRoleAndSaveToLocalStorage(informationUser.data.role)
			userStore.setUserIdAndSaveToLocalStorage(informationUser.data.id)
			userStore.setUsernameAndSaveToLocalStorage(informationUser.data.fullname)
			toast.toastSuccess("Xác thực OTP thành công")
			router.push("/")
		})
		.catch(error => toast.toastError("OTP không đúng hoặc đã hết hạn"))
}
const onOtpInputChange = (value) => {
	otp.value = value
}
</script>


<template>
	<div>
		<Navbar />
		<Form @submit="submitForm" :validation-schema="schema">
			<div class="container pt-[170px] mx-auto min-h-[100vh]">
				<div class="!text-4xl text-black text-center py-3 mb-2 mx-auto col-md-8 col-lg-6">ĐĂNG KÝ TÀI KHOẢN</div>
				<div class="tt-login-form">
					<div class="row justify-content-center">
						<div v-if="showOtpVerification === false" class="col-md-8 col-lg-6">
							<div class="tt-item bg-white">
								<h2 class="tt-title">THÔNG TIN CÁ NHÂN </h2>
								<div class="form-default">
									<div class="form-group">
										<label for="loginInputName">Tên Của Bạn <span class="text-red-500">*</span></label>
										<div class="tt-required !text-red-500">* Bắt Buộc</div>
										<Field name="name" type="text" v-model="userInfo.name" class="form-control" />
										<ErrorMessage as="div" name="name" class="text-start text-danger pt-2 fs-6" />
									</div>
									<div class="form-group">
										<label for="loginLastName">Số Điện Thoại <span class="text-red-500">*</span></label>
										<Field name="phone" type="text" v-model="userInfo.phone" placeholder="093124124"
											class="form-control" />
										<ErrorMessage as="div" name="phone" class="text-start text-danger pt-2 fs-6" />
									</div>
									<div class="form-group">
										<label for="loginInputPassword">Mật khẩu <span class="text-red-500">*</span></label>

										<Field name="password" type="password" v-model="userInfo.password" placeholder="******"
											class="form-control" />
										<ErrorMessage as="div" name="password" class="text-start text-danger pt-2 fs-6" />
									</div>
									<div class="form-group">
										<label for="loginInputPassword">Xác nhận mật khẩu <span class="text-red-500">*</span></label>

										<Field name="confirmPassword" type="password" v-model="userInfo.confirmPassword"
											placeholder="******" class="form-control" />
										<ErrorMessage as="div" name="confirmPassword" class="text-start text-danger pt-2 fs-6" />
									</div>
									<div class="form-group flex items-center gap-3">
										<label>Bạn muốn là:</label>
										<Dropdown v-model="selected" :data="roleOptions" class="!w-[180px]" />
									</div>
									<div class="row">
										<div class="col-auto">
											<div class="form-group">
												<button class="btn btn-border">TẠO TÀI KHOẢN</button>
											</div>
										</div>
										<div class="col-auto align-self-center">
											<div class="form-group">
												<ul class="additional-links">
													<li>HOẶC <a href="#">VỀ TRANG CHỦ</a></li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div v-else class="col-md-10 col-lg-8">
							<div class="tt-item bg-white">
								<div class="w-full flex flex-col items-center">
									<h2 class="tt-title text-center">NHẬP MÃ OTP ({{ userInfo.phone }})</h2>
									<OtpInput @valueChange="onOtpInputChange" />
								</div>
								<div class="w-full mt-4 flex justify-center">
									<button class="btn btn-border" @click="resendOtp">GỬI LẠI</button>
									<button class="btn btn-primary" @click="confirmOtp">XÁC NHẬN</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Form>
	</div>
</template>


<style scoped>
.upload-container {
	text-align: center;
	margin: 20px;
}

input[type="file"] {
	display: none;
}

.custom-upload-button {
	background-color: #3498db;
	color: white;
	padding: 10px 20px;
	border: none;
	cursor: pointer;
}

.image-preview {
	max-width: 100%;
	max-height: 300px;
	margin-top: 20px;
}
</style>
