<script setup>
import { useUserStore } from "@/stores/user.store";
import MessengerBuyer from "../buyer/MessengerBuyer.vue";
import { Role } from "@/common/contract";
import MessengerSeller from "../seller/MessengerSeller.vue";
import { computed } from "vue";

const userStore = useUserStore()
const curRole = computed(() => {
    return userStore.getRoleAndGetFromLocalStorageIfNotExist()
})

</script>

<template>
    <MessengerBuyer v-if="curRole === Role.buyer.value" />
    <MessengerSeller v-if="curRole === Role.seller.value" />
</template>