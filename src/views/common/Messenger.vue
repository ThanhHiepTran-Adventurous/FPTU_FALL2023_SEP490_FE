<script setup>
import Nav from "@/components/messenger/Nav.vue";
import Body from "@/components/messenger/Body.vue";
import { Icon } from "@iconify/vue"
import { defaultRoute } from "@/common/constant";
import { computed } from "vue";
import { Role } from "@/common/contract";
import { useUserStore } from "@/stores/user.store";

const userStore = useUserStore()

const backLink = computed(() => {
  const role = userStore.getRoleAndGetFromLocalStorageIfNotExist()
    if(role === Role.admin.value){
      return defaultRoute.admin
    }
    if(role === Role.seller.value){
      return defaultRoute.seller
    }
    return defaultRoute.buyer
})

</script>

<template>
  <div class="flex h-screen antialiased text-gray-800">
    <div class="flex flex-row justify-between h-full w-full overflow-x-hidden">
      <div class="flex flex-col justify-between py-8 px-6 w-96 bg-white flex-shrink-0">
        <div><Nav></Nav></div>
        <router-link :to="backLink" class="flex items-center justify-center text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
          <div><Icon icon="simple-line-icons:logout" class="text-[20px] mr-3"/></div>
          <div>Thoát</div>
        </router-link>
      </div>
      <div class="flex flex-col flex-auto h-full p-6">
        <Body></Body>
      </div>
    </div>
  </div>
</template>