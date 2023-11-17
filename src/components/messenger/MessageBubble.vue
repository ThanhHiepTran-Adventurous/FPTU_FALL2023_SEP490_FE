<script setup>
import { defaultAvatar } from '@/common/urlConstant';
import { useUserStore } from '@/stores/user.store';
import moment from 'moment';
import { computed } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { Role } from '@/common/contract';
import ExpandableImageBox from '../ExpandableImageBox.vue';

const userStore = useUserStore()

const avatar = computed(() => {
  return userStore.getAvatarUrlAndGetFromLocalStorageIfNotExist()
})

const props = defineProps({
  isSender: Boolean,
  message: String,
  createAt: String,
  receiverRole: String,
  senderRole: String,
  imgSrc: String,
});
</script>

<template>
  <div :class="{ 'col-start-1 col-end-8 px-3 py-1 rounded-lg': isSender, 'col-start-6 col-end-13 px-3 py-1 rounded-lg': !isSender }">
    <div class="flex flex-row items-center" :class="!isSender ? 'justify-end' : ''">
      <div
        v-if="isSender"
        class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
        :class="{
          'border-solid border-4 border-blue-800': senderRole === Role.buyer.value,
          'border-solid border-4 border-green-500': senderRole === Role.seller.value,
          'border-solid border-4 border-red-800': senderRole === Role.staff.value
        }"
      >
        <img :src="defaultAvatar" alt="avt" class="rounded-full"/>
      </div>
      <Tooltip class="relative ml-3 text-sm py-2 px-4 shadow rounded-xl" :class="isSender ? ' bg-white' : 'bg-blue-500 text-white'" placement="right">
        <template #title>{{ moment.utc(createAt).format("DD/MM/YYYY HH:mm:ss") }}</template>
        <div v-if="message">{{ message }}</div>
        <div v-if="imgSrc">
          <ExpandableImageBox :src="imgSrc" alt="Message image" img-class="w-[10rem] h-[10rem]" />
        </div>
      </Tooltip>
      <div
        v-if="!isSender"
        class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 ml-3"
        :class="{
          'border-solid border-4 border-blue-800': receiverRole === Role.buyer.value,
          'border-solid border-4 border-green-500': receiverRole === Role.seller.value,
          'border-solid border-4 border-red-800': receiverRole === Role.staff.value
        }"
      >
        <img :src="avatar || defaultAvatar" alt="avt" class="rounded-[50%] w-full"/>
      </div>
    </div>
  </div>
</template>