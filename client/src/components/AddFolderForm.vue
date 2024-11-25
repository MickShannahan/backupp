<script setup>
import { Folder } from '@/models/Folder.js';
import { backupService } from '@/services/backupService.js';
import { logger } from '@/utils/Logger.js';
import Pop from '@/utils/Pop.js';
import { ref, watch } from 'vue';

const props = defineProps({folderData: Folder, parentData: Folder})

const formData = ref({
  name: '',
  folder: ''
})
watch(props, ()=>{
  if(props.folderData){
    formData.value.name = props.folderData.name
    formData.value.folder = props.folderData.folder
  }
  if(props.parentData){
    formData.value.folder = props.parentData.folderSlug
  }
})

async function createFolder(){
  try {
      await backupService.createFolder(formData.value)
  } catch (error) {
    Pop.error(error)
    logger.error(error)
  }
}
</script>


<template>
<form @submit.prevent="createFolder">
  <div class="fw-bold mb-2">Add folder</div>
  <div class="mb-3">
    <label for="folder-name">
      {{parentData.folderSlug ? parentData.folderSlug + '/' : ''}}
      <span class="border px-1 rounded text-success">{{ formData.name }}</span>
    </label>
    <input v-model="formData.name" placeholder="folder name" class="form-control" id="folder-name" name="folder-name" type="text" maxlength="25" minlength="2" required>
  </div>
  <button class="btn btn-primary w-100">Create <i class="mdi mdi-plus"></i></button>
</form>
</template>


<style lang="scss" scoped>

</style>