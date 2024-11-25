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
<section @dragleave="dragIn = false" @mouseleave="dragIn = false" @dragover.stop.prevent="dragEnter" @drop.stop.prevent="handleDrop" :class="{dragIn}">
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
    outline: 2px dashed var(--bs-primary);
    outline-offset: -2px;
    background-color: rgba(137, 43, 226, 0.2);
    content: '';
    border-radius: 4px;
  }
}
</style>