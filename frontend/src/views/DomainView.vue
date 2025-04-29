<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <section>
    <h1>{{ t('domain_page.title') }}</h1>

    <article>
      <img src="@/assets/domain/philo.jpg" :alt="t('domain_page.philo.alt')" />
      <div>
        <h3>{{ t('domain_page.philo.title') }}</h3>
        <p v-html="t('domain_page.philo.content_0')"></p>

        <p class="quotes">&ldquo;{{ t('domain_page.philo.quote') }}&rdquo;<br><span class="author">- {{ t('domain_page.philo.author') }}</span></p>

        <p v-html="t('domain_page.philo.content_1')"></p>
      </div>
    </article>
    <article>
      <img src="@/assets/domain/vignes.jpg" :alt="t('domain_page.vignes.alt')" />
      <div>
        <h3>{{ t('domain_page.vignes.title') }}</h3>
        <p v-html="t('domain_page.vignes.content_0')"></p>
      </div>
    </article>

    <article>
      <img src="@/assets/domain/cave.jpg" :alt="t('domain_page.cave.alt')" />
      <div>
        <h3>{{ t('domain_page.cave.title') }}</h3>
        <p v-html="t('domain_page.cave.content_0')"></p>
      </div>
    </article>
    <article>
      <img src="@/assets/domain/caveau.jpg" :alt="t('domain_page.caveau.alt')" />
      <div>
        <h3>{{ t('domain_page.caveau.title') }}</h3>
        <p v-html="t('domain_page.caveau.content_0')"></p>
      </div>
    </article>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

article {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
}

article:nth-child(odd) {
  flex-direction: row-reverse;
}

article div {
  border-left: 1px solid;
  max-width: 40rem;
  padding-left: 2rem;
}

article:nth-child(odd) div {
  border-left: none;
  border-right: 1px solid;
  margin: 1rem 0;
  padding-right: 2rem;
  padding-left: 0;
}

article img {
  width: 20rem;
  height: 20rem;
  margin-right: 2rem;
}

article:nth-child(odd) img {
  margin-right: 0;
  margin-left: 2rem;
}

article h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: rgb(110, 110, 110);
}

.quotes {
  quotes: "«" "»" "‹" "›";
  padding: .5rem 1rem;
  background: rgb(210, 210, 210);
}

.author {
  display: inline-block;
  font-style: italic;
  margin-top: .5rem;
}
</style>
