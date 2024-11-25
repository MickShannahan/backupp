<script setup>
import { ref } from 'vue';
import {File} from '../models/File.js'

const {file, selected} = defineProps({file: File, selected: Boolean})
const emitter = defineEmits(['selected'])

function selectFile(){
emitter('selected', file)
}

</script>


<template>
<div @click="selectFile" class="card file-card" :class="{selected}">
    <img loading="lazy" class="blur-bg" :src="file.thumbnail?.url" alt="">
    <img :width="file?.width" :height="file?.height" loading="lazy" :src="file.thumbnail?.url" alt="">
    <div class="card-body">
      <div>{{ file.name }}</div>
      <div>
        <small>{{ file.dateShort }}</small> <i class="mdi mdi-circle-small"></i>
        <small>{{( file.size /1024 /1024).toFixed(2) }}mb</small>
      </div>
    </div>
    <input v-if="selected" :checked="selected" class="select-box" type="checkbox">
  </div>
</template>


<style lang="scss" scoped>
@container (width > 375px){
  .card{
    flex-direction: row;
    justify-content: flex-start
  }
  .card>img:not(.blur-bg){
    width: 25%!important;
  }
  .card>.card-body{
    width: 75%;
  }
}

.card{
  height: 100%;
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(128, 128, 128, 0.2);
  font-size: 14px;
  &:hover{
    filter: brightness(1.1);
    transition: filter .15s ease;
    cursor: pointer;
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
    transform: scale(1.25);
  }

  &.selected{
    outline: 2px solid blueviolet;
    outline-offset: -1px;
    box-shadow: inset 0px 0px 15px rgba(137, 43, 226, 0.5);
  }
}
</style>