


<script setup>
import { ref } from 'vue'

const UserInfo = {
	name: ref(''),
	phone: ref(''),
	email: ref(''),
	password: ref('')
}

const submitForm = async () => {
	try {
		// const response = await authService.register({
		//   name: UserInfo.name,
		//   phone: UserInfo.phone,
		//   email: UserInfo.email,
		//   password: UserInfo.password
		// })

		UserInfo.name = ''
		UserInfo.phone = ''
		UserInfo.email = ''
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
										<label for="loginInputName">Tên Của Bạn *</label>
										<div class="tt-required">* Bắt Buộc</div>
										<input v-model="UserInfo.name" type="text" class="form-control" placeholder="Nguyễn Văn A">

									</div>
									<div class="form-group">
										<label for="loginLastName">Số Điện Thoại (+84) *</label>
										<input v-model="UserInfo.phone" type="text"   class="form-control" placeholder="+8493124124">
									</div>
									<div class="form-group">
										<label for="loginInputEmail">E-MAIL *</label>
										<input v-model="UserInfo.email" type="text"  class="form-control" placeholder="nguyenvana@gmail.com">
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
						<div class="col-md-4 col-lg-6">
							<div class="tt-item">
								<h2 class="tt-title">THÔNG TIN ĐỊNH DANH *</h2>
								<div class="upload-container">
									<input type="file" id="fileInput" accept="image/*">
									<label for="fileInput" class="custom-upload-button">Tải Lên Hình Ảnh</label>
									<img
										src="https://danviet.mediacdn.vn/296231569849192448/2022/3/3/cccd-2-1646319199783844102892-1646319637762313385054.jpeg"
										alt="Image Preview" id="imagePreview" class="image-preview">
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