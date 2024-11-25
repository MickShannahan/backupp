<script setup>
import { AppState } from '@/AppState.js';
import { backupService } from '@/services/backupService.js';
import { computed, ref, useTemplateRef } from 'vue';

const selectedFiles = ref([])
const progressMax = ref(0)
const progressCurrent = ref(0)
const filesForm = useTemplateRef('files-form')
const activeDir = computed(()=> AppState.activeDir)

function uploadFiles(){
  console.log(selectedFiles.value)
  progressMax.value = selectedFiles.value.length
  selectedFiles.value.forEach(async f => {
    let data = new FormData()
    data.append('upload', f.file)
    if(AppState.activeDir) data.append('folderSlug', AppState.activeDir)
    const backup = await backupService.uploadFile(data)
    if(backup) f.completed = true
    if(!backup) f.failed = true
    progressCurrent.value++
    if(progressCurrent.value == progressMax.value){
      setTimeout(clearForm, 3000)
    }
  })
}

function previewFiles(e){
  const files = e.target.files
  console.log(files)
  for(let i = 0; i < files.length; i++){
    const file = files[i]
    selectedFiles.value.push({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    })
  }
}

function clearForm(){
  selectedFiles.value = []
  progressMax.value = 0
  progressCurrent.value = 0
  filesForm.value.reset()
}
</script>


<template>
<form ref="files-form" @submit.prevent="uploadFiles">
  <label for="">Add to {{ activeDir }}</label>
  <input @input="previewFiles" name="files" type="file" multiple="true" required>
  <button v-if="selectedFiles.length">Submit</button>
  <div v-if="progressMax > 0" class="progress-wrapper">
    <div class="progress-current"
     :style="`width: ${(progressCurrent/progressMax) * 100}%`">{{ progressCurrent }}| {{ progressMax }}</div>
  </div>
</form>
<section v-if="selectedFiles.length">
  <div>Selected: {{ selectedFiles.length }}</div>
  <div v-for="file in selectedFiles" :key="file.name" class="file-preview" 
  :class="{completed: file.completed, failed: file.failed}">
    <img :src="file.preview" :alt="file.name">
    <div>
      <div>{{ file.name }}</div>
      <div>{{(file.size/1024/1024).toFixed(2)}}mb</div>
    </div>
  </div>
</section>
</template>


<style lang="scss" scoped>
.file-preview{
  display: flex;
  gap: 5px;
  margin-bottom: .2em;
  img{
    height: 50px;
    width: 50px;
    object-fit: cover;
    background-color: rgba(128, 128, 128, 0.2);
    border-radius: 4px
  }
  &.completed{
    background-color: rgba(172, 255, 47, 0.2);
  }
  &.failed{
    background-color: rgba(255, 47, 92, 0.2);
  }
}

form{
  button{
    width: 100%;
  }
}

.progress-wrapper{
  width: 100%;
  height: 16px;
  .progress-current{
    height: 100%;
    background-color: blueviolet;
    transition: width .2s ease;
  }
}
</style>