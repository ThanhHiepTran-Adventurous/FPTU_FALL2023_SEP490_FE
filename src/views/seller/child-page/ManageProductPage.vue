<script setup>
import Tab1 from '@/components/manage-product/ProductStore.vue';
import Tab2 from '@/components/manage-product/ProductAuction.vue';
import Tab3 from '@/components/manage-product/ProductSell.vue';
import Tab4 from '@/components/manage-product/ProductReject.vue';
import { ref, markRaw } from 'vue'

const tab = ref(Tab1)

function changeTab(comp) {
	tab.value = markRaw(comp)
}
</script>
<template>
	<div class="container mx-auto">
		<div class="rounded-lg bg-white p-10 shadow-lg">
			
			<div class="flex">
				<div class="space-y-5">
					<div class="overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-1">
						<ul class="flex items-center gap-2 text-sm font-medium">
							<li class="flex-2">
								<button @click="changeTab(Tab1)"
									class="text-gra relative flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 shadow hover:bg-white hover:text-gray-700">
									Kho
									<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500"> 14 </span>
								</button>
							</li>
							<li class="flex-2">
								<button @click="changeTab(Tab2)"
									class="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow">
									Đấu Giá
								</button>
							</li>
							<li class="flex-2">
								<button
								 @click="changeTab(Tab3)" 
									class="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow">
									Đã Bán
									<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500"> 8 </span>
								</button>
							</li>
							<li class="flex-2">
								<button
								 @click="changeTab(Tab4)" 
									class="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow">
									Yêu Cầu Bị Từ Chối
									<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500"> 8 </span>
								</button>
							</li>
							
						</ul>
					</div>
				</div>
			</div>
		</div>

		<div id="tt-pageContent">
			<div class="container-indent">
				<div class="bg-white my-3">
					<component :is="tab" />
				</div>
			</div>
		</div>
	</div>
</template>

