<script setup lang="ts">
import { watch } from 'vue';

import { useSettingCodeRulesDrawerSkuForm } from '../hooks/setting-code-rules-drawer-sku-form';

const props = defineProps({
  index: {
    type: Number,
    default: 1,
  },
});
const emit = defineEmits(['update:itemData']);
const { Form: SkuForm, rulesItemData } = useSettingCodeRulesDrawerSkuForm(
  props.index,
);
watch(rulesItemData, (val) => {
  emit('update:itemData', { value: val, index: props.index });
});
</script>

<template>
  <section>
    <SkuForm />
  </section>
</template>
