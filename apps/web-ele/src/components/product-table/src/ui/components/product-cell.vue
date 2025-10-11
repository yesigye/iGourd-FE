<!-- ui/components/ProductSelect.vue -->
<script setup lang="ts">
import type { Product } from '../../types';

import { inject, ref } from 'vue';

import { useRecord } from '@igourd/common-ui';
import { omit } from '@igourd/utils';

import { ElOption, ElSelect } from 'element-plus';

const props = withDefaults(defineProps<{ modelValue?: string }>(), {
  modelValue: '',
});
const emits = defineEmits(['change']);

const ctx = inject<any>('ptCtx', { services: {} });
const options = ref<Product[]>([]);
const loading = ref(false);
const row = useRecord();
async function onSearch(keyword: string) {
  if (!ctx?.services?.searchProducts) return;
  loading.value = true;
  try {
    const list = await ctx.services.searchProducts(keyword, ctx);
    options.value = Array.isArray(list) ? list : [];
  } finally {
    loading.value = false;
  }
}

async function onChange(productId: any) {
  const p = options.value.find((o) => o.id === productId);
  if (!p) return;
  Object.assign(row.value, omit(p, 'id'));
  emits('change', p.id);
}
</script>

<template>
  <ElSelect
    :model-value="props.modelValue"
    filterable
    remote
    :remote-method="onSearch"
    :loading="loading"
    placeholder="选择商品"
    style="width: 100%"
    @change="onChange"
  >
    <ElOption
      v-for="p in options"
      :key="p.id"
      :label="p.label"
      :value="p.value"
    />
  </ElSelect>
</template>
