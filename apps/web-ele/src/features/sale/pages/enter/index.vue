<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleAdd">
          {{ t('sale.addSaleEnter') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          :disabled="!selectedRows.length"
          @click="handleBatchDeleteEnter"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      
      <template #operation="{ row }">
        <ElButton type="text" @click="handleDetail(row)">
          {{ t('common.detail') }}
        </ElButton>
        <ElButton 
          v-if="row.status === 'DRAFT'"
          type="text"
          @click="handleEditEnter(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton 
          v-if="row.status === 'DRAFT'"
          type="text"
          @click="handleConfirm(row)"
        >
          {{ t('sale.confirm') }}
        </ElButton>
        <ElButton 
          v-if="['DRAFT', 'CONFIRMED'].includes(row.status)"
          type="text"
          @click="handleDelete(row)"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>
    
    <EnterDrawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useSaleEnter } from '@@/sale/hooks';

defineOptions({
  name: 'ISaleEnter',
});

const { t } = useI18n();

const {
  Grid,
  EnterDrawer,
  selectedRows,
  handleAdd,
  handleEditEnter,
  handleDetail,
  handleDelete,
  handleBatchDeleteEnter,
  canBatchOperate,
  refresh,
} = useSaleEnter();

// 处理确认
const handleConfirm = (row: any) => {
  // 这里可以添加确认逻辑
  console.log('确认销售录入:', row);
};
</script>
