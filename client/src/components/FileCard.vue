<script setup>
import { ref } from 'vue';
import {File} from '../models/File.js'

const loaded = ref(false)

const {file, selected} = defineProps({file: File, selected: Boolean})
const emitter = defineEmits(['selected'])

function selectFile(){
emitter('selected', file)
}

</script>


<template>
<div @click="selectFile" class="card" :class="{selected, 'file-card': loaded}">
    <img @load="loaded = true" loading="lazy" class="blur-bg" :src="file.thumbnail?.url" alt="">
    <img :width="file?.width" :height="file?.height" loading="lazy" :src="file.thumbnail?.url" alt="">
    <div class="card-body">
      <div>{{ file.name }}</div>
      <div>
        <small>{{ file.dateShort }}</small> <i class="mdi mdi-circle-small"></i>
        <small>{{( file.size /1024 /1024).toFixed(2) }}mb</small>
        <a title="open source file" :href="file.url" target="_blank" class="btn btn-small original-button selectable-primary"><i class="mdi mdi-file-export"></i></a>
      </div>
    </div>
    <span v-if="selected" class="select-box"><i class="mdi mdi-checkbox-marked  fs-5"></i></span>
  </div>
</template>


<style lang="scss" scoped>

.card:hover .original-button{
    opacity: .9;
}
.original-button{
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: all .3s .3s ease;
}

.card.file-card{
  animation: show-card .3s ease forwards;
}

.card{
  height: 100%;
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(128, 128, 128, 0.2);
  font-size: 14px;
  opacity: .25;
  &:hover{
    filter: brightness(1.1);
    transition: filter .15s ease;
    cursor: pointer;
    box-shadow: 0px 2px 4px rgba(var(--bs-black-rgb), .4);
  }
  .blur-bg{
    position: absolute;
    width: 110%;
    height: 110%;
    left: -5%;
    top: -5%;
    object-fit: cover;
    object-position: center;
    filter: blur(30px) brightness(.7) contrast(.8);
    opacity: .6;
  }
  img{
    width: 100%;
    object-fit: contain;
    height: calc(var(--files-width) * .55);
    position: relative;
    user-select: none;
}

  .select-box{
    position: absolute;
    top: .25em;
    right: .25em;
    font-size: 16px;
    display: grid;
    place-content: center;
  }
  .mdi-checkbox-marked{
    background-color: var(--bs-primary);
    height: 20px;
    line-height: 19px;
    border-radius: 3px;
  }

  &.selected{
    outline: 2px solid var(--bs-primary);
    outline-offset: -1px;
    box-shadow: inset 0px 0px 15px rgba(var(--bs-primary-rgb), 0.5);
  }
}

@keyframes show-card{
  from{
    opacity: .25;
    transform: translateY(10px);
  }
to{
  opacity: 1;
  transform: translateY(0px);
}
}
</style>