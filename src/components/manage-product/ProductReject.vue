<template>
  <div class="mx-auto container align-middle">
    <table class="w-full table-auto text-sm">
      <thead>
        <tr class="text-sm leading-normal">
          <th class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
            Mã Sản Phẩm
          </th>
          <th class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
            Thời Gian Phản Hồi
          </th>
          <th
            class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-right">
            Lý do
          </th>
          <th
            class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-right">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="hover:bg-grey-lighter" @click="showModal(allowedModalTypes.info)">
          <td class="py-2 px-4 border-b border-grey-light">#PRODUCT1231</td>
          <td class="py-2 px-4 border-b border-grey-light">2:30:12 02/08/2023</td>
          <td class="py-2 px-4 border-b border-grey-light text-right">Sản phẩm quá hạn</td>
          <td class="py-2 px-4 border-b border-grey-light text-right">
            <Button @click="showModal(allowedModalTypes.info)"> Phản Hồi </Button>
          </td>
        </tr>
        <tr class="hover:bg-grey-lighter" @click="showModal(allowedModalTypes.info)">
          <td class="py-2 px-4 border-b border-grey-light">#PRODUCT1232</td>
          <td class="py-2 px-4 border-b border-grey-light">3:45:21 02/08/2023</td>
          <td class="py-2 px-4 border-b border-grey-light text-right">Sản phẩm mới</td>
          <td class="py-2 px-4 border-b border-grey-light text-right">
            <Button @click="showModal(allowedModalTypes.info)"> Phản Hồi </Button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div>
    <Modal v-if="isModalVisible" :widthClass="'w-[700px]'" :hasOverFlowVertical=true :hasButton=false
      @decline-modal="closeModal" @confirm-modal="handleConfirm">
      <div v-if="typeofModal === allowedModalTypes.info">
        <div class="bg-white rounded-lg shadow-xl space-y-4">
          <div class="flex space-x-4">
            <Button @click="showTableTab" :class="tabButtonClasses('table')">Thông Tin</Button>
            <Button @click="showFormTab" :class="tabButtonClasses('form')">Gửi Lại Yêu Cầu Đấu Giá</Button>
          </div>

          <div v-if="currentTab === 'table'">
            <div class="mb-5">
              <ul class="mx-5 text-gray-700 ">
                <!-- Table content -->
                <li class="flex border-y py-2">
                  <span class="font-bold w-50">Tên Sản Phẩm:</span>
                  <span class="text-gray-700">Amanda S. Ross</span>
                </li>
                <li class="flex border-y py-2">
                  <span class="font-bold w-50">Giá Khởi Điểm:</span>
                  <span class="text-gray-700">Amanda S. Ross</span>
                </li>
                <li class="flex border-y py-2">
                  <span class="font-bold w-50">Giá Mua Ngay:</span>
                  <span class="text-gray-700">Amanda S. Ross</span>
                </li>
                <li class="flex border-y py-2">
                  <span class="font-bold w-50">Bước Nhảy Tối Thiểu:</span>
                  <span class="text-gray-700">Amanda S. Ross</span>
                </li>
                <li class="flex border-y py-2">
                  <span class="font-bold w-50">Lý Do Từ Chối:</span>
                  <span class="text-gray-700">Amanda S. Ross</span>
                </li>
                <li class="flex border-y py-2 ">
                  <span class="font-bold w-50">Người Kiểm Duyệt:</span>
                  <span class="text-gray-700">Amanda S. Ross</span>
                </li>
              </ul>
            </div>

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
        </div>
    </Modal>
  </div>
</template>


<script setup>
import Modal from "@/components/common-components/Modal.vue";
import { ref } from 'vue';
import Button from '@/components/common-components/Button.vue';

const allowedModalTypes = { info: 'info' };
const isModalVisible = ref(false);
const typeofModal = ref('info');
const currentTab = ref('table');

const showTableTab = () => {
  currentTab.value = 'table';
};

const showFormTab = () => {
  currentTab.value = 'form';
};

const showModal = (typeModal) => {
  typeofModal.value = typeModal;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const handleConfirm = () => {
  closeModal();
};

const tabButtonClasses = (tabName) => ({
  'bg-blue-500 hover:bg-blue-600 text-white': currentTab.value === tabName,
  'bg-gray-300 hover:bg-gray-400 text-gray-600': currentTab.value !== tabName,
});
</script>
