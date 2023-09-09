<script setup>
import { ref } from 'vue'
import ENUM from '@/constants/enum';

const UserInfo = {
	fullName: ref(''),
	phone: ref(''),
	role: ref(''),
	password: ref('')
}

const submitForm = async () => {
	try {
		// const response = await authService.register({
		//   fullName: UserInfo.fullName,
		//   phone: UserInfo.phone,
		//   role: UserInfo.role,
		//   password: UserInfo.password
		// })

		UserInfo.fullName = ''
		UserInfo.phone = ''
		UserInfo.role = ''
		UserInfo.password = ''
	} catch (error) {
		console.error('Error submitting form:', error)
	}
}
</script>


<template>
	<div id="tt-pageContent">
		<div class="container-indent">
			<div class="container">
				<h1 class="tt-title-subpages noborder"> ĐĂNG KÍ </h1>
				<div class="tt-login-form">
					<div class="row justify-content-center">
						<div class="col-md-8 col-lg-6">
							<div class="tt-item">
								<h2 class="tt-title">THÔNG TIN CÁ NHÂN </h2>
								<div class="form-default">
									<div class="form-group">
										<label for="loginInputfullName">Tên Của Bạn *</label>
										<div class="tt-required">* Bắt Buộc</div>
										<input v-model="UserInfo.fullName" type="text" class="form-control" placeholder="Nguyễn Văn A">

									</div>
									<div class="form-group">
										<label for="loginLastfullName">Số Điện Thoại (+84) *</label>
										<input v-model="UserInfo.phone" type="text" class="form-control" placeholder="+8493124124">
									</div>
									<div class="form-group">
										<label for="loginInputrole">Bạn muốn *</label>
										<select v-model="UserInfo.role" class="form-control">
											<option :value="ENUM.BUYER">Người Mua</option>
											<option :value="ENUM.SELLER">Người Bán</option>
											<!-- Add more options as needed -->
										</select>
									</div>
									<div class="form-group">
										<label for="loginInputPassword">PASSWORD *</label>
										<input v-model="UserInfo.password" type="password" class="form-control" placeholder="******">
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
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<style scoped>
.form-control,
select.form-control {
	display: block;
	width: 100%;
	padding: 0.375rem 0.75rem;
	font-size: 1rem;
	line-height: 1.5;
	color: #495057;
	background-color: #fff;
	background-clip: padding-box;
	border: 1px solid #ced4da;
	border-radius: 6px;
	transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
</style>