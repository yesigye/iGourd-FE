<script setup>
import { onMounted, ref, watch } from 'vue';

import JsBarcode from 'jsbarcode';

const props = defineProps({
  itemStyle: {
    type: Object,
    default: () => {
      return {};
    },
  },
  value: {
    type: String,
    default: '1234567890',
  },
  format: {
    type: String,
    default: 'CODE128',
  },
  width: {
    type: Number,
    default: 2,
  },
  height: {
    type: Number,
    default: 100,
  },
  displayValue: {
    type: Boolean,
    default: true,
  },
  fontOptions: {
    type: String,
    default: '',
  },
  font: {
    type: String,
    default: 'monospace',
  },
  textAlign: {
    type: String,
    default: 'center',
  },
  textPosition: {
    type: String,
    default: 'bottom',
  },
  textMargin: {
    type: Number,
    default: 2,
  },
  fontSize: {
    type: Number,
    default: 20,
  },
  background: {
    type: String,
    default: '#ffffff',
  },
  lineColor: {
    type: String,
    default: '#000000',
  },
  margin: {
    type: Number,
    default: 10,
  },
});

const barcodeRef = ref(null);

// 生成条形码的函数
const generateBarcode = () => {
  if (barcodeRef.value && props.value) {
    try {
      JsBarcode(barcodeRef.value, props.value, {
        format: props.format,
        width: 2,
        height: 40,
        displayValue: props.displayValue,
        fontOptions: props.fontOptions,
        font: props.font,
        textAlign: props.textAlign,
        textPosition: props.textPosition,
        textMargin: props.textMargin,
        fontSize: props.fontSize,
        background: props.background,
        lineColor: props.lineColor,
        margin: props.margin,
      });
    } catch (error) {
      console.error('条形码生成失败:', error);
    }
  }
};

// 组件挂载后生成条形码
onMounted(() => {
  generateBarcode();
});

// 监听 value 属性变化，重新生成条形码
watch(
  () => props.value,
  () => {
    generateBarcode();
  },
);
</script>

<template>
  <div :style="props.itemStyle">
    <svg ref="barcodeRef" />
  </div>
</template>

<style scoped>
svg {
  max-width: 100%;
}
</style>
