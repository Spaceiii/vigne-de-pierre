import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import messages from './locales/index'

import App from './App.vue'
import router from './router'

const i18n = createI18n({
  locale: 'fr',
  fallbackLocale: 'fr',
  messages,
})

const app = createApp(App)

app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')
