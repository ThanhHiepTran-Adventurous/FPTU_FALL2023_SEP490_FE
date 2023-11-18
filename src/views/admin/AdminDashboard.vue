<script setup>
import AdminHeader from '@/views/admin/common/AdminHeader.vue'
import { ref, onMounted, watch } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  DoughnutController,
  Title,
  CategoryScale,
  BarController,
  ArcElement,
  BarElement,
  Tooltip,
} from 'chart.js'
Chart.register(
  LineController,
  DoughnutController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarController,
  ArcElement,
  BarElement,
  Tooltip,
)
import adminService from '../../services/admin.service'
const sellersCount = ref(null)
const buyersCount = ref(null)
const auctionCompletedCount = ref(null)
const auctionInProcessCount = ref(null)
const auctionNewCount = ref(null)
const auctionRejectedCount = ref(null)
const productActiveCount = ref(null)
const productApprovingCount = ref(null)
const productInActiveCount = ref(null)
const productOnSellCount = ref(null)
const productRejectedCount = ref(null)
const productSoldCount = ref(null)
const donutChartCanvas = ref(null)
const barChartProductCanvas = ref(null)
const barChartAuctionsCanvas = ref(null)
const countAuctionCompleted = async () => {
  try {
    const response = await adminService.countAuctionCompleted()
    auctionCompletedCount.value = response.data || 0
  } catch (error) {
    console.error('Error fetching auction completed counts:', error)
  }
}

const countAuctionInProcess = async () => {
  try {
    const response = await adminService.countAuctionInProcess()
    auctionInProcessCount.value = response.data || 0
  } catch (error) {
    console.error('Error fetching auction in process counts:', error)
  }
}

const countAuctionNew = async () => {
  try {
    const response = await adminService.countAuctionNew()
    auctionNewCount.value = response.data || 0
  } catch (error) {
    console.error('Error fetching new auction counts:', error)
  }
}

const countAuctionRejected = async () => {
  try {
    const response = await adminService.countAuctionRejected()
    auctionRejectedCount.value = response.data || 0
  } catch (error) {
    console.error('Error fetching rejected auction counts:', error)
  }
}

const countProductActive = async () => {
  try {
    const response = await adminService.countProductActive()
    productActiveCount.value = response.data || 0
  } catch (error) {
    console.error('Error fetching active product counts:', error)
  }
}

const countProductApproving = async () => {
  try {
    const response = await adminService.countProductApproving()
    productApprovingCount.value = response.data || 0
  } catch (error) {
    console.error('Error fetching approving product counts:', error)
  }
}

const countProductInActive = async () => {
  try {
    const response = await adminService.countProductInActive()
    productInActiveCount.value = response.data || 0
  } catch (error) {
    console.error('Error fetching inactive product counts:', error)
  }
}

const countProductOnSell = async () => {
  try {
    const response = await adminService.countProductOnSell()
    productOnSellCount.value = response.data || 0
  } catch (error) {
    console.error('Error fetching products on sale counts:', error)
  }
}

const countProductRejected = async () => {
  try {
    const response = await adminService.countProductRejected()
    productRejectedCount.value = response.data || 0
  } catch (error) {
    console.error('Error fetching rejected product counts:', error)
  }
}

const countProductSold = async () => {
  try {
    const response = await adminService.countProductSold()
    productSoldCount.value = response.data || 0
  } catch (error) {
    console.error('Error fetching sold product counts:', error)
  }
}
const countSeller = async () => {
  try {
    const response = await adminService.countSellers()
    sellersCount.value = response.data || 0
  } catch (e) {
    console.error(e)
  }
}
const countBuyer = async () => {
  try {
    const response = await await adminService.countBuyers()
    buyersCount.value = response.data || 0
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  countSeller()
  countBuyer()
  countAuctionCompleted()
  countAuctionInProcess()
  countAuctionNew()
  countAuctionRejected()
  countProductActive()
  countProductApproving()
  countProductInActive()
  countProductOnSell()
  countProductRejected()
  countProductSold()
})

watch([sellersCount, buyersCount], ([sellers, buyers]) => {
  if (sellers !== null && buyers !== null) {
    const ctx = donutChartCanvas.value.getContext('2d')
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [' Seller', 'Buyer'],
        datasets: [
          {
            data: [sellers, buyers],
            backgroundColor: ['#3B82F6', '#34D399'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    })
  }
})

watch(
  [auctionCompletedCount, auctionInProcessCount, auctionNewCount, auctionRejectedCount],
  ([completed, inProcess, newCount, rejected]) => {
    if (completed !== null && inProcess !== null && newCount !== null && rejected !== null) {
      const ctx = barChartAuctionsCanvas.value.getContext('2d')
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Hoàn thành', 'Đang tiến hành', 'Mới', 'Từ chối'],
          datasets: [
            {
              data: [completed, inProcess, newCount, rejected],
              backgroundColor: ['#3B82F6', '#34D399', '#4BC0C0', '#FF6384'],
            },
          ],
        },
        options: {
          responsive: true,

          plugins: {
            legend: {
              display: true,
            },
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
              stepSize: 1,
            },
          },
        },
      })
    }
  },
)
watch(
  [
    auctionCompletedCount,
    auctionInProcessCount,
    auctionNewCount,
    auctionRejectedCount,
    productActiveCount,
    productApprovingCount,
    productInActiveCount,
    productOnSellCount,
    productRejectedCount,
    productSoldCount,
  ],
  ([completed, inProcess, newCount, rejected, active, approving, inActive, onSell, productRejected, sold]) => {
    if (
      completed !== null &&
      inProcess !== null &&
      newCount !== null &&
      rejected !== null &&
      active !== null &&
      approving !== null &&
      inActive !== null &&
      onSell !== null &&
      productRejected !== null &&
      sold !== null
    ) {
      const ctx = barChartProductCanvas.value.getContext('2d')
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [
            'Hoàn thành',
            'Đang tiến hành',
            'Mới',
            'Từ chối',
            'Đang hoạt động',
            'Đang chờ duyệt',
            'Ngừng hoạt động',
            'Đang bán',
            'Từ chối sản phẩm',
            'Đã bán',
          ],
          datasets: [
            {
              data: [
                completed,
                inProcess,
                newCount,
                rejected,
                active,
                approving,
                inActive,
                onSell,
                productRejected,
                sold,
              ],
              backgroundColor: [
                '#3B82F6',
                '#34D399',
                '#4BC0C0',
                '#FF6384',
                '#36A2EB',
                '#C9CBCF',
                '#B0BEC5',
                '#FFD700',
                '#6A0572',
                '#C70039',
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
              stepSize: 1,
            },
          },
        },
      })
    }
  },
)
</script>
<template>
  <AdminHeader />

  <div class="antialiased mt-5 bg-gray-50 dark:bg-gray-900">
    <main class="p-4 md:ml-64 h-auto pt-20">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div class="rounded-lg dark:border-gray-600 h-32 md:h-64 flex flex-col items-center justify-center">
          <span
            class="inline-flex items-center mt-2 mb-1 bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
            Tổng số Seller và Buyer
          </span>
          <canvas ref="donutChartCanvas"></canvas>
        </div>
        <!-- <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
        <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
        <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div> -->
      </div>
      <!-- <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4"></div> -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="border-gray-300 dark:border-gray-600 h-48 md:h-72">
          <span
            class="inline-flex items-center mt-2 mb-1 bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
            Thống kê đấu giá
          </span>
          <canvas ref="barChartAuctionsCanvas"></canvas>
        </div>
        <div class="border-gray-300 dark:border-gray-600 h-48 md:h-72">
          <span
            class="inline-flex items-center mt-2 mb-1 bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
            Thống kê sản phẩm
          </span>
          <canvas ref="barChartProductCanvas"></canvas>
        </div>
        <!-- <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
        <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div> -->
      </div>
      <!-- <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4"></div> -->
      <!-- <div class="grid grid-cols-2 gap-4">
        <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
        <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
        <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
        <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
      </div> -->
    </main>
  </div>
</template>
