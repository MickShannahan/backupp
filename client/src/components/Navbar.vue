<script setup>
import { computed, onMounted, ref } from 'vue';
import { loadState, saveState } from '../utils/Store.js';
import Login from './Login.vue';
import { byteSize } from '@/utils/Converters.js';
import { AppState } from '@/AppState.js';

const theme = ref(loadState('theme') || 'dark')
const accountSize = computed(()=>byteSize(AppState.accountBytes))

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', theme.value)
})

function toggleTheme() {
  theme.value = theme.value == 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-bs-theme', theme.value)
  saveState('theme', theme.value)
}

</script>

<template>
  <aside class="d-flex align-items-center">
    <Login />
    <button class="btn text-light" @click="toggleTheme"
    :title="`Enable ${theme == 'light' ? 'dark' : 'light'} theme.`">
    <Icon :name="theme == 'light' ? 'weather-sunny' : 'weather-night'" />
  </button>
  <small>
    <div title="Total account storage size" class="bg-primary-soft px-2 mb-1 rounded-pill">{{accountSize}}</div>
    <div title="Total account storage spending" class="bg-green-soft px-2 rounded-pill">${{((AppState.accountBytes/1024/1024/1024)* AppState.coldPriceUSD).toFixed(5)}}</div>
  </small>
</aside>
</template>

<style scoped>
a:hover {
  text-decoration: none;
}

.nav-link {
  text-transform: uppercase;
}

.navbar-nav .router-link-exact-active {
  border-bottom: 2px solid var(--bs-success);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

</style>
