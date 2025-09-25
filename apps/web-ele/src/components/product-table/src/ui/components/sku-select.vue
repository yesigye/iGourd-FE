<script setup lang="ts">
import type { Sku } from '../../types';

import { computed, inject, unref } from 'vue';

import {
  ElOption,
  ElSelect,
  useField,
  useForm,
  useIndex,
  useRecord,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

const field = useField();
const form = useForm() as any;
const { t } = useI18n();

function useRow() {
  const addr: any = field.value?.address;
  const segs = addr?.segments || [];
  const idx = unref(useIndex());
  const tableName = segs[0];
  const row = unref(useRecord());
  return { index: idx, tableName, row };
}

const ctx = inject<any>('ptCtx', { services: {} });
const { index, tableName, row } = useRow();

const modelValue = computed<any>({
  get() {
    return row?.sku_id ?? null;
  },
  set() {},
});

const options = computed<Sku[]>(() => {
  const raw = (row as any)?._skuOptions;
  return Array.isArray(raw) ? raw : [];
});

async function ensureOptions() {
  if (options.value.length > 0) return;
  if (!row?.product_id) return;
  if (!ctx.value?.services?.listSkusByProduct) return;
  try {
    const skus = await ctx.value.services.listSkusByProduct(
      row.product_id,
      ctx.value,
    );
    if (Array.isArray(skus)) {
      const next = { ...row, _skuOptions: skus };
      form.setValuesIn(`${tableName}.${index}`, next);
    }
  } catch {}
}

async function onChange(val: any) {
  const next = { ...row, sku_id: val };
  // stock refresh if needed
  if (
    ctx.value?.capabilities?.includes('stock') &&
    ctx.value?.services?.fetchStockBySku
  ) {
    try {
      const stock = await ctx.value.services.fetchStockBySku(val, ctx.value);
      if (stock) next.stock_available = stock.available ?? null;
    } catch {}
  }
  form.setValuesIn(`${tableName}.${index}`, next);
}
</script>

<template>
  <ElSelect
    :model-value="modelValue"
    :placeholder="t?.('purchase.selectSku') ?? '选择 SKU'"
    :disabled="!row.product_id"
    filterable
    @visible-change="(v) => v && ensureOptions()"
    @change="onChange"
    style="width: 100%"
  >
    <ElOption
      v-for="opt in options"
      :key="opt.id"
      :label="opt.name || opt.id"
      :value="opt.id"
    />
  </ElSelect>
</template>
