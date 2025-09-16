<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleAdd">
          {{ t('sale.addSaleRefundOrder') }}
        </ElButton>
        <ElButton type="default" @click="handleExport">
          {{ t('sale.export') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          :disabled="!selectedRows.length"
          @click="handleBatchDeleteRefundOrder"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      
      <template #operation="{ row }">
        <ElButton type="text" @click="handleDetail(row)">
          {{ t('common.detail') }}
        </ElButton>
        <ElButton 
          v-if="row.status === 'PENDING'"
          type="text"
          @click="handleEditRefundOrder(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton 
          type="text"
          @click="handlePrint(row)"
        >
          {{ t('sale.print') }}
        </ElButton>
        <ElButton 
          v-if="row.status === 'PENDING'"
          type="text"
          @click="handleCancelRefund(row)"
        >
          {{ t('sale.cancelRefund') }}
        </ElButton>
        <ElButton 
          v-if="['PENDING', 'PROCESSING'].includes(row.status)"
          type="text"
          @click="handleDelete(row)"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>
    
    <RefundOrderDrawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useSaleRefundOrder } from '@@/sale/hooks';

defineOptions({
  name: 'ISaleRefundOrder',
});

const { t } = useI18n();

const {
  Grid,
  RefundOrderDrawer,
  selectedRows,
  handleAdd,
  handleEditRefundOrder,
  handleDetail,
  handleCancelRefund,
  handlePrint,
  handleExport,
  handleDelete,
  handleBatchDeleteRefundOrder,
  canBatchOperate,
  refresh,
} = useSaleRefundOrder();
</script>
