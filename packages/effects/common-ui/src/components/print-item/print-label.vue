<script setup lang="ts">
const props = defineProps({
  itemStyle: {
    type: Object,
    default: () => {
      return {};
    },
  },
  value: {
    type: String,
    default: '',
  },
});
</script>
<template>
  <p class="print-label" :style="props.itemStyle">{{ props.value }}</p>
</template>
<style>
.print-label {
  font-size: 18px;
}
</style>
