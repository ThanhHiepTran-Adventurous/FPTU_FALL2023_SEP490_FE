<template>
  <div :class="{ 'col-start-1 col-end-8 p-3 rounded-lg': isSender, 'col-start-6 col-end-13 p-3 rounded-lg': !isSender }">
    <div class="flex flex-row items-center" :class="!isSender ? 'justify-end' : ''">
      <div v-if="isSender" class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
        <img :src="defaultAvatar" alt="avt" class="rounded-full"/>
      </div>
      <div class="relative ml-3 text-sm py-2 px-4 shadow rounded-xl" :class="isSender ? ' bg-white' : 'bg-blue-500 text-white'">
        <div>{{ message }}</div>
      </div>
      <div v-if="!isSender" class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 ml-3">
        <img :src="avatar || defaultAvatar" alt="avt" class="rounded-[50%] w-full"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defaultAvatar } from '@/common/urlConstant';
import { useUserStore } from '@/stores/user.store';
import { computed } from 'vue';

const userStore = useUserStore()

const avatar = computed(() => {
  return userStore.getAvatarUrlAndGetFromLocalStorageIfNotExist()
})

const props = defineProps({
  isSender: Boolean,
  sender: String,
  message: String
});
</script>
