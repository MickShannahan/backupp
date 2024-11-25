<script setup>
import { AppState } from '@/AppState.js';
import { computed } from 'vue';
import AddFolderForm from './AddFolderForm.vue';
import ModalWrapper from './ModalWrapper.vue';
import { backupService } from '@/services/backupService.js';

const activeDir = computed(()=> AppState.activeDir)
const dirSize = computed(()=> {
  const bytes = AppState.activeDir?._files.reduce((acc, cur)=> acc + cur.size, 0)
  const kilo = bytes /1024
  if(kilo < 1024) return kilo.toFixed(3) + 'kb'
  const mega = kilo / 1024
  if(mega < 1024) return mega.toFixed(3) + 'mb'
  const gig = mega / 1024
  if(gig < 1024) return gig.toFixed(3) + 'gb'
  const tera = gig /1024
  return tera.toFixed(3)  + 'tb'
})
const dirCost = computed(()=>{
  const bytes = AppState.activeDir?._files.reduce((acc, cur)=> acc + cur.size, 0)
  const gigs = bytes/1024/1024/1024
  return Intl.NumberFormat('en-us', {currency: 'USD'}).format(gigs * AppState.coldPriceUSD)
})

 async function deleteDir(){
  const confirmed = confirm("Really Delete " + activeDir.value.name + '?')
  if(!confirmed) return
  await backupService.deleteFolder(activeDir.value.id, activeDir.value.folder)
 }
</script>


<template>
<div class="container-fluid p-2 sticky-top ">
  <section class="row">
    <div v-if="activeDir">
      <div class="bg-glass border rounded d-flex justify-content-between align-items-center p-2">
        <section>
          <div class="fs-5 fw-bold">{{ activeDir.name || 'base' }}</div>
          <small class="d-flex gap-2">
            <span class="text-secondary">/{{ activeDir.folderSlug }}</span>
            <span class="rounded-pill text-dark bg-warning px-2">{{ dirSize }}</span>
            <span class="rounded-pill text-success bg-black px-2">$ {{ dirCost }}</span>
          </small>
        </section>
        <section class="d-flex">
          <button data-bs-toggle="modal" data-bs-target="#create-folder-form" class="btn selectable"><i class="mdi mdi-plus"></i><i class="mdi mdi-folder-outline"></i>
          </button>
          <button class="btn selectable"><i class="mdi mdi-plus"></i><i class="mdi mdi-file-outline"></i>
          </button>
          <div class="dropdown">
          <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="mdi mdi-cog-outline"></i>
          </button>
          <ul class="dropdown-menu">
            <li><button @click="deleteDir" class="dropdown-item text-danger" type="button">Delete Folder</button></li>
          </ul>
        </div>
        </section>
      </div>
    </div>
  </section>
</div>
<ModalWrapper v-if="activeDir" id="create-folder-form">
  <AddFolderForm :parentData="activeDir"/>
</ModalWrapper>
</template>


<style lang="scss" scoped>

</style>