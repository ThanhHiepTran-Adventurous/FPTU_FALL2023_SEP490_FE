<template>
  <div class="flex w-full">
    <div class="flex-1 bg-white rounded-lg shadow-xl mx-1 my-1">
      <div class="flex flex-wrap mt-10">
        <ItemBoxManageVue @click="activateInfoAuction(idProduct = '1')" class="ml-10 mb-10"
          product-name="Super long long long" />
        <ItemBoxManageVue @click="activateInfoAuction(idProduct = '1')" class="ml-10 mb-10"
          product-name="Super long long long" />
        <ItemBoxManageVue @click="activateInfoAuction(idProduct = '1')" class="ml-10 mb-10"
          product-name="Super long long long" />
      </div>
    </div>

    <!-- product info  -->
    <div class="flex-1 bg-gray rounded-lg shadow-xl mx-1 my-1">
      <div class="relative mx-2">
        <div class="mx-auto container align-middle">
          <div class="flex w-full justify-around mt-5">
            <div class="shadow rounded-lg py-3 px-5 bg-white">
              <div class="flex flex-row justify-between items-center">
                <div>
                  <h6
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Lợi Nhuận </h6>
                  <h4 class="py-2 px-4 text-teal-500 ">5.000.000 </h4>
                </div>
              </div>
              <div class="text-left flex flex-row justify-start items-center">
                <p><span class="text-teal-500 font-bold">+3%</span> trong 7 ngày</p>
              </div>
            </div>
            <div class="shadow rounded-lg py-3 px-5 bg-white">
              <div class="flex flex-row justify-between items-center">
                <div>
                  <h6
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Tham Gia </h6>
                  <div class="flex items-center">
                    <h4 class=" py-2 ml-4 mr-1">42 </h4>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path fill="currentColor"
                        d="M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5S5.5 6.57 5.5 8.5S7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35c.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z" />
                    </svg>
                  </div>

                </div>
              </div>
              <div class="text-left flex flex-row justify-start items-center">
                <p><span class="text-teal-500 font-bold">+3%</span> trong 7 ngày</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="relative my-5 px-2">
        <div class="mx-auto container align-middle">
          <table class="w-full table-auto text-sm">
            <tbody>
              <tr>
                <td
                  class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                  Tên Sản Phẩm :
                </td>
                <td class="py-2 px-4 border-b border-grey-light">Bông long long logn </td>
              </tr>
              <tr>
                <td
                  class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                  giá khởi điểm :
                </td>
                <td class="py-2 px-4 border-b border-grey-light">100.000 VND</td>
              </tr>
              <tr>
                <td
                  class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                  giá mua ngay :
                </td>
                <td class="py-2 px-4 border-b border-grey-light">200.000 VND</td>
              </tr>
              <tr>
                <td
                  class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                  bước nhảy tối thiểu :
                </td>
                <td class="py-2 px-4 border-b border-grey-light">30.000 VND</td>
              </tr>
              <tr>
                <td
                  class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                  thời gian kết thúc :
                </td>
                <td class="py-2 px-4 border-b border-grey-light">2:30:12 02/08/2023</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="relative my-5 px-2">
        <div class="mx-auto container align-middle">
          <table class="w-full table-auto text-sm">
            <thead>
              <tr class="text-sm leading-normal">
                <th
                  class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                  Người Tham Gia
                </th>
                <th
                  class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                  Thời Gian</th>
                <th
                  class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-right">
                  Giá đấu</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-grey-lighter">
                <td class="py-2 px-4 border-b border-grey-light">#USE14123</td>
                <td class="py-2 px-4 border-b border-grey-light">2:30:12 02/08/2023</td>
                <td class="py-2 px-4 border-b border-grey-light text-right">4.000.000 VND</td>
              </tr>
              <tr class="hover:bg-grey-lighter">
                <td class="py-2 px-4 border-b border-grey-light">#USE14123</td>
                <td class="py-2 px-4 border-b border-grey-light">5:30:12 02/08/2023</td>
                <td class="py-2 px-4 border-b border-grey-light text-right">1.000.000 VND</td>
              </tr>
              <tr class="hover:bg-grey-lighter">
                <td class="py-2 px-4 border-b border-grey-light">#USE14123</td>
                <td class="py-2 px-4 border-b border-grey-light">6:30:12 03/08/2023</td>
                <td class="py-2 px-4 border-b border-grey-light text-right">2.000.000 VND</td>
              </tr>
              <tr class="hover:bg-grey-lighter">
                <td class="py-2 px-4 border-b border-grey-light">#USE14123</td>
                <td class="py-2 px-4 border-b border-grey-light">7:20:12 04/08/2023</td>
                <td class="py-2 px-4 border-b border-grey-light text-right">8.000.000 VND</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>

import ItemBoxManageVue from '@/components/common-components/ItemBoxManage.vue';
import Line from '@/components/common-components/Line.vue';
import CountDown from '@/components/common-components/Countdown.vue';
function activateInfoAuction(productID) {
  // call api to load info of auction product
}
</script>


<style scoped></style>