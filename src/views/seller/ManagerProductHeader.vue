<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"

const tabs = {
    inventory: "product-store",
    onSelling: "product-on-stock",
    sold: "product-sold",
    rejected: "product-rejected",
    order: "order"
}

const route = useRoute()

const curTab = computed(() => {
    return route.name
})

</script>
<template>
    <div class="rounded-lg bg-white p-10 shadow-lg container mx-auto">
        <div class="flex">
            <div class="space-y-5">
                <div class="overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-1">
                    <div class="flex items-center gap-2 text-sm font-medium">
                        <div class="flex-2">
                            <router-link to="/manage/product-inventory">
                                <button
                                    class="text-gray-500 relative flex items-center justify-center gap-2 rounded-lg px-3 py-2 hover:shadow"
                                    :class="curTab===tabs.inventory ? 'bg-blue-200' : ''"
                                    >
                                    Kho
                                    <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500"> 14 </span>
                                </button>
                            </router-link>
                        </div>
                        <div class="flex-2">
                            <router-link to="/manage/product-rejected">
                                <button
                                    class="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:shadow"
                                    :class="curTab===tabs.rejected ? 'bg-blue-200' : ''"
                                    >
                                    Yêu cầu bị từ chối
                                    <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500"> 8 </span>
                                </button>
                            </router-link>
                        </div>
                        <div class="flex-2">
                            <router-link to="/manage/on-selling">
                                <button
                                    class="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:shadow"
                                    :class="curTab===tabs.onSelling ? 'bg-blue-200' : ''"
                                    >
                                    Đang đấu giá
                                </button>
                            </router-link>
                        </div>
                        <div class="flex-2">
                            <router-link to="/manage/product-sold">
                                <button
                                    class="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:shadow"
                                    :class="curTab===tabs.sold ? 'bg-blue-200' : ''"
                                    >
                                    Đấu giá hoàn thành
                                    <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500"> 8 </span>
                                </button>
                            </router-link>
                        </div>
                        <div class="flex-2">
                            <router-link to="/manage/product-sold">
                                <button
                                    class="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:shadow"
                                    :class="curTab===tabs.order ? 'bg-blue-200' : ''"
                                    >
                                    Đơn hàng
                                    <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500"> 8 </span>
                                </button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>