<script setup>
import { AppState } from '@/AppState.js';
import { computed, onMounted, ref, watch } from 'vue';
import FileCard from './FileCard.vue';
import { backupService } from '@/services/backupService.js';
import Pop from '@/utils/Pop.js';
import FileDropZone from './FileDropZone.vue';
import { logger } from '@/utils/Logger.js';
import FolderTree from './FolderTree.vue';
import FolderDetails from './FolderDetails.vue';
import Options from './Options.vue';
import FolderCard from './FolderCard.vue';
import {File} from '../models/File.js'

onMounted(()=> window.addEventListener('keydown', handleKey))
onMounted(()=> window.addEventListener('keyup', clearKey))
onMounted(()=> AppState.activeDir = AppState.backup)

const tree = computed(()=> AppState.backup._folders)
const activeDir = computed(()=> AppState.activeDir)
const folders = computed(()=> AppState.activeDir?._folders)
const filterBy = ref('')
const files = computed(()=>{
  if(filterBy.value == '')return  sortItemsBy(AppState.activeDir?._files)
  const rx = new RegExp(filterBy.value,'ig')
  return sortItemsBy(AppState.activeDir?._files.filter(f => rx.test(f.name)))
})

watch(activeDir, ()=> selectedFiles.value.length = 0)

function handleKey(e){
  // logger.log(e)
  switch(e.key){
    case 'Delete':
      deleteFiles()
      break
    case 'Enter' :
      if(!e.altKey) break
      downloadSelection()
      break
    case 'a':
      if(!e.altKey) break
      selectAll()
      break
    case 'Shift':
      shiftDown.value = true
      break
  }
}

function clearKey(e){
  switch(e.key){
    case 'Shift':
      shiftDown.value = false
    }
  }
  
const selectedFiles = ref([])
const shiftDown = ref(false)
function toggleFileSelection(file){
  if(selectedFiles.value.includes(file)){
    selectedFiles.value.splice(selectedFiles.value.indexOf(file),1 )
  } else {
    selectedFiles.value.push(file)
  }
  if(shiftDown.value && selectedFiles.value.length > 0){
    let clicked = files.value.indexOf(file)
    let start = files.value.indexOf(selectedFiles.value[0])
    let end = start < clicked ? clicked : start
    start = start == end ? clicked: start
    logger.log('shift click', start, end, clicked)
    for(let i = start + 1; i < end; i++){
      const f = files.value[i]
      if(selectedFiles.value.includes(f)) continue
      selectedFiles.value.push(f)
    }
  }
}

let doubleA = false
function selectAll(){
  setTimeout(()=>doubleA = false, 500)
  if(doubleA){
    selectedFiles.value.length = 0
    return
  }
  doubleA = true
  const cards = files.value
  const selected = selectedFiles.value
  cards.forEach(card => {
    if(selected.includes(card)) return
    selected.push(card)
  })
}

function filterFiles(filter){
  logger.log('filtering', filter)
  filterBy.value = filter
}

async function deleteFiles(){
  if(!selectedFiles.value.length) return
  const confirm = window.confirm(`Delete ${selectedFiles.value.length} files?`)
  if(!confirm) return
  if(selectedFiles.value.length > 5){
    const confirmTwo = window.confirm(`Are you sure? They will no longer be backed up anymore!`)
    if(!confirmTwo) return
  }
  let toDel = [...selectedFiles.value.reverse()]
  for(let f of toDel){
    await backupService.deleteBackup(f.id, f.folder)
    selectedFiles.value.splice(selectedFiles.value.indexOf(f),1)
    if(selectedFiles.value.length == 0){
      Pop.toast("Deletion complete", '', 'success')
    }
  }

}
async function downloadSelection(){
  const urls = []
  selectedFiles.value.forEach(f => urls.push(f.url))
  logger.log('downloading', urls)
  backupService.downloadFromUrls(urls, activeDir.value.name)
}

const gridSize = ref('175px')
const imageSize = ref('90px')
const cardDirection = ref('column')
function changeLayout(layout){
switch(layout){
  case 'list':
    gridSize.value = '100%'
    imageSize.value = '80px'
    cardDirection.value = 'row'
    break
  case 'column':
    gridSize.value = '400px'
    imageSize.value = '80px'
    cardDirection.value = 'row'
    break
  case 'grid':
    gridSize.value = '175px'
    imageSize.value = '90px'
    cardDirection.value = 'column'
    break
  case 'grid-large':
    gridSize.value = '225px'
    imageSize.value = '140px'
    cardDirection.value = 'column'
    break
  case 'grid-xl':
    gridSize.value = '300px'
    imageSize.value = '275px'
    cardDirection.value = 'column'
    break
  default:
    gridSize.value = '175px'
    imageSize.value = '90px'
    cardDirection.value = 'column'
}
}

const sortBy = ref('new-old')
/**
 * @param {File[]} items 
 */
function sortItemsBy(items){
  let copy = [...items]
  switch(sortBy.value){
    case 'new-old': copy.sort((a,b)=> b.createdAt.getTime() - a.createdAt.getTime())
    break
    case 'old-new' : copy.sort((a,b)=> a.createdAt.getTime() - b.createdAt.getTime())
    break
    case 'lg-sm' : copy.sort((a,b)=> b.size - a.size)
    break
    case 'sm-lg' : copy.sort((a,b)=> a.size - b.size)
    break
    case 'a-z' : copy.sort((a,b)=>  a.name.localeCompare(b.name))
    break
    case 'z-a' : copy.sort((a,b)=> b.name.localeCompare(a.name))
  }
  return copy
}

</script>


<template>
  <FolderDetails @search="filterFiles"/>
  <div class="container-fluid py-2 d-flex flex-column flex-grow-1">
    <div class="panes my-2">
      <!-- SECTION trunk -->
      <section class="d-flex flex-column">
        <div class="panes-sticky">
          <FolderTree :folder="AppState.backup" :alwaysOpen="true" :level="-1"/>
        </div>
        </section>
      <!-- SECTION main view -->
      <FileDropZone :folder="AppState.activeDir?.folderSlug ?? ''">
        <section class="folder-grid">
          <TransitionGroup name="list">
            <div v-for="folder in folders" :key="folder.id">
              <FolderCard :folder="folder"/>
            </div>
          </TransitionGroup>
        </section>
          <section v-if="files?.length < 65" class="files-grid">
            <TransitionGroup name="list" >
              <div v-for="file in files"  :key="file.name" class="file-container">
                <FileCard :file @selected="toggleFileSelection" :selected="selectedFiles.includes(file)"/>
              </div>
            </TransitionGroup>
          </section>
          <section v-else class="files-grid">
              <div v-for="file in files" :key="file.id" class="file-container">
                <FileCard :file @selected="toggleFileSelection" :selected="selectedFiles.includes(file)"/>
              </div>
          </section>
        </FileDropZone>
    <!-- SECTION options -->
    <section >
      <div class="panes-sticky">
        <Options :show="selectedFiles.length > 0" :selection="selectedFiles"
          @delete="deleteFiles"
          @selectAll="selectAll"
          @download="downloadSelection"
          @changeLayout="changeLayout"
          @sortBy="(type)=> sortBy = type"
          ></Options>
        </div>
    </section>
  </div>
</div>
  
  <section class="context-wrapper">
    <span class="tab" :class="{active: selectedFiles.length}">Selected <b>{{ selectedFiles.length }}</b> <i class="mdi mdi-circle-small"></i> <kbd>del</kbd> to delete</span>
  </section>
</template>


<style lang="scss">

.panes{
  --files-width: v-bind(gridSize);
  --image-size: v-bind(imageSize);
  --card-direction: v-bind(cardDirection);
  flex-grow: 1;
  display: grid;
  grid-template-columns: var(--left-pane-size) 1fr 60px;
  grid-template-rows: 1fr;
  &>section{
    padding: 0 .35em;
    overflow: visible;
  }
  &>section:first-child{
    border-right: 1px solid rgba(128, 128, 128, 0.2);
  }
  &>section:last-child{
    border-left: 1px solid rgba(128, 128, 128, 0.2);
  }
  .panes-sticky{
    position: sticky;
    top: 92px;
  }
}

.folder-grid{
  display: grid;
  grid-template-columns: repeat( auto-fit, minmax(var(--files-width), 1fr));
  gap: 10px;
  margin-top: -75px;
  padding-top: 75px;
  margin-bottom: .5em;
}

.files-grid{
  margin-top: -75px;
  padding-top: 75px;
  display: grid;
  grid-template-columns: repeat( auto-fit, minmax(var(--files-width), 1fr));
  gap: 10px;
  .file-container {
    // container-type: inline-size;
  }
}


.context-wrapper{
  position: fixed;
  display: flex;
  width: 100%;
  justify-content: center;
  bottom: 0;
  font-size: 14px;
  padding: .5em;
  pointer-events: none;
  .tab{
    background-color: rgba(var(--bs-primary), 0.315);
    backdrop-filter: blur(20px);
    padding: .25em 1em;
    border-radius: 50px;
    border: 1px solid rgba(128, 128, 128, 0.2);
    transform: translateY(5em);
    transition: all .3s ease;
    box-shadow: 0px 2px 4px rgba(0,0,0,4);

  }
  .tab.active{
    transform: translateY(0em);
  }
}

.list-move, /* apply transition to moving elements */
.list-enter-active{
  transition: all 0.3s ease;
}
.list-leave-active {
  // transition: all 0.2s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
  opacity: 0;
  transform: translate(-50%, 50%);
}
</style>