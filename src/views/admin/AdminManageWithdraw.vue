<script setup>
import AdminHeader from '@/views/admin/common/AdminHeader.vue'
import { onMounted, ref, computed, watch } from 'vue'
import { Carousel } from 'flowbite-vue'
import { initFlowbite } from 'flowbite'
import withdraw from '../../services/withdraw.service'
import '@vuepic/vue-datepicker/dist/main.css'
import toastOption from '@/utils/toast-option'
import moment from 'moment'
const withdrawsList = ref([])

const getAllWithdraws = async () => {
  try {
    const response = await withdraw.getAllWithdraws(1, 100)
    withdrawsList.value = response.data
  } catch (e) {
    console.error(e)
  }
}
onMounted(() => {
  getAllWithdraws()
  initFlowbite()
})
</script>

<template>
  <AdminHeader />
</template>
