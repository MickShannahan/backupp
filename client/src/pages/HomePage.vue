<script setup>
import { backupService } from '@/services/backupService.js';
import Panes from '../components/Panes.vue'
import {computed, onMounted, watch} from 'vue'
import { AppState } from '@/AppState.js';
import Pop from '@/utils/Pop.js';
import { logger } from '@/utils/Logger.js';
const activeDir = computed(()=> AppState.activeDir)

watch(activeDir, ()=>{
  if(!activeDir.value) return
  if(!activeDir.value.isStale)return
  logger.log('active Dir changed', activeDir.value.folderSlug)
  backupService.getFolder(activeDir.value.folderSlug)
}, {immediate: true})

onMounted(()=>{
  getAccountData()
})

async function getAccountData(){
  try {
    const data =  await backupService.getFolderData()
    AppState.accountBytes = data[0]?.totalSize ?? 0
  } catch (error) {
    logger.error(error)
    Pop.error(error)
  }
}

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
