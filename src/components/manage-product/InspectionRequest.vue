<template>
  <div class="bg-white rounded-lg shadow-xl space-y-4">
    <!-- Tab buttons -->
    <div class="flex space-x-4">
      <button @click="showTableTab" :class="{
        'bg-blue-500 hover:bg-blue-600 text-white': currentTab === 'table',
        'bg-gray-300 hover:bg-gray-400 text-gray-600': currentTab !== 'table'
      }" class="px-4 py-3 rounded-md focus:outline-none transition flex-grow">
        Thông Tin
      </button>

      <button @click="showFormTab" :class="{
        'bg-blue-500 hover:bg-blue-600 text-white': currentTab === 'form',
        'bg-gray-300 hover:bg-gray-400 text-gray-600': currentTab !== 'form'
      }" class="px-4 py-3 rounded-md focus:outline-none transition flex-grow">
        Gửi Yêu Cầu Đấu Giá
      </button>
    </div>

    <!-- Table Tab -->
    <div v-if="currentTab === 'table'">
      <ul class="space-y-2 text-gray-700">
        <ul class="mt-2 text-gray-700">
          <li class="flex border-y py-2">
            <span class="font-bold w-50">Tên Sản Phẩm:</span>
            <span class="text-gray-700">Amanda S. Ross</span>
          </li>
          <li class="flex border-b py-2">
            <span class="font-bold w-50">Ngày Khởi Tạo:</span>
            <span class="text-gray-700">24 , 09 , 2009</span>
          </li>
          <li class="flex border-b py-2">
            <span class="font-bold w-50">Trạng Thái:</span>
            <span class="text-gray-700">Đã Bán</span>
          </li>
          <li class="flex border-b py-2">
            <span class="font-bold w-50">Brand:</span>
            <span class="text-gray-700">Deg-rey</span>
          </li>
          <li class="flex border-b py-2">
            <span class="font-bold w-50">Loại Sản Phẩm:</span>
            <span class="text-gray-700">Quần </span>
          </li>
          <li class="flex border-b py-4">
            <span class="font-bold w-50">Giới Thiệu :</span>
            <span class="text-gray-700">Lorem ipsum dolor sit amet consectetur, adipisicing elit. quisquam quod debitis
              eveniet. accusamus!</span>
          </li>
        </ul>
        <!-- Add more table rows as needed -->
      </ul>
    </div>

    <!-- Form Tab -->
    <div v-if="currentTab === 'form'">
      <div class="py-4 space-y-4">
        <div class="flex flex-col">
          <label class="text-sm font-semibold">Giá Khởi Điểm *</label>
          <input type="text"
            class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" />
        </div>
        <div class="flex flex-col">
          <label class="text-sm font-semibold">Giá Mua Ngay *</label>
          <input type="text"
            class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" />
        </div> 
        <div class="flex flex-col">
          <label class="text-sm font-semibold">Bước Nhảy Tối Thiểu *</label>
          <input type="text"
            class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" />
        </div>     
        <div class="flex flex-col">
          <label class="text-sm font-semibold">Thời Gian Đấu Giá *</label>
          <input type="text"
            class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" />
        </div>
         <div class="flex flex-col">
          <label class="text-sm font-semibold">Ngày Kết Thúc Bắt Buộc *</label>
          <input type="text"
            class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" />
        </div>
        <!-- Add more form fields as needed -->
        <button @click="showTableTab"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-md focus:outline-none transition">
          Quay Lại
        </button> 

        <button 
          class="bg-blue-500 ml-3 hover:bg-red-600 text-white px-4 py-3 rounded-md focus:outline-none transition">
          Gửi Yêu Cầu
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const currentTab = ref('table');

const showTableTab = () => {
  currentTab.value = 'table';
};

const showFormTab = () => {
  currentTab.value = 'form';
};
</script>
