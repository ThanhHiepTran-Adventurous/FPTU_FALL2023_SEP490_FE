<script setup>
import { onMounted, ref } from "vue"
import { buyerTabs } from "@/common/constant"

const props = defineProps({
    curTab : {
        type: String,
        default: buyerTabs.bought.value
    }
})

const navs = ref([])

const computeNavs = () => {
    const data = []
    for(const prop in buyerTabs){
        data.push(buyerTabs[prop])
    }
    navs.value = data
}

onMounted(() => {
    computeNavs()
})

</script>
<template>
    <div class="rounded-lg bg-white p-10 shadow-lg container mx-auto">
        <div class="flex">
            <div class="space-y-5">
                <div class="overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-1">
                    <ul class="flex items-center gap-2 text-sm font-medium">
                        <li v-for="item in navs" :key="item" class="flex-2">
                            <router-link :to="item.navLink">
                                <button
                                    class="text-gray-500 relative flex items-center justify-center gap-2 rounded-lg px-3 py-2 hover:shadow"
                                    :class="curTab===item.value ? 'bg-blue-200' : ''"
                                    >
                                    {{ item.value }}
                                </button>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>