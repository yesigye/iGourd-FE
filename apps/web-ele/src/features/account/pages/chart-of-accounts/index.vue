<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useChartOfAccounts } from '@@/account/hooks';

defineOptions({
  name: 'IChartOfAccounts',
});

const { t } = useI18n();

const { Grid, handleEdit, handleBatchDelete, categories, typeRef, Drawer } =
  useChartOfAccounts();
</script>

<template>
  <Page auto-content-height>
    <Grid :tabs="categories">
      <template #table-actions>
        <ElButton type="primary" @click="handleEdit(undefined, 'ledger')">
          {{ t('account.add-sub-ledger') }}
        </ElButton>
        <ElButton type="primary" @click="handleEdit(undefined, 'subLedger')">
          {{ t('chart-of-accounts.add-account-ledger') }}
        </ElButton>
      </template>

      <template #actions="{ row }">
        <ElButton
          type="text"
          :disabled="row.source_type === 'SYSTEM'"
          @click="handleEdit(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton
          type="text"
          :disabled="row.source_type === 'SYSTEM'"
          @click="handleBatchDelete()"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer :type="typeRef" />
  </Page>
</template>
