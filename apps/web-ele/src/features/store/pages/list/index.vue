<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleAdd">
          {{ t('store.addStore') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          :disabled="!selectedRows.length"
          @click="handleBatchDeleteStore"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #operation="{ row }">
        <ElButton type="text" @click="handleDetail(row)">
          {{ t('common.detail') }}
        </ElButton>
        <ElButton
          type="text"
          @click="handleEditStore(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton
          type="text"
          @click="handleToggleStatus(row)"
        >
          {{ row.status === 'ACTIVE' ? t('store.deactivate') : t('store.activate') }}
        </ElButton>
        <ElButton
          v-if="row.status !== 'ACTIVE'"
          type="text"
          @click="handleDelete(row)"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>

    <StoreListDrawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useStoreList } from '@@igourd/stores/hooks';

defineOptions({
  name: 'IStoreList',
});

const { t } = useI18n();

const {
  Grid,
  StoreListDrawer,
  selectedRows,
  handleAdd,
  handleEditStore,
  handleDetail,
  handleToggleStatus,
  handleDelete,
  handleBatchDeleteStore,
  canBatchOperate,
  refresh,
} = useStoreList();
</script>
