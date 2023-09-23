<template>
  <div class="min-w-screen min-h-screen bg-gray-50 py-5">
    <div class="w-full  bg-white border-t border-b border-gray-200 px-5 py-10 text-gray-800">
      <div class="w-full">
        <div class="px-5">
          <h4 class="text-3xl md:text-5xl font-bold text-gray-600">Xem Trước Sản Phẩm :</h4>
        </div>
        <div class="-mx-3 md:flex items-start   ">
          <div class="px-3 md:w-7/12 lg:pr-10 ">
            <!-- pre-view  -->
            <div class="row custom-single-page shadow drop-shadow-xl border-collapse ">
              <div class="col-6 hidden-xs mt-3">
                <ListProductImage :images="product.productImages" />
              </div>
              <div class="col-6 mt-3">
                <ProductInfo :productInfo="product.productInfo" />
              </div>
            </div>
          </div>
          <div class="px-3 md:w-5/12">
            <div class="w-full mx-auto rounded-lg bg-white border border-gray-200 p-3 text-gray-800 font-light mb-6">
              <div class="w-full flex mb-3 items-center">
                <div class="w-32">
                  <span class="text-gray-600 font-semibold">TÊN SẢN PHẨM</span>
                </div>
                <div class="flex-grow pl-3">
                  <div>
                    <input
                      class="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="000" type="text" />
                  </div>
                </div>
              </div>
              <div class="w-full flex items-center">
                <div class="w-32">
                  <span class="text-gray-600 font-semibold">GIÁ MỞ BÁN</span>
                </div>
                <div class="flex-grow pl-3">
                  <input
                    class="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="000" type="text" />
                </div>
              </div>
            </div>
            <div class="w-full mx-auto rounded-lg bg-white border border-gray-200 text-gray-800 font-light mb-6">
              <div class="w-full p-3 border-b border-gray-200">

                <div>
                  <div class="mb-3">
                    <label class="text-gray-600 font-semibold text-sm mb-2 ml-1">GIỚI THIỆU</label>
                    <div>
                      <textarea
                        class="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="John Smith" type="text"></textarea>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="text-gray-600 font-semibold text-sm mb-2 ml-1">HÌNH ẢNH </label>
                    <div>
                      <input
                        class="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                        id="image" name="image" accept="image/*" placeholder="0000 0000 0000 0000" type="file" /> <input
                        class="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                        id="image" name="image" accept="image/*" placeholder="0000 0000 0000 0000" type="file" />
                    </div>
                  </div>
                  <div class="mb-3 -mx-2 flex items-end">
                    <div class="px-2 w-1/4">
                      <label class="text-gray-600 font-semibold text-sm mb-2 ml-1">LOẠI </label>
                      <div>
                        <select
                          class="form-select w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer">
                          <option value="01">giày</option>
                          <option value="02"> dép</option>
                          <option value="12">quần</option>
                          <option value="12"> khác</option>
                        </select>
                      </div>
                    </div>
                    <div class="px-2 w-1/4">
                      <label class="text-gray-600 font-semibold text-sm mb-2 ml-1">BRAND </label>

                      <select
                        class="form-select w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer">
                        <option value="2020">2020</option>
                        <option value="2021">KIE</option>
                        <option value="2022">NIKE</option>
                        <option value="2023">JOY</option>
                      </select>
                    </div>
                    <div class="px-2 w-1/4">
                      <label class="text-gray-600 font-semibold text-sm mb-2 ml-1">CÂN NẶNG (kg)</label>
                      <div>
                        <input
                          class="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                          placeholder="000" type="text" />
                      </div>
                    </div>
                  </div>
                </div>
              </div> 
              <div class="w-full p-3">
                <label for="type2" class="flex items-center cursor-pointer">
                  <input type="radio" class="form-radio h-5 w-5 text-indigo-500" name="type" id="type2">
                  <span class="ml-2 text-gray-700"> tôi đồng ý với  <a class=" text-red-500" href="/#"> điều khoản và chính sách </a> của Bidbay !</span>
                </label>
              </div>
            </div>
            <div>
              <button
                class="block w-full max-w-xs mx-auto bg-bb-blue hover:bg-bb-purple focus:bg-indigo-700 text-white rounded-lg px-3 py-2 font-semibold">
                TẠO SẢN PHẨM</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import ListProductImage from '@/components/product-detail/ListProductImage.vue'
import ProductInfo from '@/components/product-detail/ProductInfo.vue'
const product = {
  productImages: [
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png",
  ],
  productInfo: {
    sku: '001',
    productTitle: 'Tên Sản Phẩm',
    productPeopleJoin: '40',
    productPrice: '90.000.000 VND',
    productDescription: 'loreum ipsum dolor sit ametloreum ipsum dolor sit ametloreum ipsum dolor sit ametloreum ipsum dolor sit ametloreum ipsum dolor sit ametloreum ipsum dolor sit amet',
    productRateStar: 3,
    reviewNumber: '1',
    vendor: 'Polo',
    productType: 'T-Shirt',
    tags: ['T-Shirt', 'Women', 'Top']
  }

}

</script>