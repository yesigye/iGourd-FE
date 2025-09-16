<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('purchase.addPurchaseOrder') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          :disabled="!selectedRows.length"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.detail') }}
        </ElButton>
        <ElButton
          v-if="row.status === 'DRAFT'"
          type="text"
          @click="handleEdit(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton v-if="row.status === 'DRAFT'" type="text">
          {{ t('purchase.submitAudit') }}
        </ElButton>
        <ElButton v-if="row.status === 'PENDING'" type="text">
          {{ t('purchase.approve') }}
        </ElButton>
        <ElButton v-if="row.status === 'APPROVED'" type="text">
          {{ t('purchase.settle') }}
        </ElButton>
        <ElButton v-if="['DRAFT', 'PENDING'].includes(row.status)" type="text">
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { usePurchaseOrder } from '@@/purchase/hooks';

defineOptions({
  name: 'IPurchaseOrder',
});

const { t } = useI18n();

const {
  Grid,
  Drawer,
  selectedRows,
  canBatchOperate,
  handleEdit,
  handleBatchDelete,
} = usePurchaseOrder();
</script>
