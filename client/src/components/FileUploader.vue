<script setup>
import { backupService } from '@/services/backupService.js';
import Pop from '@/utils/Pop.js';
import { computed, ref, watch } from 'vue';

const {files, folderSlug} = defineProps({
  files: {type: Array },
  folderSlug: {type: String, default: ''}
})

const filesToUpload = ref([])
const progressMax = ref(0)
const progressCurrent = ref(0)
const progressPercent = computed(()=> Math.round((progressCurrent.value / progressMax.value)*100))
const uploading = ref(false)
const menuOpen = ref(true)

watch(()=>files, ()=>{
  previewFiles(files)
})

async function uploadFiles(){
  uploading.value = true
  console.log('uploading',filesToUpload.value.length)
  progressMax.value = filesToUpload.value.length
  
  for (const f of filesToUpload.value){
    let data = new FormData()
    data.append('upload', f.file)
    if(folderSlug) data.append('folderSlug',folderSlug)
    const backup = await backupService.uploadFile(data)
    if(backup) f.completed = true
    if(!backup) f.failed = true
    progressCurrent.value++
    if(progressCurrent.value == progressMax.value){
      Pop.toast('File Upload Complete', '', 'success', '', 'bottom-center')
      setTimeout(clearQueue, 3000)
    }
  }
}

function previewFiles(files){
  for(let i = 0; i < files.length; i++){
    const file = files[i]
    if(filesToUpload.value.find(f => f.name == file.name)) continue
    filesToUpload.value.push({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    })
  }
}

function clearQueue(){
  uploading.value = false
  filesToUpload.value = []
  progressMax.value = 0
  progressCurrent.value = 0
  // filesForm.value.reset()
}

</script>


<template>
  <aside v-if="filesToUpload.length > 0" class="floating-tab">
    <div class="d-flex justify-content-between">
      <div>
        uploading {{ filesToUpload.length }} files
        <span v-if="folderSlug">to {{ folderSlug }}</span>
      </div>
      <div  v-if="menuOpen" @click="menuOpen = !menuOpen" class="selectable px-2 rounded" data-bs-toggle="collapse" data-bs-target="#files-list"><i class="mdi mdi-chevron-down"></i></div>
      <div v-else @click="menuOpen = !menuOpen" class="selectable px-2 rounded" data-bs-toggle="collapse" data-bs-target="#files-list"><i class="mdi mdi-chevron-up"></i></div>
    </div>
    <section id="files-list" class="uploading-list collapse show">
      <div class="list-item" v-for="(file, i) in filesToUpload" :key="file.preview">
        <span v-if="!uploading">{{ i+1 }}</span>
        <span v-else-if="file.completed"><i class="mdi mdi-checkbox-marked text-success"></i></span>
        <span v-else-if="file.failed"><i class="mdi mdi-close-box text-danger"></i></span>
        <span v-else><i class="mdi mdi-loading mdi-spin"></i></span>
        <img class="preview" :src="file.preview" alt="">
        <input v-model="file.file.name" class="form-control border-0" type="text">
      </div>
    </section>
    <section class="mt-1">
      <div v-if="!uploading">
        <button @click="clearQueue()" class="w-50 btn">clear</button>
        <button @click="uploadFiles()" class="w-50 btn btn-outline-primary">Upload! </button>
      </div>
      <div v-else>
      <div class="progress">
        <div
        class="progress-bar bg-primary"
          role="progressbar"
          :style="`width: ${progressPercent}%;`"
          :aria-valuenow="progressPercent"
          aria-valuemin="0"
          aria-valuemax="100"
          >
          {{progressPercent}}%
        </div>
      </div>
      <div class="uploading-animation">
        
      </div>
      <small class="w-100 text-center">{{ progressCurrent }} / {{ progressMax }}</small>
    </div>
  </section>
  </aside>
</template>


<style lang="scss" scoped>
.floating-tab{
  position: fixed;
  bottom: 1em;
  right: 1em;
  width: 375px;
  border: 1px solid var(--bs-border);
  background-color: rgba(var(--bs-dark-rgb), .3);
  padding: 1.5em;
  backdrop-filter: blur(15px);
  border-radius: 8px;
  box-shadow: 0px 3px 3px black;

  .uploading-list{
    max-height: 200px;
    overflow-y: auto;
    padding: 1em;
    font-size: 14px;
    input{
      font-size: 14px;
    }

    .list-item{
      display: flex;
      gap: 5px;
      margin: 10px 0;
      align-items: center;
    }

    img.preview{
    height: 35px;
    width: 50px;
    object-fit: cover;
    object-position: center;
    border-radius: 3px;
    background-color: rgba(var(--bs-light-rgb), .2);
  }
  }
  .uploading-animation{
    position: relative;
    height: 1px;
    width: 95%;
    margin: 0 auto;
    margin-top: -1px;
    &::after{
      position: absolute;
      content: '';
      background: linear-gradient(to right, transparent , var(--bs-info), transparent);
      height: 100%;
      animation: loading-animation 2s linear infinite;
    }
  }

  .progress-bar{
    min-width: 12%;
  }

}

@keyframes loading-animation {
  0%{
    width: 0%;
    margin-left: 0%;
    opacity: 0;
  }
  50%{
    width: 100%;
    margin-left: 0%;
    opacity: 1;
  }
  100%{
    width: 0%;
    margin-left: 100%;
    opacity: 0;
  }
  
}
</style>