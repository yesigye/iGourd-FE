<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleAdd">
          {{ t('store.addDevice') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          :disabled="!selectedRows.length"
          @click="handleBatchDeleteDevice"
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
          @click="handleEditDevice(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton
          type="text"
          @click="handleToggleStatus(row)"
        >
          {{ row.status === 'ONLINE' ? t('store.offline') : t('store.online') }}
        </ElButton>
        <ElButton
          v-if="row.status === 'ONLINE'"
          type="text"
          @click="handleRestart(row)"
        >
          {{ t('store.restart') }}
        </ElButton>
        <ElButton
          v-if="row.status !== 'ONLINE'"
          type="text"
          @click="handleDelete(row)"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>

    <DeviceDrawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useStoreDevice } from '@@igourd/stores/hooks';

defineOptions({
  name: 'IStoreDevice',
});

const { t } = useI18n();

const {
  Grid,
  DeviceDrawer,
  selectedRows,
  handleAdd,
  handleEditDevice,
  handleDetail,
  handleToggleStatus,
  handleRestart,
  handleDelete,
  handleBatchDeleteDevice,
  canBatchOperate,
  refresh,
} = useStoreDevice();
</script>
