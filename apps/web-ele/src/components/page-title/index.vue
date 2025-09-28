<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
});
</script>
<template>
  <div class="flex items-center justify-between gap-2 pb-3 pt-3">
    <div class="flex items-center gap-2">
      <div class="bg-primary h-2.5 w-1 rounded-md"></div>
      {{ props.title }}
    </div>
    <slot name="rightOption"></slot>
  </div>
</template>
