<script setup>
import ItemBoxManageVue from '@/components/common-components/ItemBoxManage.vue';
import SearchInput from '@/components/common-components/SearchInput.vue'
import ModalProduct from '@/components/manger-product/ModalProduct.vue'
</script>

<template>
	<ModalProduct />
	<div class="container mx-auto">
<div class="  rounded-lg bg-white p-10 shadow-lg">
		<div class="mb-4 flex  items-center">
			<SearchInput placeholder="       Search a product" addOnInputClass="w-full md:w-[1000px]" />
			<button class="ml-2 rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600">Tìm Kiêm</button>
		</div>
		<div class="flex">
			<label class="mr-4">
				<input type="checkbox" class="mr-2" />
				Đang Đấu Giá
			</label>
			<label class="mr-4">
				<input type="checkbox" class="mr-2" />
				Đã Bán
			</label>
			<label>
				<input type="checkbox" class="mr-2" />
				Đang Kiểm Định
			</label>
		</div>
	</div>
	<div id="tt-pageContent">
		<div class="container-indent">
			<div class="bg-white my-3">
				<div class="container my-[20px] py-2">
					<div class="flex flex-wrap mt-10">
						<ItemBoxManageVue class="ml-10 mb-10" product-name="Super long long long" />
						<ItemBoxManageVue class="ml-10 mb-10" product-name="Super long long long" />
						<ItemBoxManageVue class="ml-10 mb-10" product-name="Super long long long" />
						<ItemBoxManageVue class="ml-10 mb-10" product-name="Super long long long" />
						<ItemBoxManageVue class="ml-10 mb-10" product-name="Super long long long" />
						<ItemBoxManageVue class="ml-10 mb-10" product-name="Super long long long" />
						<ItemBoxManageVue class="ml-10 mb-10" product-name="Super long long long" />
					</div>
				</div>
			</div>
		</div>

	</div>
	</div>
	
</template>
