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
  <section
    class="print-rich-text"
    style="word-break: break-all"
    v-html="props.value"
  ></section>
</template>
