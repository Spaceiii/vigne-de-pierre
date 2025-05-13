<script setup lang="ts">
import '@/assets/global.css'

import { RouterView } from 'vue-router'
import { useMessageStore } from '@/stores/message.ts'
import { useI18n } from 'vue-i18n'
import NavBar from '@/components/Navbar/NavBar.vue'
import Footer from '@/components/Footer/Footer.vue'

const { t } = useI18n()
const messageStore = useMessageStore()

function removeMessage(id: number) {
  const element = document.getElementById(`debug-${id}`)
  if (element) {
    element.classList.add('debug-leave')
    setTimeout(() => {
      messageStore.clearMessage(id)
    }, 300)
  } else {
    messageStore.clearMessage(id)
  }
}
</script>

<template>
  <NavBar />

  <div class="app">
    <RouterView :key="$route.fullPath" />

    <div class="debug-container" v-if="messageStore.hasMessage">
      <template v-for="message in messageStore.messages" :key="message.id">
        <div class="debug" :id="'debug-' + message.id" :class="message.type">
          <h1>
            <span v-if="message.type === 'info'">{{ t('error.info') }}</span>
            <span v-else-if="message.type === 'warning'">{{ t('error.warning') }}</span>
            <span v-else-if="message.type === 'error'">{{ t('error.error') }}</span>
            :
            {{ message.content }}
          </h1>
          <img
            src="@/assets/cross.svg"
            :alt="t('error.close')"
            @click="removeMessage(message.id)"
          />
        </div>
      </template>
    </div>

    <div class="bottom-footer">
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.app {
  position: relative;
  box-sizing: border-box;
  padding-bottom: var(--footer-spacing);
  min-height: calc(100vh - var(--footer-spacing));
}

.bottom-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.debug-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 1000;
  pointer-events: none;
}

.debug {
  pointer-events: all;
  width: 100%;
  max-width: 400px;
  padding: 20px 30px;
  border-radius: 15px;
  background: linear-gradient(135deg, rgba(255, 0, 0, 0.85), rgba(200, 0, 0, 0.8));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  position: relative;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.debug-leave {
  transform: translateY(50px);
  opacity: 0;
}

.debug.info {
  background: linear-gradient(135deg, rgba(0, 0, 255, 0.85), rgba(0, 0, 200, 0.8));
}

.debug.warning {
  background: linear-gradient(135deg, rgba(165, 165, 0, 0.85), rgba(150, 150, 0, 0.8));
}

.debug h1 {
  margin: 0;
  padding: 0 10px;
  font-size: 1.2rem;
  flex-grow: 1;
  text-align: center;
}

.debug img {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 22px;
  height: 22px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.debug img:hover {
  opacity: 1;
}
</style>
