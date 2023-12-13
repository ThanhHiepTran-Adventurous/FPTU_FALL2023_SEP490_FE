<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import Button from '@/components/common-components/Button.vue'
import SearchInput from '@/components/common-components/SearchInput.vue'
import { useUserStore } from '../../stores/user.store'
import loginService from '../../services/login.service'
import Modal from '@/components/common-components/Modal.vue'
import toast from '../../utils/toast-option'
import { useRouter } from 'vue-router'
import { useFirebaseStore } from '../../stores/firebase.store'
import { useGlobalStore } from '@/stores/global.store'
import { Dropdown, MenuItem, Menu } from 'ant-design-vue'
import * as yup from 'yup'
import { ErrorMessage, Field, Form } from 'vee-validate'
import AntDropdown from '../AntDropdown.vue'
import { useNotificationStore } from '@/stores/notification.store'
import { Role } from '@/common/contract'
import constant, { defaultRoute } from '@/common/constant'
import { defaultAvatar } from '@/common/urlConstant'

const schema = yup.object().shape({
  phone: yup.string().required('Số điện thoại không được để trống'),
  password: yup.string().required('Mật khẩu không được để trống'),
})
const router = useRouter()

const userStore = useUserStore()
const firebaseStore = useFirebaseStore()
const globalStore = useGlobalStore()
const notiStore = useNotificationStore()

const isShowingNoti = ref(false)
const validate = ref(true)

const curRole = computed(() => {
  return userStore.getRoleAndGetFromLocalStorageIfNotExist()
})
const curAvatar = computed(() => {
  return userStore.getAvatarUrlAndGetFromLocalStorageIfNotExist()
})
const curDefaultRoute = computed(() => {
  const role = userStore.getRoleAndGetFromLocalStorageIfNotExist()
  if (role === Role.admin.value) {
    return defaultRoute.admin
  }
  if (role === Role.seller.value) {
    return defaultRoute.seller
  }
  return defaultRoute.buyer
})

const userInfo = ref({
  phone: '',
  password: '',
})
const errorMessage = ref({
  form: '',
})

//For noti
const isContainNotRead = computed(() => {
  return notiStore.isContainNewNoti
})

const isAuth = computed(() => {
  return userStore.getUserIdAndGetFromLocalStorageIfNotExist()
})

const resetForm = () => {
  errorMessage.value = ''
  userInfo.value.phone = ''
  userInfo.value.password = ''
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
    await schema.validate(userInfo.value, { abortEarly: false })
  } catch (validationErrors) {
    return
  }
  validate.value = true
  // -----------------------------
  if (validate.value) {
    loginService
      .login(userInfo.value.phone, userInfo.value.password)
      .then(async response => {
        toast.toastSuccess('Đăng nhập thành công')
        userStore.setRefreshTokenAndSaveToLocalStorage(response.data.refreshToken)
        userStore.setTokenAndSaveToLocalStorage(response.data.accessToken)
        const informationUser = await loginService.fetchUserInfo()
        userStore.setRoleAndSaveToLocalStorage(informationUser.data.role)
        userStore.setIsVerifiedCCCDAndSaveToLocalStorage(informationUser.data.citizenCardVerified)
        userStore.setUserIdAndSaveToLocalStorage(informationUser.data.id)
        userStore.setUsernameAndSaveToLocalStorage(informationUser.data.fullname)
        closeModal()
        resetForm()

        try {
          const fcmToken = await firebaseStore.getFcmToken()
          if (fcmToken) {
            loginService.saveFcmToken(fcmToken)
          }
        } catch(e){}

        // Check the user's role and redirect accordingly
        if (informationUser.data.role === Role.admin.value) {
          router.push(defaultRoute.admin)
        }
        if (informationUser.data.role === Role.staff.value) {
          router.push(defaultRoute.staff)
        }
        if (informationUser.data.role === Role.seller.value) {
          router.push(defaultRoute.seller)
        }
        notiStore.syncNotifications()
      })
      .catch(e => {
        if (e.response.status === 401 || e.response.status === 400) {
          if(e.response.data.message.includes("Invalid")){
            errorMessage.value.form = 'Sai số điện thoại hoặc mật khẩu'
          }
          else if(e.response.data.message.includes("banded")){
            errorMessage.value.form = 'Tài khoản của bạn đã bị ban khỏi hệ thống'
          } else {
            errorMessage.value.form = e.response.data.message
          }
        }
      })
  }
}

const onLogout = async () => {
  loginService
    .logout()
    .catch(e => console.log(e))
    .finally(() => {
      userStore.clear()
      router.push(defaultRoute.buyer)
    })
}

const onNotiClick = () => {
  isShowingNoti.value = !isShowingNoti.value
  notiStore.justRead()
  if (isShowingNoti.value === true) {
    notiStore.syncNotifications()
  }
}
const notiList = computed(() => {
  return notiStore.notifications
})

const searchKey = ref('')
const onSearchPress = e => {
  const ENTER_CHAR_CODE = 13
  if(e.charCode === ENTER_CHAR_CODE){
    router.push(`/auctions?search=${searchKey.value}`)
    searchKey.value = ''
  }
}

onMounted(() => {
  notiStore.syncNotifications()
})
</script>
<template>
  <!-- component -->
  <!-- Header -->
  <div class="fixed w-full top-0 z-[99]">
    <Modal
      v-if="isModalOpen"
      title="Đăng nhập"
      @decline-modal="() => closeModal()"
      width-class="w-[600px] top-[100px]"
      :has-button="false">
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
                <Field
                  name="password"
                  type="password"
                  v-model="userInfo.password"
                  class="form-control"
                  placeholder="******" />
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
        class="container px-6 py-1 mx-auto flex flex-col gap-3 md:gap-0 md:flex-row md:justify-between md:items-center text-white">
        <div class="flex items-center justify-center md:justify-between">
          <router-link :to="curDefaultRoute" class="text-xl font-bold text-white md:text-2xl hover:text-blue-400">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/bidbay-project.appspot.com/o/svg-formatter-beautifier-1.png?alt=media&token=3f69cb28-1feb-4d06-93bb-a25ee66ec880"
              alt="logo"
              class="w-[100px] h-[28px]" />
          </router-link>
        </div>

        <SearchInput v-if="!curRole || curRole === Role.buyer.value" placeholder="       Tìm kiếm sản phẩm theo tên" addOnInputClass="w-full md:w-[400px]" @keyPress="onSearchPress" v-model="searchKey" />

        <!-- Mobile Menu open: "block", Menu closed: "hidden" -->
        <div v-if="isAuth" class="flex flex-row gap-8 items-center justify-center mr-[20px]">
          <div class="flex items-center gap-4">
            <div class="w-full rounded-full p-0.5 flex items-center gap-4">
              <RouterLink
                to="/bought/immediate"
                class="flex text-white hover:!text-gray-400 p-1.5 rounded-[50%]"
                v-if="curRole === Role.buyer.value">
                <Icon icon="material-symbols:shopping-cart" class="text-[28px]" />
              </RouterLink>
              <AntDropdown :menuData="notiList">
                <div class="flex text-white hover:!text-gray-400 p-1.5 rounded-[50%]" @click="onNotiClick">
                  <Icon icon="ion:notifcations" class="text-[28px]" />
                  <span v-if="isContainNotRead" class="flex absolute -mt-1 ml-4">
                    <span class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-pink-500"> </span>
                  </span>
                </div>
              </AntDropdown>
              <RouterLink
                to="/participated"
                class="flex text-white hover:!text-gray-400 p-1.5 rounded-[50%]"
                v-if="curRole === Role.buyer.value">
                <Icon icon="fluent-mdl2:product-list" class="text-[28px]" />
              </RouterLink>
            </div>
            <div class="w-full">
              <Dropdown placement="bottomRight" trigger="click">
                <div class="rounded-full border-[1px] border-blue-500">
                  <img :src="curAvatar || defaultAvatar" alt="avatar" class="w-[38px] h-[38px] rounded-full" />
                </div>
                
                <template #overlay>
                  <Menu class="max-h-[90vh] overflow-auto">
                    <MenuItem>
                      <div>
                        <router-link to="/profile" class="flex items-center gap-3 px-2 text-black hover:bg-gray-200 rounded">
                          <Icon icon="tabler:edit" class="text-[28px]" />
                          <div>Edit</div>
                        </router-link>
                      </div>
                      <div @click="onLogout" class="flex items-center gap-3 px-2 mt-3 text-black hover:bg-gray-200 rounded">
                        <Icon icon="tabler:logout" class="text-[28px]" />
                        <div>Logout</div>
                      </div>
                    </MenuItem>
                  </Menu>
                </template>
              </Dropdown>
            </div>
          </div>
        </div>
        <div v-else class="flex gap-3">
          <router-link to="/register">
            <Button :type="constant.buttonTypes.OUTLINE" @on-click="$emit('decline-modal')"> Đăng kí </Button>
          </router-link>
          <Button :type="constant.buttonTypes.OUTLINE" @on-click="() => openModal()"> Đăng nhập </Button>
        </div>
      </nav>
    </div>
  </div>
</template>