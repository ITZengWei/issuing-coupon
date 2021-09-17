import { createApp } from 'vue'
import App from './App.vue'
import VantUI from './vant-ui'

const app = createApp(App)

app.use(VantUI)
app.mount('#app')
