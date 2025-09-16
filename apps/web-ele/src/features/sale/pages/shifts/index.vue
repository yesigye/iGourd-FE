<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleAdd">
          {{ t('sale.addSaleShifts') }}
        </ElButton>
        <ElButton type="default" @click="handleExport">
          {{ t('sale.export') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          :disabled="!selectedRows.length"
          @click="handleBatchDeleteShifts"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      
      <template #operation="{ row }">
        <ElButton type="text" @click="handleDetail(row)">
          {{ t('common.detail') }}
        </ElButton>
        <ElButton 
          v-if="row.status === 'ACTIVE'"
          type="text"
          @click="handleEditShifts(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton 
          v-if="row.status === 'ACTIVE'"
          type="text"
          @click="handleEndShift(row)"
        >
          {{ t('sale.endShift') }}
        </ElButton>
        <ElButton 
          v-if="row.status === 'COMPLETED'"
          type="text"
          @click="handleStartShift(row)"
        >
          {{ t('sale.startShift') }}
        </ElButton>
        <ElButton 
          v-if="['ACTIVE', 'COMPLETED'].includes(row.status)"
          type="text"
          @click="handleDelete(row)"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>
    
    <ShiftsDrawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useSaleShifts } from '@@/sale/hooks';

defineOptions({
  name: 'ISaleShifts',
});

const { t } = useI18n();

const {
  Grid,
  ShiftsDrawer,
  selectedRows,
  handleAdd,
  handleEditShifts,
  handleDetail,
  handleStartShift,
  handleEndShift,
  handleExport,
  handleDelete,
  handleBatchDeleteShifts,
  canBatchOperate,
  refresh,
} = useSaleShifts();
</script>
