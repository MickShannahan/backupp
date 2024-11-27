<script setup>
import { AppState } from '@/AppState.js';
import { Folder } from '@/models/Folder.js';
import { backupService } from '@/services/backupService.js';
import { computed, onMounted, ref } from 'vue'
import FileDropZone from './FileDropZone.vue';

const {folder, level, alwaysOpen} = defineProps({folder: {type: Folder}, level: {type: Number, default: 0}, alwaysOpen: {type: Boolean, default: false}})
const active = computed(()=> AppState.activeDir == folder)
const isBase = folder.name == ''

const folderIndent = computed(()=> (level * 10)  + 'px')
const open = ref(alwaysOpen)
const fetched = ref(false)

function openFolder(){
  open.value = alwaysOpen ? true : active.value && open.value ? false : true
  AppState.activeDir = folder
}

async function preFetchFolder(){
  if(fetched.value) return
  await backupService.getFolder(folder.folderSlug)
  fetched.value = true
}
</script>


<template>
<section class="folder-indent d-flex flex-column">
  <FileDropZone :folder="folder.folderSlug">
    <button @mouseenter="preFetchFolder" @click="openFolder()" class="btn selectable-primary d-flex text-start" :class="{active}">
      <i v-if="level > 0" class="tree-line"></i>
      <i v-if="!open && !active" class="mdi mdi-folder me-1 text-blue"></i>
      <i v-else class="mdi mdi-folder-open me-1 text-blue"></i>
      {{ folder.name || '/' }}
      <small>
        <span v-if="folder.fileCount || isBase">{{ Intl.NumberFormat('en-us').format(isBase ?folder._files.length : folder.fileCount) }}<i class="mdi mdi-file-multiple text-teal text-opacity-50"></i></span>
        <span v-if="folder.folderCount">{{ folder.folderCount }}<i class="mdi mdi-folder-multiple text-blue text-opacity-50"></i></span>
      </small>
    </button>
    <section v-if="open || active">
      <FolderTree v-for="(childD, childN) in folder._folders" :folder="childD" :level="level +1" :key="childN"/>
    </section>
  </FileDropZone>
</section>
</template>


<style lang="scss" scoped>
.folder-indent{
  margin-left: v-bind(folderIndent);
}
small{
  display: flex;
  gap: 5px;
  margin: 0px 5px;
  color: rgba(var(--bs-light-rgb), .5);
}
.tree-line{
  display: block;
  position: relative;
  &::after{
    left: -14px;
    position: absolute;
    content: '';
    width: 12px;
    height: 12px;
    border-width: 0px;
    border-color: var(--bs-secondary);
    border-style: dotted;
    border-bottom-width: 1px;
    border-left-width: 1px;
    border-bottom-left-radius: 3px;
  }
}

button.active{
  background-color: rgba(var(--bs-primary-rgb), .2);
  color: var(--bs-primary);
  border: 0;
}
</style>