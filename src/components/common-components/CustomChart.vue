<template>
  <canvas ref="chart"></canvas>
</template>

<script setup>
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ref, onMounted } from 'vue';

const chart = ref(null);
const props = defineProps(['data', 'options']);

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


onMounted(() => {
  const ctx = chart.value.getContext('2d');
  new Chart(ctx, {
      type: 'bar',
      data: props.data,
      options: props.options
  });
});
</script>
