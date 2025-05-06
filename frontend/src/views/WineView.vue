<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
const { t } = useI18n()

const activeSection = ref('')

onMounted(() => {
  const sections = document.querySelectorAll('li[id]')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { threshold: 0.2 }
  )

  sections.forEach((section) => observer.observe(section))
})
</script>

<template>
  <main>
    <div class="wrapper">
      <nav class="sidebar">
        <a
          :class="{ active: activeSection === 'pierreries' }"
          href="#pierreries">
          <div class="img-wrapper">
            <img src="@/assets/wine_range/pierreries.jpg" alt="">
          </div>
          {{ t('wine.pierreries.title') }}</a>
        <a
          :class="{ active: activeSection === 'pierres_precieuses' }"
          href="#pierres_precieuses">
          <div class="img-wrapper">
            <img src="@/assets/wine_range/pierres_precieuses.jpg" alt="">
          </div>
          {{ t('wine.pierres_precieuses.title') }}</a>
        <a
          :class="{ active: activeSection === 'grands_crus' }"
          href="#grands_crus">
          <div class="img-wrapper">
            <img src="@/assets/wine_range/grands_crus.jpg" alt="">
          </div>
          {{ t('wine.grands_crus.title') }}</a>
        <a
          :class="{ active: activeSection === 'vendanges_tardives' }"
          href="#vendanges_tardives">
          <div class="img-wrapper">
            <img src="@/assets/wine_range/vendanges_tardives.jpg" alt="">
          </div>
          {{ t('wine.vendanges_tardives.title') }}</a>
      </nav>
      <h1>{{ t('wine.title') }}</h1>
      <section>
        <ul>
          <li id="pierreries">test 1</li>
          <li id="pierres_precieuses">test 2</li>
          <li id="grands_crus">test 3</li>
          <li id="vendanges_tardives">test 4</li>
        </ul>
      </section>
    </div>
  </main>
</template>

<style scoped>
main {
  scroll-behavior: smooth;
}

.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  margin: auto;
}

h1 {
  font-size: 2rem;
  padding: 3rem 0;
  text-align: center;
}

nav {
  width: 20vw;
  position: sticky;
  top: 0;
  left: 0;
  height: 100vh;
  overflow: auto;
  border-right: 1px solid rgb(0, 0, 0);
  background-color: white;
}
section {
  width: 100%;
  padding-left: 25vw;
  box-sizing: border-box;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  padding-bottom: 20rem;
}

nav a {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  padding: 1rem;
  text-decoration: none;
  font-size: 1.2rem;
}

nav a.active {
  color: black;
}

nav a .img-wrapper {
  display: inline-block;
  height: 35px;
  overflow: hidden;
  padding-right: 1.5rem;
}

nav a img {
  width: auto;
  height: 70px;
  transform: translateY(-35px);
}

nav a.active img {
  transform: translateY(0);
}
</style>
