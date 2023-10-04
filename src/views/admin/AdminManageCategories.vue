<script setup>
import AdminHeader from '@/views/admin/common/AdminHeader.vue'
import loginService from '../../services/login.service'
import { onMounted, ref, computed, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
const userList = ref([])
const searchQuery = ref('')
const openDropdowns = ref([])
const itemsPerPage = 4
const currentPage = ref(1)
const showUpdateModal = ref(false)
const date = ref(new Date())
onMounted(() => {
  getAllUsers()
})
const selectedUser = ref(null)
const openUserModal = user => {
  selectedUser.value = user // Set the selected user data
  // console.log(selectedUser.value)
  showUpdateModal.value = true // Show the modal
}
const getAllUsers = async () => {
  try {
    const response = await loginService.fetchAllUserInfo()
    userList.value = response.data
  } catch (e) {
    console.error(e)
  }
}

const toggleDropdown = index => {
  const isOpen = openDropdowns.value.includes(index)
  console.log(index)
  if (isOpen) {
    // If the dropdown is already open, close it
    openDropdowns.value = openDropdowns.value.filter(i => i !== index)
  } else {
    // If the dropdown is closed, open it
    openDropdowns.value.push(index)
  }
}

// Computed property for paginated users
const paginatedUsers = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return userList.value
    .filter(user => user.fullname.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .slice(startIndex, endIndex)
})

// Watch for changes in searchQuery and reset currentPage when searching
watch(searchQuery, () => {
  currentPage.value = 1
})

// Computed property for total pages
const totalPages = computed(() => {
  return Math.ceil(
    userList.value.filter(user => user.fullname.toLowerCase().includes(searchQuery.value.toLowerCase())).length /
      itemsPerPage,
  )
})
// Function to go to a specific page
const goToPage = page => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}
</script>
<template>
  <AdminHeader />
</template>
