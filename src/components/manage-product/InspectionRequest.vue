<script setup>

import { ref } from 'vue';

const isOpenRequest = ref(false);

function showModal() {
  isOpenRequest.value = true;
}

function closeModal() {
  isOpenRequest.value = false;
}

function handleConfirm(){
  closeModal();
}
</script>
<template>
  <div class="max-w-md mx-auto">
    <div class="divide-y divide-gray-200">
      <div @click="showModal()" class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
        <button
          class="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none">Gửi
          Yêu Cầu Đấu Giá
        </button>
      </div>
      <div v-if="isOpenRequest" class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
        <div class="flex flex-col">
            <h2 class="leading-relaxed">Trước khi gửi yêu cầu...</h2>
            <p class="text-sm text-gray-500 font-normal leading-relaxed">Chúng tôi cần bạn cung cấp một số thông tin liên quan đến buổi đấu giá.</p>
        </div>
        <div class="flex flex-col">
          <label class="leading-loose">Giá Khởi Điểm * </label>
          <input type="text"
            class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600">
        </div>
        <div class="flex flex-col">
          <label class="leading-loose">Giá Mua Ngay *</label>
          <input type="text"
            class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600">
        </div>
        <div class="flex flex-col">
          <label class="leading-loose">Bước Nhảy Tối Thiểu * </label>
          <input type="text"
            class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600">
        </div>
        <div class="flex items-center space-x-6">
          <div class="flex flex-col">
            <label class="leading-loose">Số Ngày Mở Bán</label>
            <div class="relative focus-within:text-gray-600 text-gray-400">
              <select
                class="pr-4 pl-10 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600">
                <option value="1">1 ngày</option>
                <option value="7">7 ngày</option>
                <option value="30">30 ngày</option>
                <option value="60">60 ngày</option>
                <!-- Add more options as needed -->
              </select>
              <div class="absolute left-3 top-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="flex flex-col">
            <label class="leading-loose">Kết Thúc</label>
            <div class="relative focus-within:text-gray-600 text-gray-400">
              <input type="text"
                class="pr-4 pl-10 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                placeholder="26/02/2020">
              <div class="absolute left-3 top-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
