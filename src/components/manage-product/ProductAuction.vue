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
    <div class="flex-1 bg-gray rounded-lg shadow-xl mx-1 my-1">

      <div class="relative px-4 mt-1">
        <div class="mx-auto container align-middle">
          <div class="flex w-full">
            <div class="shadow rounded-lg py-3 px-5 bg-white">
              <div class="flex flex-row justify-between items-center">
                <div>
                  <h6>Lợi Nhuận (VND)</h6>
                  <h4 class="py-2 px-4 text-teal-500 ">5.000.000</h4>
                </div>
              </div>
              <div class="text-left flex flex-row justify-start items-center">
                <p><span class="text-teal-500 font-bold">+3%</span> trong 7 ngày</p>
              </div>
            </div>
            <div class="shadow rounded-lg py-3 px-5 bg-white">
              <div class="flex flex-row justify-between items-center">
                <div>
                  <h6>Tham Gia (người)</h6>
                  <h4 class="py-2 px-4  ">42</h4>
                </div>
              </div>
              <div class="text-left flex flex-row justify-start items-center">
                <p><span class="text-teal-500 font-bold">+3%</span> trong 7 ngày</p>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="relative px-4">
        <Line />
        <div class="mx-auto container align-middle">
          <div class="tt-countdown_box_02">
            <div class="tt-countdown_inner">
              <CountDown :coefficientSize="0.7" :deadlineInMilis="1693094493940" />
            </div>
          </div>
        </div>
      </div>
      <div class="relative px-4">
        <div class="flex-1 flex flex-wrap">
          <div class="flex-1 p-4 w-full md:w-1/2">
            <Line />
            <table class="w-full table-auto text-sm">
              <thead>
                <tr class="text-sm leading-normal">
                  <th
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Người Tham Gia</th>
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

  </div>
</template>

<script setup>

import ItemBoxManageVue from '@/components/common-components/ItemBoxManage.vue';
import Line from '@/components/common-components/Line.vue';
import Countdown from '@/components/common-components/CountDown.vue';
function activateInfoAuction(productID) {
  // call api to load info of auction product
}
</script>