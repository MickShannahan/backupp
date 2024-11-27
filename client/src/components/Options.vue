<script setup>
defineProps({
  show:{type: Boolean, default: false},
  selection: Array,
  })
defineEmits(['delete', 'clicked', 'download', 'selectAll', 'changeLayout'])
</script>


<template>
  <section class="d-flex flex-column gap-1">
    <div class="d-flex justify-content-center mb-1">
      <span class="badge text-bg-primary">{{ selection.length }}</span>
    </div>
    <button @click="$emit('selectAll')" class="btn selectable-primary "><i class="mdi mdi-select-all"></i></button>
    <button :disabled="!show" @click="$emit('download')" class="btn selectable-blue "><i class="mdi mdi-download"></i></button>
    <button :disabled="!show" @click="$emit('delete')" class="btn selectable-red text-red"> <i class="mdi mdi-delete-forever"></i></button>
    <div class="dropstart">
      <button type="button" class="btn selectable-primary" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="mdi mdi-grid"></i>
      </button>
      <ul class="dropdown-menu bg-glass">
        <li><button @click="$emit('changeLayout', 'column')" class="btn selectable-blue">columns <i class="mdi mdi-format-columns"></i></button></li>
        <li><button @click="$emit('changeLayout', 'list')" class="btn selectable-blue">list <i class="mdi mdi-view-list"></i></button></li>
        <li><button @click="$emit('changeLayout', 'grid')" class="btn selectable-blue">grid <i class="mdi mdi-grid"></i></button></li>
        <li><button @click="$emit('changeLayout', 'grid-large')" class="btn selectable-blue">grid large <i class="mdi mdi-grid-large"></i></button></li>
        <li><button @click="$emit('changeLayout', 'grid-xl')" class="btn selectable-blue">grid xl <i class="mdi mdi-square-outline"></i></button></li>
      </ul>
    </div>

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

.dropdown-menu button{
  font-size: 14px;
}
</style>