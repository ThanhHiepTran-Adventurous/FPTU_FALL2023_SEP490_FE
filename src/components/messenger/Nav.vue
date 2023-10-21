<script setup>
import UserMessageCard from './UserMessageCard.vue';

</script>
<template>
  <div class="flex flex-col mt-8">
   <UserMessageCard/>
  </div>
  <div class="flex flex-col mt-8">
    <div class="flex flex-row items-center justify-between">
      <span class="font-bold">Hành động</span>
    </div>
    <div class="flex flex-col space-y-1 mt-4 -mx-2">
      <button class="flex items-center justify-center text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2">
        Cập nhật thông tin đơn hàng
      </button>
      <button class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 hover:cursor-pointer">
        Xác nhận đơn hàng đang vận chuyển
      </button>
      <button class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 hover:cursor-pointer">
        Xác nhận đã vận chuyển xong
      </button>
      <button class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
        Tố cáo người mua
      </button>
    </div>
   </div>
</template>