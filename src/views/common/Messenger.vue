<script setup>
import { useUserStore } from "@/stores/user.store";
import { Role } from "@/common/contract";
import { computed } from "vue";
import MessengerBuyer from "../buyer/MessengerBuyer.vue";
import MessengerSeller from "../seller/MessengerSeller.vue";
import MessengerStaff from "../staff/MessengerStaff.vue";

const userStore = useUserStore()
const curRole = computed(() => {
    return userStore.getRoleAndGetFromLocalStorageIfNotExist()
})

</script>

<template>
    <MessengerBuyer v-if="curRole === Role.buyer.value" />
    <MessengerSeller v-if="curRole === Role.seller.value" />
    <MessengerStaff v-if="curRole === Role.staff.value" />
</template>