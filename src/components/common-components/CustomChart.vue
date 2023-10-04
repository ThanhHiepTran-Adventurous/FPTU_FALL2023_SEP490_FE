<template>
  <canvas ref="chart"></canvas>
</template>

<script setup>
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ref, onMounted } from 'vue';

const chart = ref(null);
//const chartInstance = ref(null);
const props = defineProps(['data', 'options']);

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


onMounted(() => {
  const ctx = chart.value.getContext('2d');
  const chartInstance = new Chart(ctx, {
      type: 'bar',
      data: props.data,
      options: props.options
  });
  chartInstance.canvas.parentNode.style.width = '100%';
  // chartInstance.canvas.parentNode.style.width = '100%';
});
</script>
