<template>
  <div class="page">
    <LandingHeader />
    <router-view></router-view>
    <h1>
      FOOTER-BUYER
    </h1>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
const LandingHeader = defineAsyncComponent(() => import('@/components/page-sections/LandingHeader.vue'))
</script>
