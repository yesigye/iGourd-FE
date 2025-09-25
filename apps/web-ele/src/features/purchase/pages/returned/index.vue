<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { usePurchaseReturned } from '@@/purchase/hooks';

defineOptions({
  name: 'IPurchaseReturned',
});

const { t } = useI18n();

const { Grid, Drawer, handleEdit, handleBatchDelete, canBatchOperate } =
  usePurchaseReturned();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('returned.add-purchase-returned') }}
        </ElButton>
        <ElButton type="danger" v-if="canBatchOperate">
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
        <ElButton
          v-if="['DRAFT', 'PENDING'].includes(row.status)"
          type="text"
          @click="handleBatchDelete()"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>

    <Drawer />
  </Page>
</template>
