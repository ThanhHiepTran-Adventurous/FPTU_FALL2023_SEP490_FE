<script setup>
import Breadcrumb from '@/layouts/Breadcrumb.vue';
import BoughtNav from '../BoughtNav.vue';
import { buyerTabs } from '@/common/constant';

const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Đã mua',
    to: '/reports',
    disabled: true,
  },
]
</script>
<template>
    <div class="w-full">
        <div class="mt-3 mb-3 container mx-auto">
            <Breadcrumb :items="breadcrumbItems" />
        </div>
        <BoughtNav :cur-tab="buyerTabs.reported.value" />
    </div>
</template>