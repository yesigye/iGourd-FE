<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleAdd">
          {{ t('purchase.addPurchaseReceipt') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          :disabled="!selectedRows.length"
          @click="handleBatchDeleteReceipt"
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
          @click="handleEditReceipt(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton 
          v-if="row.status === 'DRAFT'"
          type="text"
          @click="handleAudit(row, 'PENDING')"
        >
          {{ t('purchase.submitAudit') }}
        </ElButton>
        <ElButton 
          v-if="row.status === 'PENDING'"
          type="text"
          @click="handleAudit(row, 'APPROVED')"
        >
          {{ t('purchase.approve') }}
        </ElButton>
        <ElButton 
          v-if="['DRAFT', 'PENDING'].includes(row.status)"
          type="text"
          @click="handleDelete(row)"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>
    
    <ReceiptDrawer @success="refresh" />
    <AuditDrawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { usePurchaseReceipt } from '@@/purchase/hooks';

defineOptions({
  name: 'IPurchaseReceipt',
});

const { t } = useI18n();

const {
  Grid,
  ReceiptDrawer,
  AuditDrawer,
  selectedRows,
  handleAdd,
  handleEditReceipt,
  handleDetail,
  handleAudit,
  handleDelete,
  handleBatchDeleteReceipt,
  canBatchOperate,
  refresh,
} = usePurchaseReceipt();
</script>
