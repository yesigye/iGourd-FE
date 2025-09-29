<template>
  <p :style="props.itemStyle">{{ props.value }}</p>
</template>
<script setup lang="ts">
const props = defineProps({
  itemStyle: {
    type: Object,
    default: () => {
      return {}
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
})
</script>
<style scoped>
p {
  font-size: 24px;
}
</style>
