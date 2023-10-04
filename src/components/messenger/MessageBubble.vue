<template>
  <div :class="{ 'col-start-1 col-end-8 p-3 rounded-lg': isSender, 'col-start-6 col-end-13 p-3 rounded-lg': !isSender }">
    <div class="flex flex-row items-center">
      <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
        {{ sender }}
      </div>
      <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
        <div>{{ message }}</div>
        <!-- "Seen" indicator -->
        <div class="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500" v-if="seen">Seen</div>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  isSender: Boolean,
  sender: String,
  message: String,
  seen: Boolean, // Add a prop to determine whether the message is seen or not
});
</script>
