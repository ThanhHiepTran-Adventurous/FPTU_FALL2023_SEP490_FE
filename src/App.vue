<script setup>
import { onMounted } from 'vue';
import { useFirebaseStore } from './stores/firebase.store';

const firebaseStore = useFirebaseStore()

onMounted( async () => {
  console.log(`FCM Token from APP: ${await firebaseStore.getFcmToken()}`)
})

</script>

<template>
  <div id="app" class="bg-gray-200">
    <router-view />
  </div>
</template>