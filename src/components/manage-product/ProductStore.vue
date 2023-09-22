<template>
  <div class="container my-[20px] py-2">
    <div class="flex flex-wrap mt-10">
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
        <InspectionRequest />
      </div>
      <div v-if="typeofModal === allowedModalTypes.create">
        <CreateNewProduct />
      </div>
    </Modal>
  </div>
</template>
<script setup>
import InspectionRequest from '@/components/manage-product/InspectionRequest.vue';
import ItemBoxManageVue from '@/components/common-components/ItemBoxManage.vue';
import Modal from '@/components/common-components/Modal.vue';
import { ref } from 'vue'
import CreateNewProduct from '@/components/manage-product/CreateNewProduct.vue';
const allowedModalTypes = { create: 'create', info: 'info' };

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