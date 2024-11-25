<script setup>
defineProps({
  show:{type: Boolean, default: false}
  })
</script>


<template>
   <button class="btn selectable-primary "><i class="mdi mdi-select-all"></i></button>
   <button v-if="show" class="btn selectable-blue "><i class="mdi mdi-download"></i></button>
  <button v-if="show" class="btn selectable-red text-red"> <i class="mdi mdi-delete-forever"></i></button>
</template>


<style lang="scss" scoped>
button{
  width: 100%;
  font-size: 20px;
  margin-bottom: .25em;
}
</style>