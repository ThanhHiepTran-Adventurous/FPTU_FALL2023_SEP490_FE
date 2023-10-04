<script setup>
import CustomChart from '@/components/common-components/CustomChart.vue';
import Table from '@/components/common-components/Table.vue';

const chartData = {
	labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
	datasets: [{
		label: '# of Votes',
		data: [12, 19, 3, 5, 2, 3],
		backgroundColor: 'rgba(75, 192, 192, 0.2)'
	}]
};

const chartOptions = {
	// ... your chart options here
};

</script>
<template>
    <div class="w-full">
        <div class="mb-8 text-black text-2xl font-semibold text-blue-500 pl-4 pt-4">
            Lịch sử đấu giá
        </div>
        <!-- <CustomChart :data="chartData" :options="chartOptions"></CustomChart> -->
        <Table />
    </div>
</template>