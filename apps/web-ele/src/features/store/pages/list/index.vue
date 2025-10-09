<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useStoreList } from '@@/store/hooks';

defineOptions({
  name: 'IStoreList',
});

const { t } = useI18n();

const { Grid, Drawer, handleEdit, handleBatchDelete, canBatchOperate } =
  useStoreList();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary">
          {{ t('store.addStore') }}
        </ElButton>
        <ElButton type="danger" v-if="canBatchOperate">
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #operation="{ row }">
        <ElButton type="text">
          {{ t('common.detail') }}
        </ElButton>
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text">
          {{
            row.status === 'ACTIVE'
              ? t('store.deactivate')
              : t('store.activate')
          }}
        </ElButton>
        <ElButton
          v-if="row.status !== 'ACTIVE'"
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
