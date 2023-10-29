<script setup>
import { onMounted } from 'vue';
import { useFirebaseStore } from './stores/firebase.store';
import toastOption from './utils/toast-option';
import { useNotificationStore } from './stores/notification.store';
import { useSystemStore } from './stores/system-config.store';

const firebaseStore = useFirebaseStore()
const notiStore = useNotificationStore()
const systemStore = useSystemStore()

onMounted( async () => {
  const handleFunction = (payloadReceive) => {
    console.log(payloadReceive)
    toastOption.toastInformation(payloadReceive.notification.title)
    notiStore.newMessageArrive()
  }
  
  console.log(`FCM Token from APP: ${await firebaseStore.getFcmToken()}`)
  firebaseStore.onFirebaseMessage(handleFunction)
  systemStore.syncData()
})

</script>

<template>
  <div id="app" class="bg-gray-200">
    <router-view />
  </div>
</template>