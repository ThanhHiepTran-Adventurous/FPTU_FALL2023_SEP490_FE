<script setup>
import BuyerSideBarLayout from '@/layouts/BuyerSideBarLayout.vue'
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import WithdrawRequestPage from '../common/WithdrawRequestPage.vue';
import { buyerTabs } from '@/common/constant';

const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Đề nghị hoàn tiền',
    to: '/withdraw',
    disabled: true,
  },
]

</script>

<template>
    <div class="w-full">
        <div class="pt-2 pb-2 container mx-auto">
          <Breadcrumb :items="breadcrumbItems" />
        </div>
        <BuyerSideBarLayout :cur-tab="buyerTabs.withdrawRequests.value">
          <WithdrawRequestPage />
        </BuyerSideBarLayout>
    </div>
</template>