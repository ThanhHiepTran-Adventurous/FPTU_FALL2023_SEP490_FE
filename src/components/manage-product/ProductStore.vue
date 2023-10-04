<template>
  <div class="container my-[20px] py-2 mx-auto">
    <div class="mb-4 flex items-center mr-5 ml-5 mt-10">
      <select class="w-[200px] border h-11 rounded  text-gray-700 focus:outline-none focus:shadow-outline mr-1">
        <option value=""  selected>Tất Cả</option>
        <option value="brand1">Đã Bán</option>
        <option value="brand2">Chưa Đấu Giá</option>
        <option value="brand3">Đang Đấu Giá</option>
      </select>
      <div class="w-full">
        <SearchInput placeholder="       Search a product" addOnInputClass="w-full" />
      </div>
    </div>
    <div class="flex flex-wrap items-center mt-10">
      <div @click="showCreate()" @click.prevent
        class="group tt-product thumbprod-center rounded-xl hover:scale-105 duration-200 ml-10 mb-10">
        <div
          class="group bg-gray-900/30 py-28 px-20 flex flex-col space-y-4 items-center cursor-pointer rounded-md hover:bg-gray-900/40 hover:smooth-hover">
          <a class="bg-gray-900/70 text-white/50 group-hover:text-white group-hover:smooth-hover flex w-20 h-20 rounded-full items-center justify-center"
            href="#">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </a>
          <button class="text-white/50 group-hover:text-white group-hover:smooth-hover text-center">TẠO MỚI</button>
        </div>
      </div>
      <ItemBoxManageVue 
        v-for="product in products" :key="product.id"
        @click="showDetail(product)"
        class="ml-10 mb-10"
        :product-name="product.name"
        :status="product.status"
        />
    </div>
    <!-- <button data-tooltip-target="tooltip-hover" data-tooltip-trigger="hover" type="button">
                  <Icon icon="mdi:information" class="text-[20px]"/>
                </button>
                <div id="tooltip-hover" role="tooltip" class="absolute z-[1001] w-[20vw] invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                    {{ 'message' }}
                    <div class="tooltip-arrow" data-popper-arrow></div>
                </div> -->
  </div>

  <div>
    <Modal v-if="isModalVisible" :widthClass="'w-[900px]'" :hasOverFlowVertical=true :hasButton=false
      :title="typeofModal === allowedModalTypes.info ? 'Thông tin' : 'Tạo mới'"
      @decline-modal="closeModal" @confirm-modal="handleConfirm">
      <div v-if="typeofModal === allowedModalTypes.info">
        <ProductInfoModal :product="productDetail"/>
      </div>
      <div v-if="typeofModal === allowedModalTypes.create">
        <CreateNewProduct @create-success="onCreateSuccess" @create-error="onCreateError" />
      </div>
    </Modal>
  </div>
</template>
<script setup>
import CreateNewProduct from '@/components/manage-product/CreateNewProduct.vue';
import ProductInfoModal from '@/components/manage-product/ProductInfoModal.vue';
import ItemBoxManageVue from '@/components/common-components/ItemBoxManage.vue';
import Modal from '@/components/common-components/Modal.vue';
import SearchInput from '@/components/common-components/SearchInput.vue';
import productSerivice from '@/services/product.service';
import { onMounted, ref } from 'vue';
import toastOption from '../../utils/toast-option';
import { Icon } from '@iconify/vue';
import { initFlowbite } from 'flowbite';



const allowedModalTypes = { info: 'info', create: 'create' };
const isModalVisible = ref(false);
const typeofModal = ref('info');

const products = ref([]);
const productDetail = ref(null);

const onCreateSuccess = () => {
  toastOption.toastSuccess("Tạo mới sản phẩm vào kho thành công");
  isModalVisible.value = false;
}

const onCreateError = (detail) => {
  if(detail){
    toastOption.toastError(detail);
  } else {
    toastOption.toastError("Có lỗi khi tạo mới sản phẩm");
  }
  isModalVisible.value = false;
}

const showDetail = (product) => {
  productDetail.value = product;
  isModalVisible.value = true;
  typeofModal.value = allowedModalTypes.info;
}

const showCreate = () => {
  isModalVisible.value = true;
  typeofModal.value = allowedModalTypes.create;
}

function closeModal() {
  isModalVisible.value = false;
}

function handleConfirm() {
  closeModal();
}

const fetchProducts = async () => {
  const data = await productSerivice.getProducts();
  products.value = data.data;
}

onMounted(async () => {
  await fetchProducts();
})

</script>