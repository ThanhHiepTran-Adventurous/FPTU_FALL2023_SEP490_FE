import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/router'
import Countdown from 'vue3-flip-countdown'
import Toast from "vue-toastification"

import './assets/main.css'
import "vue-toastification/dist/index.css";
import 'ant-design-vue/dist/reset.css';

const pinia = createPinia()

createApp(App).use(router).use(pinia).use(Toast, {
    position: 'bottom-right',
    hideProgressBar: true,
}).use(Countdown).mount('#app')