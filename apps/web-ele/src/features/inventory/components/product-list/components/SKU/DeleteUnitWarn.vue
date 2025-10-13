<script setup>
import { useI18n } from 'vue-i18n';

import { ElIcon, ElTable, ElTableColumn } from '@igourd/common-ui';

import { deleteUnitTableConfig } from './sku.config';

const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
});
const { t } = useI18n();
</script>
<template>
  <section class="flex items-start gap-2">
    <ElIcon color="#e6a23c" class="mt-1" size="16px">
      <WarningFilled />
    </ElIcon>
    <div class="text-slate-gray">
      <p class="">{{ t('inventory.save_major_unit_delete_tips') }}</p>
      <p class="text-watermelon">
        {{ t('inventory.save_major_unit_delete_error') }}
      </p>
      <div class="mt-2">
        <ElTable
          :data="props.tableData"
          :header-cell-style="{
            background: '#F6F8FC',
            color: '#323232',
            height: '30px',
          }"
          class="w-full"
          :height="360"
        >
          <ElTableColumn
            v-for="item in deleteUnitTableConfig"
            :key="item.prop"
            :prop="item.prop"
            :label="t(item.label)"
          />
        </ElTable>
      </div>
    </div>
  </section>
</template>
<style>
.deleteGoodList {
  max-height: 400px;
}
</style>
