<script setup>
  const {id} = defineProps({id: {type: String, default: 'no-id'}})
</script>


<template>
<div class="modal fade" :id>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-body">
        <slot>
          No body provided
        </slot>
      </div>
    </div>
  </div>
</div>
</template>


<style lang="scss" scoped>

</style>