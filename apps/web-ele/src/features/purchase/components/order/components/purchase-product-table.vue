<template>
  <ProductTable
    v-model:product-list="localList"
    :vat-configuration="vatConfiguration"
    type="purchase"
    @calculations-updated="onCalcs"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ProductTable } from '#/components';

const props = withDefaults(
  defineProps<{
    /** Formily passes `value` for x-component bound field */
    value?: any[];
    /** update handler for Formily */
    onChange?: (v: any[]) => void;
    /** totals callback to parent/form */
    onCalculations?: (c: any) => void;
    /** passthrough */
    vatConfiguration?: string;
  }>(),
  { value: () => [] },
);

const emit = defineEmits<{ (e: 'change', v: any[]): void }>();

const localList = ref<any[]>(props.value || []);

watch(
  () => props.value,
  (v) => {
    if (v !== localList.value) localList.value = (v || []).slice();
  },
  { immediate: true, deep: true },
);
watch(
  localList,
  (v) => {
    props.onChange?.(v);
    emit('change', v);
  },
  { deep: true },
);

function onCalcs(c: any) {
  props.onCalculations?.(c);
}
</script>
