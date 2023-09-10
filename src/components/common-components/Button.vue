<template>
  <div :class="[hDiv]">
    <Button
      v-if="type === constants.buttonTypes.ACTION && !disabled"
      :class="[w, h, borderColor, isCustomDefaultColor ? myDefaultActiveActionCustomColor : '']"
      @click="emit('onClick')">
      <slot />
    </Button>
    <Button
      v-if="type === constants.buttonTypes.OUTLINE && !disabled"
      :class="[w, h, borderColor, isCustomDefaultColor ? myDefaultActiveOutlineCustomColor : '']"
      outline
      @click="emit('onClick')">
      <slot />
    </Button>
    <Button
      v-if="type === constants.buttonTypes.ACTION && disabled"
      :class="[w, h, borderColor, isCustomDefaultColor ? myDefaultDisableActionCustomColor : '']"
      disabled>
      <slot />
    </Button>
    <Button
      v-if="type === constants.buttonTypes.OUTLINE && disabled"
      outline
      disabled
      :class="[w, h, borderColor, isCustomDefaultColor ? myDefaultDisableOutlineCustomColor : '']">
      <slot />
    </Button>
  </div>
</template>
<script setup>
import { Button } from 'flowbite-vue'
import constants from '@/common/constant'

const emit = defineEmits(['onClick'])

defineProps({
  type: {
    type: String,
    default: 'action',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isCustomDefaultColor: {
    type: Boolean,
    default: true,
  },
  w: {
    type: String,
    default: 'w-fit',
  },
  h: {
    type: String,
    default: 'h-[43.6px]',
  },
  hDiv: {
    type: String,
    default: 'h-fit',
  },
  color: {
    type: String,
    default: 'primary',
  },
  borderColor: {
    type: String,
    default: 'border-primary',
  },
})

const myDefaultActiveActionCustomColor = ['bg-primary', 'hover:bg-bb-sub-color']
const myDefaultActiveOutlineCustomColor = ['bg-white hover:bg-slate-100', 'text-primary']
const myDefaultDisableActionCustomColor = ['bg-primary', 'hover:bg-bb-sub-color']
const myDefaultDisableOutlineCustomColor = ['text-primary']
</script>
