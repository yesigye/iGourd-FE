<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary">
          {{ t('store.addStoreCreate') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #operation="{ row }">
        <ElButton type="text">
          {{ t('common.detail') }}
        </ElButton>
        <ElButton
          v-if="row.status === 'DRAFT'"
          type="text"
          @click="handleEdit(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton
          v-if="row.status === 'DRAFT'"
          type="text"
        >
          {{ t('store.submit') }}
        </ElButton>
        <ElButton
          v-if="row.status === 'APPROVED'"
          type="text"
        >
          {{ t('store.continue') }}
        </ElButton>
        <ElButton
          v-if="['DRAFT', 'REJECTED'].includes(row.status)"
          type="text"
          @click="handleBatchDelete(row)"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>

    <Drawer />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useStoreCreate } from '@@/store/hooks';

defineOptions({
  name: 'IStoreCreate',
});

const { t } = useI18n();

const {
  Grid,
  Drawer,
  handleEdit,
  handleBatchDelete,
  canBatchOperate,
} = useStoreCreate();
</script>
