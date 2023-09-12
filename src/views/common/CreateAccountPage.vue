<script setup>
import { ref } from 'vue'
import loginService from "../../services/login.service"
import Dropdown from '@/components/common-components/Dropdown.vue';
import OtpInput from '@/components/common-components/OtpInput.vue';
import { Role } from '../../common/contract'


const showOtpVerification = ref(true)

const roleOptions = [
	{
		label: "Người mua",
		data: Role.buyer
	},
	{
		label: "Người bán",
		data: Role.seller
	},
]
const selected = ref(roleOptions[0])

const userInfo = ref({
	name: '',
	phone: '844111006',
	password: '123456',
	confirmPassword: '',
})
const otp = ref('')
const validate = ref(true)

const submitForm = async () => {
	if(validate.value){
		const data = {
			fullName: userInfo.value.name,
			phone: userInfo.value.phone,
			password: userInfo.value.password,
			confirmPassword: userInfo.value.confirmPassword,
			userRole: selected.value.data
		}
		console.log(data)
		loginService.register(data)
		.then((response) => {
			console.log(response)
			showOtpVerification.value = true
		})
		.catch(e => console.log(e))
	}
}
const resendOtp = async () => {
	loginService.resendOtp(userInfo.value.phone)
	.then(response => {
		console.log("Resend OTP successfully")
	})
	.catch(error => console.log("Resend OTP error"))
}
const confirmOtp = async () => {
	const data = {
		otp: otp.value,
		phoneNum: userInfo.value.phone,
		password: userInfo.value.password,
	}
	console.log(data)
	loginService.verifyOtp(data).then(response => console.log("Verify successfully")).catch(error => console.log(error))
}
const onOtpInputChange = (value) => {
	otp.value = value
}
</script>


<template>
	<div class="container pt-[50px]">
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
								<input v-model="userInfo.name" type="text" class="form-control" placeholder="Nguyễn Văn A">

							</div>
							<div class="form-group">
								<label for="loginLastName">Số Điện Thoại (+84) <span class="text-red-500">*</span></label>
								<input v-model="userInfo.phone" type="text" class="form-control" placeholder="+8493124124">
							</div>
							<div class="form-group">
								<label for="loginInputPassword">Mật khẩu <span class="text-red-500">*</span></label>
								<input v-model="userInfo.password" type="password" class="form-control"
									placeholder="******">
							</div>
							<div class="form-group">
								<label for="loginInputPassword">Xác nhận mật khẩu <span class="text-red-500">*</span></label>
								<input v-model="userInfo.confirmPassword" type="password" class="form-control"
									placeholder="******">
							</div>
							<div class="form-group flex items-center gap-3">
								<label>Bạn muốn là:</label>
								<Dropdown v-model="selected" :data="roleOptions"/>
							</div>
							<div class="row">
								<div class="col-auto">
									<div class="form-group">
										<button class="btn btn-border" @click="submitForm">TẠO TÀI KHOẢN</button>
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
							<OtpInput @valueChange="onOtpInputChange"/>
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
}</style>