import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import Countdown from 'vue3-flip-countdown'

import './assets/main.css'
import './assets/icon.css'

createApp(App).use(router).use(Countdown).mount('#app')