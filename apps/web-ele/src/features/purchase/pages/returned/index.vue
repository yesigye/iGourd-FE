<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleAdd">
          {{ t('purchase.addPurchaseReturned') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          :disabled="!selectedRows.length"
          @click="handleBatchDeleteReturned"
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
          @click="handleEditReturned(row)"
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
    
    <ReturnedDrawer @success="refresh" />
    <AuditDrawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { usePurchaseReturned } from '@@/purchase/hooks';

defineOptions({
  name: 'IPurchaseReturned',
});

const { t } = useI18n();

const {
  Grid,
  ReturnedDrawer,
  AuditDrawer,
  selectedRows,
  handleAdd,
  handleEditReturned,
  handleDetail,
  handleAudit,
  handleDelete,
  handleBatchDeleteReturned,
  canBatchOperate,
  refresh,
} = usePurchaseReturned();
</script>
