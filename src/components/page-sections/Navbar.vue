<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Icon } from '@iconify/vue';
import Button from "@/components/common-components/Button.vue"
import constant from "@/common/constant"
import SearchInput from '@/components/common-components/SearchInput.vue'
import Avatar from '@/components/common-components/Avatar.vue'
import { useUserStore } from '../../stores/user.store'
import loginService from '../../services/login.service'
import Modal from '@/components/common-components/Modal.vue';
import toast from '../../utils/toast-option'
import { useRouter } from 'vue-router';
import { useFirebaseStore } from '../../stores/firebase.store';
import { useGlobalStore } from '@/stores/global.store';
import { Dropdown, ListGroup, ListGroupItem } from 'flowbite-vue';

import * as yup from "yup";
import { ErrorMessage, Field, Form } from 'vee-validate';


const schema = yup.object().shape({
    phone: yup.string().required('Số điện thoại không được để trống'),
    password: yup.string().required('Mật khẩu không được để trống'),
});
const router = useRouter();

const userStore = useUserStore()
const firebaseStore = useFirebaseStore()
const globalStore = useGlobalStore()

const cartItem = ref(true)
const mobileMenu = ref(false)
const isModalActive = ref(false)
const validate = ref(true)

const userInfo = ref({
    phone: "",
    password: "",
})
const errorMessage = ref({
    form: "",
})

const isAuth = computed(() => {
    return userStore.getUserIdAndGetFromLocalStorageIfNotExist()
})

const resetForm = () => {
    errorMessage.value = ""
    userInfo.value.phone = ""
    userInfo.value.password = ""
}

const isModalOpen = computed(() => {
    return globalStore.showLoginModal
})
const openModal = () => {
    globalStore.showLoginModal = true
}
const closeModal = () => {
    globalStore.showLoginModal = false
}

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
        loginService.login(userInfo.value.phone, userInfo.value.password)
            .then(async (response) => {
                toast.toastSuccess("Đăng nhập thành công")
                resetForm()
                userStore.setRefreshTokenAndSaveToLocalStorage(response.data.refreshToken)
                userStore.setTokenAndSaveToLocalStorage(response.data.accessToken)
                const informationUser = await loginService.fetchUserInfo()
                userStore.setRoleAndSaveToLocalStorage(informationUser.data.role)
                userStore.setIsVerifiedCCCDAndSaveToLocalStorage(informationUser.data.citizenCardVerified)
                userStore.setUserIdAndSaveToLocalStorage(informationUser.data.id)
                userStore.setUsernameAndSaveToLocalStorage(informationUser.data.fullname)
                // isModalActive.value = false
                closeModal()
            
                const fcmToken = await firebaseStore.getFcmToken()
                loginService.saveFcmToken(fcmToken)

                // Check the user's role and redirect accordingly
                if (informationUser.data.role === 'ADMIN') {
                    router.push('/admin/dashboard'); // Replace '/admin' with the actual admin page route
                }
                if (informationUser.data.role === 'SELLER') {
                    router.push('/manage')
                }
            })
            .catch(e => {
                if (e.response.status === 401 || e.response.status === 400) {
                    errorMessage.value.form = "Sai số điện thoại hoặc mật khẩu"
                }
            })
    }
}

const onLogout = async () => {
    loginService.logout()
        .catch(e => console.log(e))
        .finally(() => {
            userStore.clear()
        })
}

</script>
<template>
    <!-- component -->
    <!-- Header -->
    <div class="fixed w-full top-0 z-10">
        <Modal v-if="isModalOpen" title="Đăng nhập" @decline-modal="() => closeModal()"
            width-class="w-[600px] top-[100px]" :has-button="false">
            <Form @submit="submitForm" :validation-schema="schema">
                <div class="w-full flex items-center">
                    <div class="tt-item bg-white w-[100%]">
                        <div class="form-default">
                            <div class="form-group">
                                <label for="loginLastName">Số Điện Thoại <span class="text-red-500">*</span></label>
                                <Field name="phone" type="text" v-model="userInfo.phone" class="form-control" placeholder="093124124" />
								<ErrorMessage as="div" name="phone" class="text-start text-danger pt-2 fs-6" />
                            </div>
                            <div class="form-group">
                                <label for="loginInputPassword">Mật khẩu <span class="text-red-500">*</span></label>
                                    <Field name="password" type="password" v-model="userInfo.password" class="form-control" placeholder="******"/>
							    	<ErrorMessage as="div" name="password" class="text-start text-danger pt-2 fs-6" />
                            </div>
                            <p class="text-red-600 mb-1 ml-1">{{ errorMessage.form }}</p>
                            <div class="row">
                                <div class="col-auto">
                                    <div class="form-group">
                                        <button class="btn btn-border">ĐĂNG NHẬP</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>

        </Modal>
        <div class="bg-blue-700">
            <nav
                class="container px-6 py-2 mx-auto flex flex-col gap-3 md:gap-0 md:flex-row md:justify-between md:items-center text-white">
                <div class="flex items-center justify-center md:justify-between">
                    <router-link to="/" class="text-xl font-bold text-white md:text-2xl hover:text-blue-400">
                        <img src="https://firebasestorage.googleapis.com/v0/b/bidbay-project.appspot.com/o/svg-formatter-beautifier-1.png?alt=media&token=3f69cb28-1feb-4d06-93bb-a25ee66ec880"
                            alt="logo" class="w-[100px] h-[28px]" />
                    </router-link>
                </div>

                <SearchInput placeholder="       Search a product" addOnInputClass="w-full md:w-[400px]" />

                <!-- Mobile Menu open: "block", Menu closed: "hidden" -->
                <ul v-if="isAuth" class="flex flex-row gap-8 items-center justify-center">
                    <RouterLink to="/bought" class="flex text-white hover:!text-gray-400">
                        <Icon icon="material-symbols:shopping-cart" class="text-[28px]" />
                        <span class="flex absolute -mt-1 ml-4">
                            <span
                                class=" animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                            <span class=" relative inline-flex rounded-full h-3 w-3 bg-pink-500">

                            </span>
                        </span>
                    </RouterLink>
                    <RouterLink to="/" class="flex text-white hover:!text-gray-400">
                        <Icon icon="wpf:like" class="text-[28px]" />
                    </RouterLink>
                    <!-- dropdown account -->
                    <Dropdown placement="bottom" text="bottom">
                        <template #trigger>
                            <Icon icon="codicon:account" class="text-[28px] hover:cursor-pointer hover:text-gray-400" />
                            <!-- <Avatar /> -->
                        </template>
                        <ListGroup>
                            <ListGroupItem @click="router.push('/profile')">
                                <template #prefix>
                                    <Icon icon="tabler:edit" class="text-[28px]" />
                                </template>
                                Edit
                            </ListGroupItem>
                            <ListGroupItem @click="() => onLogout()">
                                <template #prefix>
                                    <Icon icon="tabler:logout" class="text-[28px]" />
                                </template>
                                Logout
                            </ListGroupItem>
                        </ListGroup>
                    </Dropdown>
                </ul>
                <div v-else class="flex gap-3">
                    <router-link to="/register">
                        <Button :type="constant.buttonTypes.OUTLINE" @on-click="$emit('decline-modal')">
                            Đăng kí
                        </Button>
                    </router-link>
                    <Button :type="constant.buttonTypes.OUTLINE" @on-click="() => openModal()">
                        Đăng nhập
                    </Button>
                </div>
            </nav>
        </div>
    </div>
</template>