<script setup lang="ts">
import { defineEmits, ref, watchPostEffect } from 'vue';

import { fontSizeList } from '@igourd/utils';

import SelectDropdown from '../select-dropdown/index.vue';

const props = defineProps({
  fontSize: {
    type: Number,
    default: 14,
  },
});

const emit = defineEmits(['change']);
const fontSz = ref(props.fontSize);

const onFontChange = (item: { value: number }) => {
  fontSz.value = item.value;
};

watchPostEffect(() => {
  emit('change', fontSz.value);
});
</script>
<template>
  <SelectDropdown
    :options="fontSizeList.map((it) => ({ label: it, value: it }))"
    @change="onFontChange"
  >
    <slot></slot>&nbsp;{{ fontSz }} px
  </SelectDropdown>
</template>
