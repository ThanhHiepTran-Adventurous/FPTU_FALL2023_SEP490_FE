<script setup>
  import { defaultAvatar } from '@/common/urlConstant';

  const props = defineProps(['name'])

</script>
<template>
 <div class="flex flex-col items-center bg-indigo-100 border border-gray-200  w-full py-6 px-4 rounded-lg">
    <div class="h-20 w-20 rounded-full border overflow-hidden">
      <img :src="defaultAvatar" alt="avatar" />
    </div>
    <div class="text-sm font-semibold mt-2">{{ name }}</div>
    </div>
</template>