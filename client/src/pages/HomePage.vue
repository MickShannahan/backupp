<script setup>
import { backupService, getFolderDir } from '@/services/backupService.js';
import Panes from '../components/Panes.vue'
import {computed, onMounted, watch} from 'vue'
import { AppState } from '@/AppState.js';
import Pop from '@/utils/Pop.js';
import { logger } from '@/utils/Logger.js';
const identity = computed(()=> AppState.identity)
const activeDir = computed(()=> AppState.activeDir)


watch(activeDir, ()=>{
  if(!activeDir.value) return
  if( activeDir.value.fetchedExp && activeDir.value.fetchedExp > Date.now())return
  logger.log('active Dir changed', activeDir.value.folderSlug)
  activeDir.value.fetchedExp = Date.now() + (1000 *60 * 5)
  backupService.getFolder(activeDir.value.folderSlug)
}, {immediate: true})

</script>

<template>
 <Panes/>
</template>

<style scoped lang="scss">
.home {
  display: grid;
  height: 80vh;
  place-content: center;
  text-align: center;
  user-select: none;

  .home-card {
    width: clamp(500px, 50vw, 100%);

    >img {
      height: 200px;
      max-width: 200px;
      width: 100%;
      object-fit: contain;
      object-position: center;
    }
  }
}
</style>
