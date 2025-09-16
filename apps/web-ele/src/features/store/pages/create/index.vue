<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleAdd">
          {{ t('store.addStoreCreate') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          :disabled="!selectedRows.length"
          @click="handleBatchDeleteStoreCreate"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #operation="{ row }">
        <ElButton type="text" @click="handleDetail(row)">
          {{ t('common.detail') }}
        </ElButton>
        <ElButton
          v-if="row.status === 'DRAFT'"
          type="text"
          @click="handleEditStoreCreate(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton
          v-if="row.status === 'DRAFT'"
          type="text"
          @click="handleSubmit(row)"
        >
          {{ t('store.submit') }}
        </ElButton>
        <ElButton
          v-if="row.status === 'APPROVED'"
          type="text"
          @click="handleContinue(row)"
        >
          {{ t('store.continue') }}
        </ElButton>
        <ElButton
          v-if="['DRAFT', 'REJECTED'].includes(row.status)"
          type="text"
          @click="handleDelete(row)"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>

    <StoreCreateDrawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useStoreCreate } from '@@igourd/stores/hooks';

defineOptions({
  name: 'IStoreCreate',
});

const { t } = useI18n();

const {
  Grid,
  StoreCreateDrawer,
  selectedRows,
  handleAdd,
  handleEditStoreCreate,
  handleDetail,
  handleSubmit,
  handleContinue,
  handleDelete,
  handleBatchDeleteStoreCreate,
  canBatchOperate,
  refresh,
} = useStoreCreate();
</script>
