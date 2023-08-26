<template>
  <div class="page">
    <LandingHeader />
    <router-view></router-view>
    <Footer />
    </div>
</template>

<script setup>
import LandingHeader from '@/components/page-sections/LandingHeader.vue';
import Footer from '@/components/page-sections/Footer.vue';
</script>
