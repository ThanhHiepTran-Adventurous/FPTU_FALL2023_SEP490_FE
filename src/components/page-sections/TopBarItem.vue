<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <!-- <div
    class="group flex flex-col justify-center items-center w-[30px] md:w-[50px] rounded-md px-16 py-3 my-2 hover:bg-blue-500">
    <slot name="">
      <Icon :icon="props.icon" class="text-[24px] md:text-[44px] group-hover:text-white" />
    </slot>
    <div class="pt-2 text-black group-hover:text-white text-[16px] w-max">{{ text }}</div>
  </div> -->

  <!-- <div class="w-[217px] h-[80px] mb-5">
    <a
      href="#"
      class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      <div class="flex flex-col justify-between p-4 leading-normal">
        <h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
          {{ text }}
        </h5>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"></p>
      </div>
      <img v-if="props.icon === 'shirt'" src="https://i.ibb.co/dWJHF46/ao.png" alt="ao" />
      <img v-if="props.icon === 'pants'" src="https://i.ibb.co/Ry9wvJM/quan.png" alt="quan" />
    </a>
  </div> -->
  <div class="w-[217px] h-[80px] mb-4 mt-2">
    <a
      href="#"
      class="flex items-center bg-white border border-gray-200 rounded-2xl shadow md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      <div class="flex justify-between p-2 w-full whitespace-nowrap">
        <h5 class="text-2xl font-bold ml-3 p-2 mt-3 tracking-tight text-gray-900 dark:text-white">
          {{ text }}
        </h5>
        <img
          v-if="props.icon === 'shirt'"
          src="https://i.ibb.co/ygFHs0d/blue-t-shirt.png"
          alt="shirt"
          class="object-contain h-20 w-20" />
        <img
          v-if="props.icon === 'pants'"
          src="https://i.ibb.co/wpCgB35/kaki-pant.png"
          alt="pants"
          class="object-contain h-20 w-20" />
        <img
          v-if="props.icon === 'accessory'"
          src="https://i.ibb.co/Z8brS7T/cap.png"
          alt="accessory"
          class="object-contain h-20 w-20" />
        <img
          v-if="props.icon === 'shoes'"
          src="https://i.ibb.co/R7jcwnx/shoes.png"
          alt="shoes"
          class="object-contain h-20 w-20" />
        <img
          v-if="props.icon === 'topSeller'"
          src="https://i.ibb.co/g4wg991/RS4440-153178496.jpg"
          alt="topSeller"
          class="object-contain h-20 w-20" />
      </div>
    </a>
  </div>
</template>
