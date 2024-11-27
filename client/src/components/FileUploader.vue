<script setup>
import { AppState } from '@/AppState.js';
import { backupService } from '@/services/backupService.js';
import { logger } from '@/utils/Logger.js';
import { parseError } from '@/utils/ParseError.js';
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
const socketMessages = computed(()=> AppState.socketMessages)
const uploading = ref(false)
const menuOpen = ref(true)
const time = ref(0)
const errorLogs = ref([])

watch(()=>files, ()=>{
  if(uploading.value) return Pop.toast("Upload in progress", '', 'warning')
  if(progressMax.value > 0) clearQueue()
  previewFiles(files)
})

let timer = ref(null)
watch(uploading, (up)=>{
  if(uploading.value && !timer.value){
    time.value = 0
    logger.log('start timer', time.value)
    timer.value = setInterval(()=> time.value += 1, 1000)
  } else {
  logger.log('start timer')
  timer.value = clearInterval(timer.value)
  }
})

watch(socketMessages, (messages)=>{
  if(!uploading.value) return
  logger.log('new msg', messages)
  let lastMessage = messages[messages.length-1]
  if(lastMessage.error){
    logger.log('FAILED TO UPLOAD', lastMessage)
    const upload = filesToUpload.value.find(f => lastMessage.file.name == f.name)
    upload.failed = true
    errorLogs.value.push({
      file: upload,
      error: parseError(lastMessage.error, 'file')
    })
    progressMax.value--
  }else {
    const upload = filesToUpload.value.find(f => lastMessage.file.name == f.name)
    upload.complete = true
    progressCurrent.value++
  }
  if( progressCurrent.value == progressMax.value){
    uploading.value = false
    if(progressMax.value)Pop.toast('Upload Complete', `uploaded ${progressMax.value} files`, 'success')
  }
})

async function uploadFiles(){
  uploading.value = true
  progressCurrent.value = 0
  progressMax.value = filesToUpload.value.length
  
  for (const f of filesToUpload.value){
    let data = new FormData()
    data.append('upload', f.file)
    if(folderSlug) data.append('folderSlug',folderSlug)
    const backup = await backupService.uploadFile(data)
    if(backup) f.queued = true
    if(!backup) f.failed = true
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
  errorLogs.value = []
  progressMax.value = 0
  progressCurrent.value = 0
  time.value = 0
  // filesForm.value.reset()
}

</script>


<template>
  <aside v-if="filesToUpload.length > 0" class="floating-tab">
    <div class="d-flex justify-content-between">
      <div>
        uploading <b>{{ filesToUpload.length }}</b> files
        <span v-if="folderSlug">to <b class="text-primary">{{ folderSlug }}</b></span>
      </div>
      <div  v-if="menuOpen" @click="menuOpen = !menuOpen" class="selectable px-2 rounded" data-bs-toggle="collapse" data-bs-target="#files-list"><i class="mdi mdi-chevron-down"></i></div>
      <div v-else @click="menuOpen = !menuOpen" class="selectable px-2 rounded" data-bs-toggle="collapse" data-bs-target="#files-list"><i class="mdi mdi-chevron-up"></i></div>
    </div>
    <section id="files-list" class="uploading-list collapse show">
      <div class="list-item" v-for="(file, i) in filesToUpload" :key="file.preview">
        <span v-if="!file.queued" class="fw-bold">{{ i+1 }}</span>
        <span v-else-if="file.complete"><i class="mdi mdi-checkbox-marked text-primary fs-5"></i></span>
        <span v-else-if="file.failed" :title="file.errorMsg"><i class="mdi mdi-close-box text-red fs-5"></i></span>
        <span v-else><i class="mdi mdi-loading mdi-spin"></i></span>
        <img class="preview" :src="file.preview" alt="">
        <input v-model="file.file.name" class="form-control border-0" type="text">
      </div>
    </section>
    <section class="mt-1">
      <div v-if="!uploading && time == 0">
        <button @click="clearQueue()" class="w-50 btn">clear</button>
        <button @click="uploadFiles()" class="w-50 btn btn-outline-primary">Upload! </button>
      </div>
      <div v-else-if="uploading">
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
      <small class="w-100 text-center">{{ progressCurrent }} / {{ progressMax }} <span class="px-2 bg-teal-soft rounded"><i class="mdi mdi-timer"></i>{{ time }}s</span></small>
    </div>
    <div v-else class="row align-items-center">
      <small v-if="errorLogs.length" class="w-100 text-danger error-log">
        <div v-for="elog in errorLogs" :key="elog.file?.id">
          {{ elog.file.name }}
          <div class="ms-2">
            <i class="mdi mdi-circle-small">{{ elog.error }}</i>
          </div>
        </div>
      </small>
      <div class="w-50">
        <small class="w-100 text-center">{{ progressCurrent }} / {{ progressMax }} <span class="px-2 bg-teal-soft rounded"><i class="mdi mdi-timer"></i>{{ time }}s</span></small>
      </div>
        <button @click="clearQueue()" class="btn selectable-primary w-150">close <i class="mdi mdi-close"></i></button>
    </div>
  </section>
  </aside>
</template>


<style lang="scss" scoped>
.floating-tab{
  position: fixed;
  bottom: .75em;
  right: .75em;
  width: 375px;
  border: 1px solid var(--bs-border);
  background-color: rgba(var(--bs-black-rgb), .2);
  border: 1px solid var(--bs-dark);
  padding: 1.5em;
  backdrop-filter: blur(15px);
  border-radius: 8px;
  box-shadow: 0px 3px 3px rgba(0,0,0, .2);

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


  .error-log{
    max-height: 10em;
    overflow-y: auto
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