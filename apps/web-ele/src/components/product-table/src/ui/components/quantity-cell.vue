<script setup lang="ts">
import { inject } from 'vue';

import { ElInputNumber, useRecord } from '@igourd/common-ui';

import { getMode } from '../../core/registry';

const props = defineProps<{ modelValue: number | string }>();
const emits = defineEmits(['update:modelValue']);
const ctx = inject<any>('ptCtx', { services: {} });
const mode = getMode(ctx.mode);
const record = useRecord();

function handleChange(val: number | undefined) {
  emits('update:modelValue', val);
  record.value.total_amount = mode!.quantityBridge!.getTotalAmount?.(
    val ?? 0,
    record.value,
    ctx,
  );
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
