<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { ElInput } from '@igourd/common-ui';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  row: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['change', 'addWarehouse', 'update:modelValue']);
const profitPatevalue = ref('');
// 监听 props 中的 modelValue 变化，更新本地值
watch(
  () => props.modelValue,
  (newValue) => {
    profitPatevalue.value = newValue;
  },
  { immediate: true },
);
// 监听本地值变化，通知父组件
watch(
  () => profitPatevalue.value,
  (newValue) => {
    emit('update:modelValue', newValue);
  },
);

const changeWarehouse = (val: any) => {
  emit('change', val);
};

onMounted(() => {
  // 初始化本地值
  if (props.row?.selling_price != '' && props.row?.cost_price != '') {
    const profitRate =
      ((props.row?.selling_price - props.row?.cost_price) /
        props.row?.selling_price) *
      100;
    profitPatevalue.value = profitRate.toFixed(2);
  }
});
</script>
<template>
  <ElInput v-model="profitPatevalue" placeholder="" @change="changeWarehouse">
    <template #suffix> % </template>
  </ElInput>
</template>
