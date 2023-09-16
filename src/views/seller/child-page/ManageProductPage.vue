<script setup>
import BasicInfo from '@/components/manage-product/BasicInfo.vue';
import HistoryProduct from '@/components/manage-product/HistoryProduct.vue';


import ItemBoxManageVue from '@/components/common-components/ItemBoxManage.vue';
import SearchInput from '@/components/common-components/SearchInput.vue'
import Modal from '@/components/common-components/Modal.vue'
import { ref } from 'vue'

const isModalVisible = ref(false);

function showModal() {
	// Show the custom modal
	isModalVisible.value = true;
}

function closeModal() {
	// Close the custom modal
	isModalVisible.value = false;
}

function handleConfirm() {
	// Handle the "Confirm" button click event here
	// You can perform any actions you want
	// Close the modal if needed
	closeModal();
}

</script>

<template>
	<div class="container mx-auto">
		<div class="  rounded-lg bg-white p-10 shadow-lg">
			<div class="mb-4 flex  items-center">
				<SearchInput placeholder="       Search a product" addOnInputClass="w-full md:w-[1000px]" />
				<button class="ml-2 rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600">Tìm Kiêm</button>
			</div>
			<div class="flex">
				<div class="space-y-5">
					<div class="overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-1">
						<ul class="flex items-center gap-2 text-sm font-medium">
							<li class="flex-2">
								<a href="#"
									class="text-gra relative flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 shadow hover:bg-white hover:text-gray-700">
									Kho
									<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500"> 14 </span>
								</a>
							</li>
							<li class="flex-2">
								<a href="#"
									class="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow">
									Đấu Giá</a>
							</li>
							<li class="flex-2">
								<a href="#"
									class="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow">
									Đã Bán
									<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500"> 8 </span>
								</a>
							</li>
							<li class="flex-2">
								<a href="#"
									class="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow">
									Từ Chối</a>
							</li>

						</ul>
					</div>
				</div>
			</div>
		</div>

		<div id="tt-pageContent">
			<div class="container-indent">
				<div class="bg-white my-3">
					<div class="container my-[20px] py-2">
						<div class="flex flex-wrap mt-10">

							<ItemBoxManageVue @click="showModal" class="ml-10 mb-10" product-name="Super long long long" />
							<ItemBoxManageVue @click="showModal" class="ml-10 mb-10" product-name="Super long long long" />
							<ItemBoxManageVue @click="showModal" class="ml-10 mb-10" product-name="Super long long long" />
							<ItemBoxManageVue @click="showModal" class="ml-10 mb-10" product-name="Super long long long" />
							<ItemBoxManageVue @click="showModal" class="ml-10 mb-10" product-name="Super long long long" />
							<ItemBoxManageVue @click="showModal" class="ml-10 mb-10" product-name="Super long long long" />
							<ItemBoxManageVue @click="showModal" class="ml-10 mb-10" product-name="Super long long long" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>


	<div>
		<Modal v-if="isModalVisible" @decline-modal="closeModal" @confirm-modal="handleConfirm">

			<BasicInfo />
			<HistoryProduct />

		</Modal>
	</div>
</template>



