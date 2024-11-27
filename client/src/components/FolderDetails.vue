<script setup>
import { AppState } from '@/AppState.js';
import { computed, ref, useTemplateRef } from 'vue';
import AddFolderForm from './AddFolderForm.vue';
import ModalWrapper from './ModalWrapper.vue';
import { backupService } from '@/services/backupService.js';
import { byteSize } from '@/utils/Converters.js';
import FilesSearch from './FilesSearch.vue';
import FileUploader from './FileUploader.vue';
import Pop from '@/utils/Pop.js';

const emit = defineEmits(['search'])


const activeDir = computed(()=> AppState.activeDir)
const dirSize = computed(()=> {
  const bytes = AppState.activeDir?._files.reduce((acc, cur)=> acc + cur.size, 0)
  return byteSize(bytes)
})
const hotSize = computed(()=>{
  const bytes = AppState.activeDir?._files.reduce((acc, cur)=> acc + (cur.thumbnail?.size ?? 0), 0)
  return byteSize(bytes)
})
const dirCost = computed(()=>{
  const bytes = AppState.activeDir?._files.reduce((acc, cur)=> acc + cur.size, 0)
  const gigs = bytes/1024/1024/1024
  return (gigs * AppState.coldPriceUSD).toFixed(6)
})

const hotCost = computed(()=>{
  const hotbytes =AppState.activeDir?._files.reduce((acc, cur)=> acc + (cur.thumbnail?.size ?? 0), 0)
  const gigs = hotbytes/1024/1024/1024
  return (gigs * AppState.hotPriceUSD).toFixed(6)
})

async function deleteDir(){
  const confirmed = confirm("Are you sure you want to Delete " + activeDir.value.name + '?')
  if(!confirmed) return
  const confirmed2 = confirm("You understand this will not only delete all of the files in this folder, but will also delete all files in sub folders too.")
  if(!confirmed2)return
  const confirmed3= prompt(`To Finalize delete type the name of the folder: ${activeDir.value.name}`)
  if(confirmed3 != activeDir.value.name) return
  await backupService.deleteFolder(activeDir.value.id, activeDir.value.folder)
}

async function downloadWholeFolder(){
  Pop.toast("Whoops", 'This feature is not yet implemented', 'info')
}

const fileInput = useTemplateRef('fileInput')
async function openFileInput(){
  fileInput.value.click()
}

const importedFiles = ref([])
async function importFiles(input){
  let files = input.target.files
  importedFiles.value = files
}
</script>


<template>
    <div v-if="activeDir" class="container-fluid sticky-top ">
      <div class="bg-glass border rounded d-flex justify-content-between align-items-center p-2">
        <section>
          <div class="fs-5 fw-bold">{{ activeDir.name || 'base' }}</div>
          <small class="d-flex gap-2">
            <span class="text-secondary">/{{ activeDir.folderSlug }}</span>
            <span class="rounded-pill bg-primary-soft px-2" :title="`+ an additional ${hotSize} for previews`">{{ dirSize }}</span>
            <span class="rounded-pill bg-green-soft px-2" :title="`+ an additional ${hotCost} for previews`">$ {{ dirCost }}</span>
          </small>
        </section>
          <FilesSearch @search="(em)=>$emit('search', em)"  />
        <section class="d-flex">
          <button data-bs-toggle="modal" data-bs-target="#create-folder-form" class="btn selectable"><i class="mdi mdi-plus"></i><i class="mdi mdi-folder-outline"></i>
          </button>
          <button @click="openFileInput" class="btn selectable"><i class="mdi mdi-plus"></i><i class="mdi mdi-file-outline"></i>
            <input @change="importFiles" ref="fileInput" class="d-none" type="file" multiple="true">
          </button>
          <div class="dropdown">
          <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="mdi mdi-folder-cog-outline"></i>
          </button>
          <ul class="dropdown-menu">
            <li><button @click="downloadWholeFolder" class="dropdown-item">Download folder files <i class="mdi mdi-file-download text-teal"></i></button></li>
            <li><button @click="deleteDir" class="dropdown-item text-danger" type="button">Delete Folder <i class="mdi mdi-folder-cancel"></i></button></li>
          </ul>
        </div>
        </section>
      </div>
    </div>
<ModalWrapper v-if="activeDir" id="create-folder-form">
  <AddFolderForm :parentData="activeDir"/>
</ModalWrapper>
<FileUploader v-if="activeDir" :files="importedFiles" :folderSlug="activeDir.folderSlug"/>
</template>


<style lang="scss" scoped>
.sticky-top{
  top: .5em;
}
</style>