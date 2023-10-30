<script setup>
import { Timeline, TimelineItem } from 'ant-design-vue'
import { Icon } from '@iconify/vue'
import { OrderStatus } from '@/common/contract'
import { ref, computed, watch } from 'vue'

const props = defineProps(['curStatus'])
const orderStatusDisplay = ref([])
const curStatusData = ref(null)
const isCompleted = ref(false)
//const isJustStarted = ref(false)

const orderStatusArr = computed(() => {
  const arr = []
  for (const prop in OrderStatus) {
    arr.push(OrderStatus[prop])
  }
  return arr
})

watch(
  () => props.curStatus,
  () => {
    execData()
  },
  { deep: true },
)

const execData = () => {
  orderStatusDisplay.value = []
  isCompleted.value = props.curStatus === OrderStatus.DONE.value
  let isCatched
  for (const status of orderStatusArr.value) {
    if (isCatched === true) {
      curStatusData.value = status
      break
    }
    orderStatusDisplay.value.push(status)
    if (status.value === props.curStatus) {
      isCatched = true
    }
  }
}
</script>

<template>
  <Timeline v-if="isCompleted === false">
    <template #pending>
      <div class="text-lg min-h-[80px] ml-4">
        {{ curStatusData?.pendingText }}
      </div>
    </template>
    <TimelineItem v-for="status in orderStatusDisplay" :key="status">
      <template #dot>
        <Icon :icon="status.icon" class="text-[24px]" />
      </template>
      <div class="text-lg text-gray-500 min-h-[70px] ml-4">
        {{ status.text }}
      </div>
    </TimelineItem>
  </Timeline>
  <Timeline v-else>
    <TimelineItem v-for="status in orderStatusDisplay" :key="status">
      <template #dot>
        <Icon :icon="status.icon" class="text-[24px]" />
      </template>
      <div class="text-lg min-h-[80px]">
        {{ status.text }}
      </div>
    </TimelineItem>
    <!-- <TimelineItem>
            <template #dot>
                <Icon :icon="curStatusData?.icon" class="text-[24px]"/>
            </template>
            <div class="text-lg text-gray-500 min-h-[70px]">
                {{ curStatusData?.text }}
            </div>
<<<<<<< HEAD
        </TimelineItem>
=======
        </TimelineItem> -->
  </Timeline>
</template>
