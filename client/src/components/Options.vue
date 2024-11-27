<script setup>
defineProps({
  show:{type: Boolean, default: false},
  selection: Array,
  })
defineEmits(['delete', 'clicked', 'download', 'selectAll', 'changeLayout', 'sortBy'])
</script>


<template>
  <section class="d-flex flex-column gap-1">
    <div class="d-flex justify-content-center mb-1">
      <span class="badge text-bg-primary">{{ selection.length }}</span>
    </div>
    <button title="Select all (double click to de-select all)" @click="$emit('selectAll')" class="btn selectable-primary "><i class="mdi mdi-select-all"></i></button>
    <button title="Download Selection" :disabled="!show" @click="$emit('download')" class="btn selectable-blue "><i class="mdi mdi-download"></i></button>
    <button title="Delete Selection" :disabled="!show" @click="$emit('delete')" class="btn selectable-red text-red"> <i class="mdi mdi-delete-forever"></i></button>
    <div class="dropstart">
      <button title="View Options" type="button" class="btn selectable-primary" data-bs-toggle="dropdown" aria-expanded="false">
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
    <div class="dropstart">
      <button title="Sort Options" type="button" class="btn selectable-primary" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="mdi mdi-sort"></i>
      </button>
      <ul class="dropdown-menu bg-glass">
        <li><button @click="$emit('sortBy', 'new-old')" class="btn selectable-blue"> <i class="mdi mdi-sort-clock-descending">
        </i> new - old</button></li>
        <li><button @click="$emit('sortBy', 'old-new')" class="btn selectable-blue"><i class="mdi mdi-sort-clock-ascending">
        </i> old - new </button></li>
        <li><button @click="$emit('sortBy', 'sm-lg')" class="btn selectable-blue"><i class="mdi mdi-sort-bool-ascending"></i> small - large</button>
        </li>
        <li><button @click="$emit('sortBy', 'lg-sm')" class="btn selectable-blue"> <i class="mdi mdi-sort-bool-descending"></i> large - small</button>
        </li>
        <li><button @click="$emit('sortBy', 'a-z')" class="btn selectable-blue"><i class="mdi mdi-sort-alphabetical-ascending"></i> a - z</button>
        </li>
        <li><button @click="$emit('sortBy', 'z-a')" class="btn selectable-blue">
          <i class="mdi mdi-sort-alphabetical-descending"></i> z - a</button>
        </li>
  
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