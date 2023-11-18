<script setup>
import { useUserStore } from '@/stores/user.store'
import { stringToColour } from '@/utils/stringToColor'
import { computed, ref, watch } from 'vue'

const userStore = useUserStore()

const getFirstLetterName = () => {
  const nameSpiltArray = userStore.getUsernameAndGetFromLocalStorageIfNotExist().split(' ')
  let firstLetter = ''
  for (let i = nameSpiltArray.length - 1; i >= 0; i--) {
    if (/^[a-zA-Z]+$/.test(nameSpiltArray[i].charAt(0))) {
      firstLetter = nameSpiltArray[i].charAt(0)
      break
    }
  }
  return firstLetter
}

</script>

<template>
    <div
    class="inline-block h-10 w-10 py-[0.35rem] font-semibold text-center align-middle justify-center text-black from-gray-500 to-gray-50 uppercase rounded-circle leading-pro text-xl tracking-tight-soft"
    :class="hexColor"
    >
    {{ getFirstLetterName() }}
    </div>
</template>