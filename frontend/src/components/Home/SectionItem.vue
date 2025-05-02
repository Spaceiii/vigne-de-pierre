<template>
  <div class="home-section">
    <router-link :to="{ name: toName }" v-if="toName">
      <h1><slot name="title">Default title</slot></h1>
      <slot name="image"><img src="@/assets/logo.png" alt="Logo" /></slot>
    </router-link>
    <div v-else>
      <h1><slot name="title">Default title</slot></h1>
      <slot name="image"><img src="@/assets/logo.png" alt="Logo" /></slot>
    </div>
  </div>
</template>

<style>
.home-section {
  width: 35vw;
  height: 40vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.home-section img {
  display: block;
  width: 35vw;
  height: 40vh;
  object-fit: cover;
  filter: brightness(0.8);
}

.home-section h1 {
  font-size: 2rem;
  color: white;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  margin-bottom: 1rem;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}
</style>

<script setup lang="ts">
const { toName } = defineProps<{
  toName?: string
}>()
</script>
