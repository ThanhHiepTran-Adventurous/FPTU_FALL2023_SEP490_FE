<script setup>
import { onMounted } from 'vue';
import { useFirebaseStore } from './stores/firebase.store';
import toastOption from './utils/toast-option';
import { useNotificationStore } from './stores/notification.store';
import { useSystemStore } from './stores/system-config.store';

const firebaseStore = useFirebaseStore()
const notiStore = useNotificationStore()
const systemStore = useSystemStore()

const initViewPort = () => {
  const viewportMeta = document.createElement('meta');
  viewportMeta.name = 'viewport';
  viewportMeta.content = 'width=device-width, initial-scale=1';
  document.head.appendChild(viewportMeta);
}

onMounted( async () => {
  initViewPort()

  const handleFunction = (payloadReceive) => {
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