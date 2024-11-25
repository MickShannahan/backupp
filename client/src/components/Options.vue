<script setup>
defineProps({
  show:{type: Boolean, default: false},
  selection: Array,
  })
defineEmits(['delete', 'clicked', 'download', 'selectAll'])
</script>


<template>
  <section class="d-flex flex-column gap-1">
    <div class="d-flex justify-content-center mb-1">
      <span class="badge text-bg-primary">{{ selection.length }}</span>
    </div>
    <button @click="$emit('selectAll')" class="btn selectable-primary "><i class="mdi mdi-select-all"></i></button>
    <button :disabled="!show" @click="$emit('download')" class="btn selectable-blue "><i class="mdi mdi-download"></i></button>
    <button :disabled="!show" @click="$emit('delete')" class="btn selectable-red text-red"> <i class="mdi mdi-delete-forever"></i></button>
  </section>
</template>


<style lang="scss" scoped>
button{
  width: 100%;
  font-size: 20px;
  border: 0;
  &:disabled{
    border: 0;
    opacity: .4;
  }
}
</style>