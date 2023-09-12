import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/router'
import Countdown from 'vue3-flip-countdown'

import './assets/main.css'
import './assets/icon.css'

const pinia = createPinia()

createApp(App).use(router).use(pinia).use(Countdown).mount('#app')