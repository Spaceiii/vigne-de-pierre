<script setup lang="ts">

</script>

<template>
  <div class="cart-drawer">
    <h1>Drawer</h1>
  </div>
</template>

<style scoped>
.cart-drawer {
  position: fixed;
  top: var(--navbar-height);
  right: 0;
  width: 300px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 900;
  padding: 20px;
}
</style>
