<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { usePurchaseReceipt } from '../../hooks/receipt/list';

defineOptions({
  name: 'IPurchaseReceipt',
});

const { t } = useI18n();

const { Grid, Drawer, handleEdit, handleBatchDelete, canBatchOperate } =
  usePurchaseReceipt();
</script>

<template>
  <Page auto-content-height>
    <Grid>
    <template #table-actions>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('common.add') }}
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
        <ElButton type="text" @click="handleBatchDelete(row)">
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>

    <Drawer />
  </Page>
</template>
