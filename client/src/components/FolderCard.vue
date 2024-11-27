<script setup>
import { AppState } from '@/AppState.js';
import { Folder } from '@/models/Folder.js';
import { byteSize } from '@/utils/Converters.js';
import { computed } from 'vue';

const {folder} = defineProps({folder: Folder})
const folderSize = computed(()=>{
  return folder._files.reduce((acc, cur)=> acc + cur.size, 0)
})

function setActive(){
  AppState.activeDir = folder
}
</script>


<template>
<div @click="setActive" class="card selectable-primary" role="button">
  <div class="card-body row">
    <span>
      <i class="mdi mdi-folder text-blue me-1"></i>
      {{folder.name}} <small class="px-2 rounded-pill bg-primary-soft">{{ byteSize(folderSize) }}</small>
    </span>
    <div class="d-flex gap-2">
      <small v-if="folder.folderCount">
        <i class="mdi mdi-folder-multiple text-blue me-1"></i>{{ folder.folderCount }}
      </small>
      <small v-if="folder.fileCount">
        <i class="mdi mdi-file-multiple text-teal me-1"></i>{{ folder.fileCount }}
      </small>
    </div>
  </div>
</div>
</template>


<style lang="scss" scoped>
.card{
  height: 100%;
  border: 0;
  background-color: rgba(var(--bs-black-rgb),.1);
  small{
    opacity: .7;
  }
}
</style>