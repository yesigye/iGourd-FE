<script lang="ts" setup>
import { ref, watch } from 'vue';

import { ElRadio } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

const props = defineProps({
  tree: {
    type: Array,
    default: () => [],
  },
  defaultValue: {
    type: String,
    default: 'PURCHASE',
  },
});
const emits = defineEmits(['change']);
const { t } = useI18n();
const radio = ref('PURCHASE');
const handleChange = (val: string) => {
  radio.value = val;
  emits('change', val);
};

watch(
  () => props.defaultValue,
  (val) => {
    radio.value = val;
  },
);
</script>
<template>
  <section class="bg-card mr-1 h-full rounded p-1 pb-2.5 pl-1 pr-1 pt-2.5">
    <div class="text-sm font-bold">{{ t('code-rules.category-tree') }}</div>
    <div>
      <div
        class="pb-1.5 pl-2.5 pr-1.5 pt-1.5"
        v-for="item in props.tree"
        :key="item.tree_type"
      >
        <ElRadio :value="item.tree_type" v-model="radio" @change="handleChange">
          {{ t(`code-rules.${item.tree_type.toLowerCase()}`) }}
        </ElRadio>
      </div>
    </div>
  </section>
</template>
