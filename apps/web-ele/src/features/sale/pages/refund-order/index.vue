<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useSaleRefundOrder } from '@@/sale/hooks';

defineOptions({
  name: 'ISaleRefundOrder',
});

const { t } = useI18n();

const { Grid, Drawer, handleEdit, handleBatchDelete, canBatchOperate } =
  useSaleRefundOrder();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="danger" v-if="canBatchOperate">
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #operation="{ row }">
        <ElButton type="text">
          {{ t('common.detail') }}
        </ElButton>

        <ElButton type="text">
          {{ t('sale.print') }}
        </ElButton>
        <ElButton :disabled="row.status != 'PENDING'" type="text">
          {{ t('common.cancel') }}
        </ElButton>
        <ElButton
          :disabled="row.status != 'PENDING'"
          type="text"
          @click="handleBatchDelete(row)"
        >
          {{ t('common.refund') }}
        </ElButton>
      </template>
    </Grid>

    <Drawer />
  </Page>
</template>
