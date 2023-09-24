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
      <form class="bg-white  shadow-md rounded px-8 pt-6 pb-8 mb-4">
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
                      Giá Khởi Điểm
                    </label>
                    <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="title" type="text" placeholder="">
                  </div>
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
                   Giá Mua Ngay
                    </label>
                    <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="description" placeholder=""/>
                  </div>
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="weight">
                     Bước Nhảy Tối Thiểu
                    </label>
                    <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="weight" type="text" placeholder="">
                  </div> 
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="weight">
                    Ngày Bắt Buộc Kết Thúc Đấu Giá
                    </label>
                    <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="weight" type="text" placeholder="">
                  </div>
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="brand">
                     Số Ngày Đấu Giá
                    </label>
                    <select
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="brand">
                      <option value="" disabled selected>Chọn ngày đấu giá</option>
                      <option value="brand1">1</option>
                      <option value="brand2">2</option>
                      <option value="brand3">3</option>
                    </select>
                  </div>
               
                  <div class="flex items-center justify-between">
                    <button
                      class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="button">
                       Hủy
                    </button> 
                    <button
                      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="button">
                       Gửi Yêu Cầu
                    </button>
                  </div>
                </form>
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
