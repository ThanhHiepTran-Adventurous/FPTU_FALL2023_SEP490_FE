<template>
  <div class="min-w-screen min-h-screen bg-gray-50 py-5">

    <div class="w-full bg-white border-t border-b border-gray-200 px-5 py-10 text-gray-800">
      <div class="w-full">
        <div class="-mx-3 md:flex items-start">
          <div class="px-3 md:w-7/12 lg:pr-10">
            <div class="mx-auto container align-middle">
              <table class="w-full table-auto text-sm">
                <thead>
                  <tr class="text-sm leading-normal">
                    <th
                      class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                      Mã Sản Phẩm
                    </th>
                    <th
                      class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                      Thời Gian</th>
                    <th
                      class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-right">
                      Giá </th>
                    <th
                      class=" bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-right">
                      Người Mua </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="hover:bg-grey-lighter">
                    <td class="py-2 px-4 border-b border-grey-light">#PRODUCT1231</td>
                    <td class="py-2 px-4 border-b border-grey-light">2:30:12 02/08/2023</td>
                    <td class="py-2 px-4 border-b border-grey-light text-right">4.000.000 VND</td>
                    <td class="py-2 px-4 border-b border-grey-light text-right"> <router-link to="/messenger">
                        #USE14</router-link></td>
                  </tr>
                  <tr class="hover:bg-grey-lighter">
                    <td class="py-2 px-4 border-b border-grey-light">#PRODUCT1231</td>
                    <td class="py-2 px-4 border-b border-grey-light">2:30:12 02/08/2023</td>
                    <td class="py-2 px-4 border-b border-grey-light text-right">4.000.000 VND</td>
                    <td class="py-2 px-4 border-b border-grey-light text-right"> <router-link to="/messenger">
                        #USE14</router-link></td>
                  </tr>
                  <tr class="hover:bg-grey-lighter">
                    <td class="py-2 px-4 border-b border-grey-light">#PRODUCT1231</td>
                    <td class="py-2 px-4 border-b border-grey-light">2:30:12 02/08/2023</td>
                    <td class="py-2 px-4 border-b border-grey-light text-right">4.000.000 VND</td>
                    <td class="py-2 px-4 border-b border-grey-light text-right"> <router-link to="/messenger">
                        #USE14</router-link></td>
                  </tr>
                  <tr class="hover:bg-grey-lighter">
                    <td class="py-2 px-4 border-b border-grey-light">#PRODUCT1231</td>
                    <td class="py-2 px-4 border-b border-grey-light">2:30:12 02/08/2023</td>
                    <td class="py-2 px-4 border-b border-grey-light text-right">4.000.000 VND</td>
                    <td class="py-2 px-4 border-b border-grey-light text-right"> <router-link to="/messenger">
                        #USE14</router-link></td>
                  </tr>
                  <tr class="hover:bg-grey-lighter">
                    <td class="py-2 px-4 border-b border-grey-light">#PRODUCT1231</td>
                    <td class="py-2 px-4 border-b border-grey-light">2:30:12 02/08/2023</td>
                    <td class="py-2 px-4 border-b border-grey-light text-right">4.000.000 VND</td>
                    <td class="py-2 px-4 border-b border-grey-light text-right"> <router-link to="/messenger">
                        #USE14</router-link></td>
                  </tr>
                  <tr class="hover:bg-grey-lighter">
                    <td class="py-2 px-4 border-b border-grey-light">#PRODUCT1231</td>
                    <td class="py-2 px-4 border-b border-grey-light">2:30:12 02/08/2023</td>
                    <td class="py-2 px-4 border-b border-grey-light text-right">4.000.000 VND</td>
                    <td class="py-2 px-4 border-b border-grey-light text-right"> <router-link to="/messenger">
                        #USE14</router-link></td>
                  </tr>


                </tbody>
              </table>
            </div>
          </div>
          <div class="px-3 md:w-5/12">
            <div class="w-full mx-auto rounded-lg bg-white border border-gray-200 p-3 text-gray-800 font-light mb-6">
              <div class="w-full flex mb-3 items-center">
                <div class="w-32">
                  <span class="text-gray-600 uppercase font-semibold"> Doanh Thu</span>
                </div>
                <div class="flex-grow pl-3">
                  <span>90.000.000 VND</span>
                </div>
              </div>
              <div class="w-full flex items-center">
                <div class="w-32">
                  <span class="text-gray-600 uppercase font-semibold">Số Sản Phẩm</span>
                </div>
                <div class="flex-grow pl-3">
                  <span>12 cái</span>
                </div>
              </div>
            </div>
            <div class="w-full mx-auto rounded-lg bg-white border border-gray-200 text-gray-800 font-light mb-6">
              <div class="w-full p-3 border-b border-gray-200">

                <div>
                  <div class="mb-3">
                    <label class="text-gray-600 font-semibold uppercase text-sm mb-2 ml-1"> TÌM KIẾM </label>
                    <div>
                      <input
                        class="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="id,..." type="text" />
                    </div>
                  </div>
                  <div class="mb-3">
                    <div class="flex gap-1 ">
                      <Button> TẢI XUỐNG BÁO CÁO </Button>
                      <Button> LÀM MỚI BỘ LỌC </Button>
                    </div>
                  </div>
                  <div class="mb-3 -mx-2 flex items-end">
                    <div class="px-2 w-1/4">
                      <label class="text-gray-600 font-semibold text-sm uppercase mb-2 ml-1">LỌC</label>
                      <div>
                        <select
                          class="form-select w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer">
                          <option value="01"> sth </option>
                          <option value="02"> sth</option>
                          <option value="03">tất cả</option>

                        </select>
                      </div>
                    </div>
                    <div class="px-2 w-1/4">
                      <label class="text-gray-600 font-semibold text-sm uppercase mb-2 ml-1">NĂM</label>

                      <select
                        class="form-select w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer">
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                      </select>
                    </div>

                  </div>
                </div>
              </div>
              <div class="w-full p-3">
                <label for="type2" class="flex items-center cursor-pointer">
                  <input type="radio" class="form-radio h-5 w-5 text-indigo-500" name="type" id="type2">
                  <span class="ml-2 text-gray-700"> vui lòng <a class="text-cyan-300" href="/#">liên hệ</a> bộ phận hỗ trợ
                    nếu gặp sự cố !</span>
                </label>
              </div>
            </div>
            <div>
            </div>
          </div>
        </div>
    </div>
  </div>
</div></template>


<script setup>
import Button from '@/components/common-components/Button.vue'
</script>