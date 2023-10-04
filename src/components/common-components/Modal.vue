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
    <div class="fixed inset-0 flex justify-center bg-[#00000099] z-[100] outer" @click="$emit('decline-modal')">
      <div :class="`text-left bg-white h-min ${widthClass} mt-[4%] rounded-xl relative inner`" @click.stop>
        <div class="px-4 pt-4">
          <h5 class="mb-0 !font-bold border-b-[1px]">{{ title }}</h5>
        </div>

        <div class="px-4 !pt-4 max-h-[80vh]" :class="{'overflow-y-auto': hasOverFlowVertical}">
          <slot />
        </div>
        <div v-if="hasButton" class="flex justify-end p-4 gap-x-2">
          <div>
            <Button :type="constant.buttonTypes.OUTLINE" @on-click="$emit('decline-modal')">
              Hủy
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

<style>
.nested-enter-from {
  opacity: 0;
}
.nested-enter-active {
  transition: opacity .3s ease
}
</style>
