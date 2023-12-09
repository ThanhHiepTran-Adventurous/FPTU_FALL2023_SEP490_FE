<script setup>
import { AuctionModelType } from '@/common/contract';
import WithdrawRequestPage from './common/WithdrawRequestPage.vue';
import AuctionConfirmModal from '@/components/AuctionConfirmModal.vue';

</script>

<template>
    <WithdrawRequestPage />
    <AuctionConfirmModal :modelType="AuctionModelType.intermediate" />
</template>