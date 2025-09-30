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
  elementData: {
    type: Object,
    default: () => {},
  },
});
</script>
<template>
  <p :style="props.itemStyle">{{ props.value }}</p>
</template>
<style scoped>
p {
  font-size: 24px;
}
</style>
