<script setup>
import { Icon } from "@iconify/vue"
import { onMounted, ref } from "vue"
import { buyerTabs } from "@/common/constant"

const props = defineProps({
    curTab: {
        type: String,
        default: buyerTabs.bought.value
    }
})

const navs = ref([])

const computeNavs = () => {
    const data = []
    for (const prop in buyerTabs) {
        data.push(buyerTabs[prop])
    }
    navs.value = data
}

onMounted(() => {
    computeNavs()
})


</script>

<template>
    <!-- Component Start -->
    <div class="container mx-auto">
        <div class="flex">
            <div class="flex flex-col items-center w-16 md:w-72 h-full overflow-hidden text-gray-700 bg-white rounded">
                <div class="w-full px-2">
                    <div class="flex flex-col items-center w-full border-gray-300">
                        <router-link v-for="item in navs" :key="item.value"
                            :to="item.navLink"
                            class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300"
                            :class="curTab === item.value ? '!bg-gray-200' : ''">
                            <Icon :icon="item.icon" class="w-6 h-6 stroke-current" />
                            <span class="hidden md:block ml-3 text-sm font-medium">{{ item.value }}</span>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="pl-3 w-full"><slot>Default content</slot></div>
        </div>
    </div>
    <!-- Component End  -->
</template>