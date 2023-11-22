<script setup>
import SellerSideBarLayout from '@/layouts/SellerSideBarLayout.vue'
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import WithdrawRequestPage from '../common/WithdrawRequestPage.vue';
import { sellerTabs } from '@/common/constant';

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
        <SellerSideBarLayout :cur-tab="sellerTabs.withdrawRequests.value">
          <WithdrawRequestPage />
        </SellerSideBarLayout>
    </div>
</template>