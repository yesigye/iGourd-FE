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
  <div :style="{ textAlign: props.itemStyle.textAlign }">
    <img
      :src="
        props.elementData?.option?.value ? props.elementData.option?.value : ''
      "
      alt=""
      class="print-image"
    />
  </div>
</template>
<style>
.print-image {
  display: inline;
  width: 78px;
}
</style>
