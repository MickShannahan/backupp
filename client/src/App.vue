<script setup>
import Navbar from './components/Navbar.vue';
import { AppState } from './AppState.js';

</script>

<template>
  <header>
  </header>
  <main>
    <router-view />
  </main>
<footer class="bg-glass">
  <Navbar />
</footer>
</template>

<style lang="scss">
@import '@/assets/scss/main.scss';
:root{
  --left-pane-size: 250px;
}

footer {
  position: fixed;
  bottom: 0.5em;
  left: 0.5em;
  padding: .5rem 1rem;
  width: var(--left-pane-size);
  border-radius: 8px;
}
</style>
