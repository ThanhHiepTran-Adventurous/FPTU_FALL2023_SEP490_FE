<script setup>
import { onMounted } from 'vue';
import { useFirebaseStore } from './stores/firebase.store';
import toastOption from './utils/toast-option';
import { useNotificationStore } from './stores/notification.store';

const firebaseStore = useFirebaseStore()
const notiStore = useNotificationStore()

onMounted( async () => {
  const handleFunction = (payloadReceive) => {
    console.log(payloadReceive)
    toastOption.toastInformation(payloadReceive.notification.title)
    notiStore.syncNotifications()
  }
  
  console.log(`FCM Token from APP: ${await firebaseStore.getFcmToken()}`)
  firebaseStore.onFirebaseMessage(handleFunction)
})

</script>

<template>
  <div id="app" class="bg-gray-200">
    <router-view />
  </div>
</template>