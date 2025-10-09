<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useStoreDevice } from '../../hooks/device/list';

defineOptions({
  name: 'IStoreDevice',
});

const { t } = useI18n();

const {
  Grid,
  Drawer,
  handleEdit,
  handleBatchDelete,
  canBatchOperate,
} = useStoreDevice();
</script>

<template>
  <Page auto-content-height>
    <Grid>
    <template #table-actions>
        <ElButton type="primary">
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
        <ElButton
          type="text"
          @click="handleEdit(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton
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
