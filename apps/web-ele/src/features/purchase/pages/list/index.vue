<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { usePurchaseList } from '@@/purchase/hooks';

defineOptions({
  name: 'IPurchaseList',
});

const { t } = useI18n();
const { Grid, Drawer, handleEdit, canBatchOperate, handleBatchDelete } =
  usePurchaseList();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('purchase.addPurchase') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.detail') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
