<script setup lang="ts">
import { ElInputNumber } from '@igourd/common-ui';

const props = defineProps<{ modelValue: number | string }>();
const emits = defineEmits(['update:modelValue']);

function handleChange(val: number | undefined) {
  emits('update:modelValue', val);
  // 金额计算现在由 Effect 系统自动处理，无需手动调用
}
</script>

<template>
  <ElInputNumber
    class="input-number-control"
    :model-value="props.modelValue"
    @change="handleChange"
    :controls="false"
  />
</template>
