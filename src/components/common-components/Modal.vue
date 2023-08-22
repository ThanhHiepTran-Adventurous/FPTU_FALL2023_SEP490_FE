<script setup>
import Button from "@/components/common-components/Button.vue"
import constant from "@/common/constant"

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  buttonLabel: {
    type: String,
    default: 'Done',
  },
  hasButton: {
    type: Boolean,
    default: true,
  },
  hasCancelButton: {
    type: Boolean,
    default: true,
  },
  hasDeclineButton: {
    type: Boolean,
    default: false,
  },
  hasOverFlowVertical: {
    type: Boolean,
    default: false,
  },
  widthClass: {
    type: String,
    default: "w-[700px]"
  }
})

const emit = defineEmits(["decline-modal", "confirm-modal"])
</script>
<template>
  <transition name="nested">
    <div class="fixed inset-0 flex justify-center bg-[#00000099] z-[1000] outer" @click="$emit('decline-modal')">
      <div :class="`text-left bg-white h-min ${widthClass} mt-[5%] rounded-xl relative inner`" @click.stop>
        <div class="p-4">
          <h5 class="mb-0 leading-normal">{{ title }}</h5>
        </div>

        <div class="p-4 max-h-[60vh]" :class="{'overflow-y-auto': hasOverFlowVertical}">
          <slot />
        </div>
        <div class="flex justify-end p-4 gap-x-2">
          <div>
            <Button :type="constant.buttonTypes.OUTLINE" @on-click="$emit('decline-modal')">
              Cancel
            </Button>
          </div>
          <div>
            <Button @on-click="$emit('confirm-modal')">{{ buttonLabel }}</Button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.nested-enter-from {
  opacity: 0;
}
.nested-enter-active {
  transition: opacity .3s ease
}
</style>
