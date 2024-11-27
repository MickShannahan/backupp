<script setup>
import {  ref } from 'vue';
const emit = defineEmits(['search'])
const searchTerm = ref('')
function search(){
  emit('search', searchTerm.value)
}

</script>


<template>
  <section >
    <div class="form-floating">
      <input @change="search" v-model="searchTerm" class="border-0 form-control" type="text"  id="floatingInput" placeholder="name@example.com">
      <label for="floatingInput">Search</label>
      <kbd class="text-light bg-black bg-opacity-20">ctrl+k</kbd>
    </div>
  </section>
</template>


<style lang="scss" scoped>
section{
  display: grid;
  place-content: center;
}

input{
  background-color: rgba(var(--bs-black-rgb), .1);
}

.form-floating{
  position: relative;

  kbd{
    position: absolute;
    right: 2%;
    top: 25%;
    bottom: 25%;
    // margin-top: -50%;
  }
}
</style>