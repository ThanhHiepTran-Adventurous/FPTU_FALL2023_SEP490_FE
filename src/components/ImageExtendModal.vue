<script setup>
const props = defineProps({
    src: String,
    alt: String
})

const emit = defineEmits(["decline-modal"])
</script>
<template>
  <transition name="nested">
    <div class="fixed inset-0 flex justify-center bg-[#00000099] z-[100] outer p-[4rem]" @click="$emit('decline-modal')">
      <div class="text-left bg-white h-min rounded-xl relative inner" @click.stop>
        <img :src="src" :alt="alt" class="w-full h-full max-w-[90vw] max-h-[90vh]"/>
      </div>
    </div>
  </transition>
</template>

<style>
.nested-enter-from {
  opacity: 0;
}
.nested-enter-active {
  transition: opacity .3s ease
}
</style>
