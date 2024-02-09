import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import vClickOutside from "click-outside-vue3"
import router from './router'
const app = createApp(App)

app.use(vClickOutside)

app.use(router)


app.mount('#app')
