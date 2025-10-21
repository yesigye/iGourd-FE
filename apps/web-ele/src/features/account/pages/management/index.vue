<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useAccountManagement } from '@@/account/hooks';

defineOptions({
  name: 'IAccountManagement',
});

const { t } = useI18n();
const { Grid, Drawer, handleEdit, canBatchOperate, handleBatchDelete, type } =
  useAccountManagement();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary" @click="handleEdit(undefined, 'CASH')">
          {{ t('account.add-cash') }}
        </ElButton>
        <ElButton type="primary" @click="handleEdit(undefined, 'CARD')">
          {{ t('account.add-bank-card') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          @click="handleBatchDelete"
        >
          {{ t('common.delete-btn') }}
        </ElButton>
      </template>
      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row, row.account_type)">
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
