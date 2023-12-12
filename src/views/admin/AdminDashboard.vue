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
  Legend,
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
  Legend,
  CategoryScale,
  BarController,
  ArcElement,
  BarElement,
  Tooltip,
)
import adminService from '../../services/admin.service'
const sellersCount = ref(null)
const staffsCount = ref(null)
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
const brandBarChartCanvas = ref(null)
const LinearProfitCanvas = ref(null)
const profitByCurrentMonth = ref(null)
const profitByCurrentWeek = ref(null)
const profitByCurrentYear = ref(null)
const profitByLastMonth = ref(null)
const profitByLastWeek = ref(null)
const profitByLastYear = ref(null)
const allUsers = ref(null)
const allProducts = ref(null)
const allAuctions = ref(null)
const countAllUsers = async () => {
  try {
    const response = await adminService.countAllUsers()
    allUsers.value = response.data || 0
  } catch (error) {
    console.error('Error counting all users:', error)
    throw error
  }
}

const countAllProducts = async () => {
  try {
    const response = await adminService.countAllProducts()
    allProducts.value = response.data || 0
  } catch (error) {
    console.error('Error counting all products:', error)
    throw error
  }
}

const countAllAuctions = async () => {
  try {
    const response = await adminService.countAllAuctions()
    allAuctions.value = response.data || 0
  } catch (error) {
    console.error('Error counting all auctions:', error)
    throw error
  }
}

const calculateProfitByCurrentMonth = async () => {
  try {
    const response = await adminService.calculateProfitByCurrentMonth()
    profitByCurrentMonth.value = response.data || 0
  } catch (error) {
    console.error('Error calculating profit for the current month:', error)
  }
}

const calculateProfitByCurrentWeek = async () => {
  try {
    const response = await adminService.calculateProfitByCurrentWeek()
    profitByCurrentWeek.value = response.data || 0
  } catch (error) {
    console.error('Error calculating profit for the current week:', error)
  }
}

const calculateProfitByCurrentYear = async () => {
  try {
    const response = await adminService.calculateProfitByCurrentYear()
    profitByCurrentYear.value = response.data || 0
  } catch (error) {
    console.error('Error calculating profit for the current year:', error)
  }
}

const calculateProfitByLastMonth = async () => {
  try {
    const response = await adminService.calculateProfitByLastMonth()
    profitByLastMonth.value = response.data || 0
  } catch (error) {
    console.error('Error calculating profit for the last month:', error)
  }
}

const calculateProfitByLastWeek = async () => {
  try {
    const response = await adminService.calculateProfitByLastWeek()
    profitByLastWeek.value = response.data || 0
  } catch (error) {
    console.error('Error calculating profit for the last week:', error)
  }
}

const calculateProfitByLastYear = async () => {
  try {
    const response = await adminService.calculateProfitByLastYear()
    profitByLastYear.value = response.data || 0
  } catch (error) {
    console.error('Error calculating profit for the last year:', error)
  }
}
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
const countStaff = async () => {
  try {
    const response = await adminService.countStaffs()
    staffsCount.value = response.data || 0
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
const getProfitByYear = async () => {
  const year = 2023
  try {
    const response = await await adminService.getProfitByYear(year)
    const profitData = response.data.map(item => item.profit)
    createProfitLineChart(profitData)
  } catch (e) {
    console.error(e)
  }
}
const getAllProductSoldForEachBrand = async () => {
  try {
    const response = await await adminService.getAllProductSoldForEachBrand()
    createBrandBarChart(response.data)
  } catch (e) {
    console.error(e)
  }
}
onMounted(() => {
  countSeller()
  countStaff()
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
  calculateProfitByCurrentMonth()
  calculateProfitByCurrentWeek()
  calculateProfitByCurrentYear()
  calculateProfitByLastMonth()
  calculateProfitByLastWeek()
  calculateProfitByLastYear()
  countAllUsers()
  countAllAuctions()
  countAllProducts()
  getProfitByYear()
  getAllProductSoldForEachBrand()
})
//chart count seller buyer
watch([sellersCount, buyersCount, staffsCount], ([sellers, buyers, staffs]) => {
  if (sellers !== null && buyers !== null && staffs !== null) {
    const ctx = donutChartCanvas.value.getContext('2d')
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [' Người bán', 'Người mua', 'Nhân viên'],
        datasets: [
          {
            data: [sellers, buyers, staffs],
            backgroundColor: ['#3B82F6', '#34D399', '#FF9900'],
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
//chart aution
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
              display: false,
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
//chart product
watch(
  [
    productActiveCount,
    productApprovingCount,
    productInActiveCount,
    productOnSellCount,
    productRejectedCount,
    productSoldCount,
  ],
  ([active, approving, inActive, onSell, productRejected, sold]) => {
    if (
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
          labels: ['Đang hoạt động', 'Đang chờ duyệt', 'Ngừng hoạt động', 'Đang bán', 'Từ chối sản phẩm', 'Đã bán'],
          datasets: [
            {
              data: [active, approving, inActive, onSell, productRejected, sold],
              backgroundColor: ['#36A2EB', '#C9CBCF', '#B0BEC5', '#FFD700', '#6A0572', '#C70039'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
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

//chart profit
const createProfitLineChart = profitData => {
  const ctx = LinearProfitCanvas.value.getContext('2d')
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
      ],
      datasets: [
        {
          label: 'Lợi nhuận',
          data: profitData,
          borderColor: '#3B82F6',
          borderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true,
          title: {
            display: false,
            text: 'năm 2023',
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Lợi nhuận',
          },
        },
      },
    },
  })
}
//brandBarChartCanvas
const createBrandBarChart = brandData => {
  const brandNames = brandData.map(item => item.brand)
  const quantities = brandData.map(item => item.quantity)

  const colors = ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF']

  const ctx = brandBarChartCanvas.value.getContext('2d')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: brandNames, // Display brand names on the y-axis
      datasets: [
        {
          label: 'Sản phẩm bán được',
          data: quantities,
          backgroundColor: colors,
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
          stepSize: 1,
          precision: 0,
        },
      },
    },
  })
}
</script>
<template>
  <AdminHeader />

  <div class="antialiased mt-5">
    <main class="p-4 md:ml-64 h-auto pt-20">
      <div class="grid grid-cols-2 mt-2 gap-4">
        <div
          class="rounded-lg p-4 shadow-md bg-white dark:border-gray-600 h-32 md:h-96 flex flex-col items-center justify-center">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 mb-4">
            <div
              class="rounded-lg shadow-md dark:border-ư-600 h-32 md:h-40 bg-white flex flex-col items-center justify-center text-center p-4">
              <span
                class="bg-blue-100 whitespace-nowrap shadow-sm text-blue-800 text-lg font-medium mb-2 px-2.5 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
                Tổng số người dùng
              </span>
              <h1 class="flex items-center text-blue-700 text-5xl font-extrabold dark:text-white">{{ allUsers }}</h1>
            </div>
            <div
              class="rounded-lg shadow-md dark:border-gray-600 h-32 md:h-40 bg-white flex flex-col items-center justify-center text-center p-4">
              <span
                class="bg-blue-100 shadow-sm whitespace-nowrap text-blue-800 text-lg font-medium mb-2 px-2.5 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
                Tổng số sản phẩm
              </span>
              <h1 class="flex items-center text-blue-700 text-6xl font-extrabold dark:text-white">{{ allProducts }}</h1>
            </div>
            <div
              class="rounded-lg shadow-md dark:border-gray-600 h-32 md:h-40 bg-white flex flex-col items-center justify-center text-center p-4">
              <span
                class="bg-blue-100 shadow-sm whitespace-nowrap text-blue-800 text-lg font-medium mb-2 px-2.5 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
                Tổng số đấu giá
              </span>
              <h1 class="flex items-center text-blue-700 text-6xl font-extrabold dark:text-white">{{ allAuctions }}</h1>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
            <div
              class="rounded-lg shadow-md dark:border-ư-600 h-32 md:h-40 bg-white flex flex-col items-center justify-center text-center p-4">
              <span
                class="bg-blue-100 whitespace-nowrap shadow-sm text-blue-800 text-lg font-medium mb-2 px-2.5 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
                Người dùng đang hoạt động
              </span>

              <h1 class="flex items-center text-blue-700 text-5xl font-extrabold dark:text-white">{{ allUsers }}</h1>
            </div>
            <div
              class="rounded-lg shadow-md dark:border-gray-600 h-32 md:h-40 bg-white flex flex-col items-center justify-center text-center p-4">
              <span
                class="bg-blue-100 shadow-sm whitespace-nowrap text-blue-800 text-lg font-medium mb-2 px-2.5 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
                Tổng số tố cáo
              </span>
              <h1 class="flex items-center text-blue-700 text-6xl font-extrabold dark:text-white">{{ allProducts }}</h1>
            </div>
            <div
              class="rounded-lg shadow-md dark:border-gray-600 h-32 md:h-40 bg-white flex flex-col items-center justify-center text-center p-4">
              <span
                class="bg-blue-100 shadow-sm whitespace-nowrap text-blue-800 text-lg font-medium mb-2 px-2.5 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
                Tổng số đơn hàng
              </span>
              <h1 class="flex items-center text-blue-700 text-6xl font-extrabold dark:text-white">{{ allAuctions }}</h1>
            </div>
          </div>
        </div>

        <div
          class="rounded-lg p-4 shadow-md bg-white dark:border-gray-600 h-32 md:h-96 flex flex-col items-center justify-center">
          <span
            class="bg-blue-100 shadow-sm text-blue-800 text-md font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
            Thống kê người dùng
          </span>
          <canvas ref="donutChartCanvas"></canvas>
        </div>
      </div>

      <div class="grid grid-cols-2 mt-4 gap-4">
        <div
          class="rounded-lg p-4 shadow-md bg-white dark:border-gray-600 h-32 md:h-96 flex flex-col items-center justify-center">
          <span
            class="inline-flex items-center mt-2 mb-1 bg-blue-100 text-blue-800 text-md font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
            Thống kê lợi nhuận
          </span>
          <canvas ref="LinearProfitCanvas"></canvas>
        </div>
        <div
          class="rounded-lg p-4 shadow-md bg-white dark:border-gray-600 h-32 md:h-96 flex flex-col items-center justify-center">
          <span
            class="inline-flex items-center mt-2 mb-1 bg-blue-100 text-blue-800 text-md font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
            Thống kê sản phẩm đã bán
          </span>
          <canvas ref="brandBarChartCanvas"></canvas>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-4 mb-4">
        <div
          class="rounded-lg shadow-md p-4 bg-white dark:border-gray-600 h-32 md:h-96 flex flex-col items-center justify-center">
          <span
            class="inline-flex items-center mt-2 mb-1 bg-blue-100 text-blue-800 text-md font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
            Thống kê đấu giá
          </span>
          <canvas ref="barChartAuctionsCanvas"></canvas>
        </div>
        <div
          class="rounded-lg p-4 shadow-md bg-white dark:border-gray-600 h-32 md:h-96 flex flex-col items-center justify-center">
          <span
            class="inline-flex items-center mt-2 mb-1 bg-blue-100 text-blue-800 text-md font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
            Thống kê sản phẩm
          </span>
          <canvas ref="barChartProductCanvas"></canvas>
        </div>
      </div>
    </main>
  </div>
</template>
