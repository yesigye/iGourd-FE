<script setup>
import { computed } from 'vue';

const props = defineProps({
  itemStyle: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const borderCount = computed(() => {
  return props.itemStyle?.borderCount ?? 1;
});
</script>
<template>
  <div class="print-divider-box flex items-center">
    <div class="w-full">
      <div
        v-for="item in borderCount"
        :key="item"
        class="print-divider"
        :style="{
          borderBottom: `1px ${
            props.itemStyle?.border ? props.itemStyle.border : 'dashed'
          } #000`,
        }"
      ></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.print-divider-box {
  width: 100%;

  .print-divider {
    width: 100%;

    // border-bottom: 1px dashed #000;
    margin: 8px 0;
  }
}
</style>
