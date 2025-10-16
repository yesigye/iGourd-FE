<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  borderBottom: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <div class="flex items-center justify-between gap-2 pb-3 pt-3">
    <div
      class="flex w-full items-center gap-2"
      :class="{ 'border-gray border-b border-solid': props.borderBottom }"
    >
      <div class="bg-primary h-2.5 w-1 rounded-md"></div>
      {{ props.title }}
    </div>
    <slot name="rightOption"></slot>
  </div>
</template>
