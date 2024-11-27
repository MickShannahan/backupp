<script setup>
import { logger } from '@/utils/Logger.js';
import { ref } from 'vue';
import FileUploader from './FileUploader.vue';

const {folder} = defineProps({folder: {type: String, default: ''}})
const droppedFiles = ref([])

const dragIn = ref(false)

function dragEnter(){
  dragIn.value = true
}

function handleDrop(e){
  dragIn.value = false
  const files = e.dataTransfer.files;
  logger.log(files)
  droppedFiles.value = files
}
</script>


<template>
  <section @dragleave.stop.prevent="dragIn = false" @mouseout.stop.prevent="dragIn = false" @dragexit.stop.prevent="dragIn = false" @dragover.stop.prevent="dragEnter" @drop.stop.prevent="handleDrop" :class="{dragIn}">
  <small class="message bg-glass rounded-pill px-2">
  Add files to {{ folder || '/base' }}
  </small>
<slot>Drop Files To add</slot>
<FileUploader :files="droppedFiles" :folderSlug="folder"/>
</section>
</template>


<style lang="scss" scoped>
.dragIn{
  position: relative;
  &:after{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    outline: 2px dashed rgba(var(--bs-primary-rgb), 0.4);
    outline-offset: -2px;
    background-color: rgba(var(--bs-primary-rgb), 0.1);
    content: '';
    border-radius: 4px;
  }
  // .message{
  //   display: inline-block;
  // }
}

.message{
  position: fixed;
  bottom: -1.75em;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  z-index: 9999;
}

</style>