<template>
  <div class="container my-[20px] py-2">
    <div class="flex flex-wrap  items-center mt-10">
      <div  @click="showModal(allowedModalTypes.create)" class="group tt-product thumbprod-center rounded-xl hover:scale-105 duration-200 ml-10 mb-10">
        <div class="group bg-gray-900/30 py-28 px-20 flex flex-col space-y-4 items-center cursor-pointer rounded-md hover:bg-gray-900/40 hover:smooth-hover">
          <a class="bg-gray-900/70 text-white/50 group-hover:text-white group-hover:smooth-hover flex w-20 h-20 rounded-full items-center justify-center"
            href="#">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </a>
          <button class="text-white/50 group-hover:text-white group-hover:smooth-hover text-center" >TẠO MỚI</button>
        </div>
      </div>
      <ItemBoxManageVue @click="showModal(allowedModalTypes.info)" class="ml-10 mb-10"
        product-name="Super long long long" />
      <ItemBoxManageVue @click="showModal(allowedModalTypes.info)" class="ml-10 mb-10"
        product-name="Super long long long" />
      <ItemBoxManageVue @click="showModal(allowedModalTypes.info)" class="ml-10 mb-10"
        product-name="Super long long long" />
      <ItemBoxManageVue @click="showModal(allowedModalTypes.info)" class="ml-10 mb-10"
        product-name="Super long long long" />
    </div>
  </div>

  <div>
    <Modal v-if="isModalVisible" :widthClass="'w-[700px]'" :hasOverFlowVertical=true :hasButton=false
      @decline-modal="closeModal" @confirm-modal="handleConfirm">
      <div v-if="typeofModal === allowedModalTypes.info">
        <ProductInfoModal />
      </div>
      <div v-if="typeofModal === allowedModalTypes.create">
        <CreateNewProduct />
      </div>
    </Modal>
  </div>
</template>
<script setup>
import CreateNewProduct from '@/components/manage-product/CreateNewProduct.vue' ;
import ProductInfoModal from '@/components/manage-product/ProductInfoModal.vue';
import ItemBoxManageVue from '@/components/common-components/ItemBoxManage.vue';
import Modal from '@/components/common-components/Modal.vue';
import { ref } from 'vue'
const allowedModalTypes = {  info: 'info' , create : 'create'};
const isModalVisible = ref(false);
const typeofModal = ref('info');


function showModal(typeModal) {
  typeofModal.value = typeModal;
  isModalVisible.value = true;
}

function closeModal() {
  isModalVisible.value = false;
}

function handleConfirm() {
  closeModal();
}

</script>