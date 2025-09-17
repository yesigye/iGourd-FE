<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary">
          {{ t('sale.addSaleRefundOrder') }}
        </ElButton>
        <ElButton type="default">
          {{ t('sale.export') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #operation="{ row }">
        <ElButton type="text">
          {{ t('common.detail') }}
        </ElButton>
        <ElButton
          v-if="row.status === 'PENDING'"
          type="text"
          @click="handleEdit(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton
          type="text"
        >
          {{ t('sale.print') }}
        </ElButton>
        <ElButton
          v-if="row.status === 'PENDING'"
          type="text"
        >
          {{ t('sale.cancelRefund') }}
        </ElButton>
        <ElButton
          v-if="['PENDING', 'PROCESSING'].includes(row.status)"
          type="text"
          @click="handleBatchDelete(row)"
        >
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

import { useSaleRefundOrder } from '@@/sale/hooks';

defineOptions({
  name: 'ISaleRefundOrder',
});

const { t } = useI18n();

const {
  Grid,
  Drawer,
  handleEdit,
  handleBatchDelete,
  canBatchOperate,
} = useSaleRefundOrder();
</script>
