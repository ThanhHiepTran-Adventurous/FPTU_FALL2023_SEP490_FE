<script setup>
 const bidPrice = {
  startBid: 200000,
  closeBid: 2300000,
 }

function getColorProfit(bidPrice) {
  return bidPrice.startBid <= bidPrice.closeBid ? 'green' : 'green';
}
function getPercentProfit(bidPrice){
  const percent = (bidPrice.startBid/bidPrice.closeBid)*100
  return bidPrice.startBid <= bidPrice.closeBid ? '+'+percent :  '-'+percent ;
}

</script>
<template>
  <div class="flex-1 bg-white rounded-lg shadow-xl p-8">
    <h4 class="text-xl text-gray-900 font-bold">Thông Tin Sản Phẩm </h4>
    <ul class="mt-2 text-gray-700">
      <li class="flex border-y py-2">
        <span class="font-bold w-50">Tên Sản Phẩm:</span>
        <span class="text-gray-700">Amanda S. Ross</span>
      </li>     
      <li class="flex border-b py-2">
        <span class="font-bold w-50">Ngày Khởi Tạo:</span>
        <span class="text-gray-700">24 , 09 , 2009</span>
      </li>
      <li class="flex border-b py-2">
        <span class="font-bold w-50">Ngày Đấu Giá:</span>
        <span class="text-gray-700">28 , 02 , 2022</span>
      </li>
      <li class="flex border-b py-2">
        <span class="font-bold w-50">Người Trúng Thầu:</span>
        <span class="text-gray-700"> Nguyễn Văn A <a href="#"> ( Liên Hệ ) </a></span>
      </li>
      <li class="flex border-b py-2">
        <span class="font-bold w-50">Trạng Thái:</span>
        <span class="text-gray-700">Đã Bán</span>
      </li>
      <li class="flex border-b py-2">
        <span class="font-bold w-50">Giá Khởi Điểm:</span>
        <span class="text-gray-700">20.000.000 VND</span>
      </li>
      <li class="flex border-b py-2">
        <span class="font-bold w-50">Giá Trúng Thầu:</span>
        <span class="text-gray-700">23.000.000 VND <span :style="{ color: getColorProfit(bidPrice) }"> {{ getPercentProfit(bidPrice) }}%</span></span>
          
      </li>
    </ul>
  </div>
</template>


<style scoped>
.text-red-500 {
  color: #ff0000;
  /* Red color */
}

.text-green-500 {
  color: #008000;
  /* Green color */
}</style>