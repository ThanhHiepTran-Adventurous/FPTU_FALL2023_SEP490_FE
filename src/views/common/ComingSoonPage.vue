
<script setup>

import { ref } from 'vue';

const isModalActive = ref(true)
const inputVal = ref('')

</script>
<template>
  <div class="tt-coming-soon">
  <div class="container">
    <div class="row	justify-content-center">
      <div class="col-md-8 tt-coming-soon-content">
        <a class="tt-logo" href="index.html"><img class="tt-retina" src="https://firebasestorage.googleapis.com/v0/b/bidbay-project.appspot.com/o/0227823b-2dc3-4445-84ec-72141e18cdb7.jpg?alt=media&token=b8834d98-ce12-414f-a4d9-af67e52ec686" alt=""></a>
        <h1 class="tt-title">WEBSITE IS COMING SOON</h1>
        <div class="description">
          Successful brands get into the mind slowly. A blurb in a magazine. A mention in a newspaper. A comment from a friend. A display in a retail store.
        </div>
        <h2 class="tt-title">SUBSCRIBE TO OUR NEWSLETTER</h2>
        <div class="form-inline form-default justify-content-center">
          <form>
            <div class="form-group">
                <input type="password" class="form-control" id="inputEmail2" placeholder="Enter your e-mail">
                <button type="submit" class="btn btn-primary">SUBSCRIBE</button>
            </div>
          </form>
        </div>
        <h2 class="tt-title">ENTER THE PASSWORD TO GET ACCESS TO THE SITE</h2>
        <div class="form-inline form-default justify-content-center">
          <form>
            <div class="form-group">
                <input type="password" class="form-control" id="inputPassword2" placeholder="Enter Password">
                <button type="submit" class="btn btn-primary">ENTER</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div class="coming-soon-bottom">
    <p>
      &copy; Wokiee 2018. All Rights Reserved
    </p>
    <ul class="tt-social-icon">
      <li><a href="#" target="blank" class="icon-g-64"></a></li>
      <li><a href="#" target="blank" class="icon-h-58"></a></li>
      <li><a href="#" target="blank" class="icon-g-66"></a></li>
      <li><a href="#" target="blank" class="icon-g-67"></a></li>
      <li><a href="#" target="blank" class="icon-g-70"></a></li>
    </ul>
  </div>
</div>
</template>
