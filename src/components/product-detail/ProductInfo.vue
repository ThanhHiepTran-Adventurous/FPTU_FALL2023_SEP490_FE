<template>
	<div class="tt-product-single-info">
								<div class="tt-add-info">
									<ul>
										<li><span>SKU:</span> 001</li>
										<li><span>Availability:</span> 40 in Stock</li>
									</ul>
								</div>
								<h1 class="tt-title">Cotton Blend Fleece Hoodie</h1>
								<div class="tt-price">
									<span class="new-price">$29</span>
								</div>
								<div class="tt-review">
									<div class="tt-rating">
										<i class="icon-star"></i>
										<i class="icon-star"></i>
										<i class="icon-star"></i>
										<i class="icon-star-half"></i>
										<i class="icon-star-empty"></i>
									</div>
									<a class="product-page-gotocomments-js" href="#">(1 Customer Review)</a>
								</div>
								<div class="tt-wrapper">
									Lorem ipsum dolor sit amet conse ctetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
								</div>
								<div class="tt-wrapper">
									<div class="tt-countdown_box_02">
										<div class="tt-countdown_inner">
                          COUNT-DOWN-COMPONENT-HERE
										</div>
									</div>
								</div>
								<div class="tt-wrapper"> 
									<div class="direction">
											<a href="#" class="button-scope btn btn-lg"><i class="icon-f-39"></i>ĐẶT LỆNH ĐẤU GIÁ</a>
											<a href="#" class="button-scope btn btn-lg"><i class="icon-f-39"></i>THÊM VÀO YÊU THÍCH</a>
											<a href="#" class="button-scope btn btn-lg"><i class="icon-f-39"></i>BÁO CÁO </a>
									</div>
								</div>
								<div class="tt-wrapper">
									<ul class="tt-list-btn">
										<li><a class="btn-link" href="#"><i class="icon-n-072"></i>ADD TO WISH LIST</a></li>
										<li><a class="btn-link" href="#"><i class="icon-n-08"></i>ADD TO COMPARE</a></li>
									</ul>
								</div>
								<div class="tt-wrapper">
									<div class="tt-add-info">
										<ul>
											<li><span>Vendor:</span> Polo</li>
											<li><span>Product Type:</span> T-Shirt</li>
											<li><span>Tag:</span> <a href="#">T-Shirt</a>, <a href="#">Women</a>, <a href="#">Top</a></li>
										</ul>
									</div>
								</div>
							</div>
</template>

<script>
import { ref } from 'vue'; 

export default {
 components: {
 },
 setup() {
   const data = ref();

   const methods = {};

   return {
     data,
     ...methods,
   };
 },
};
</script>

<style scoped>
  .direction {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  }
  .button-scope {
    margin: 10px;
    width: 100%;
  } 
  
</style>
