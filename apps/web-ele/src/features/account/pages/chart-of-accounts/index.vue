<script setup lang="ts">
import { ElButton, Page, useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useChartOfAccounts } from '@@/account/hooks';

import drawerSubject from '../../components/chart-of-accounts/drawer-subject.vue';
import drawer from '../../components/chart-of-accounts/drawer.vue';

defineOptions({
  name: 'IChartOfAccounts',
});

const { t } = useI18n();

const [Drawer, drawerApi] = useIgourdDrawer({
  connectedComponent: drawer,
  appendToMain: true,
});
const [DrawerSubject, drawerSubjectApi] = useIgourdDrawer({
  connectedComponent: drawerSubject,
  appendToMain: true,
});
const { Grid, handleEdit, handleBatchDelete, categories } =
  useChartOfAccounts();

const handleAddAccount = () => {
  drawerApi.setData(null).open();
};
const handleAddSubject = () => {
  drawerSubjectApi.setData(null).open();
};
</script>

<template>
  <Page auto-content-height>
    <Grid :tabs="categories">
      <template #table-actions>
        <ElButton type="primary" @click="handleAddAccount()">
          {{ t('account.add_sub_ledger') }}
        </ElButton>
        <ElButton type="primary" @click="handleAddSubject()">
          {{ t('chart-of-accounts.add-account-ledger') }}
        </ElButton>
      </template>

      <template #operation="{ row }">
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

    <Drawer />
    <DrawerSubject />
  </Page>
</template>
