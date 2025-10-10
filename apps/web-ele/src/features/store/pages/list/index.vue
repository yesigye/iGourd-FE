<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useStoreList } from '@@/store/hooks';

defineOptions({
  name: 'IStoreList',
});

const { t } = useI18n();

const { Grid, Drawer, handleEdit, jumpCreateStorePage, canBatchOperate } =
  useStoreList();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary" @click="jumpCreateStorePage({})">
          {{ t('common.add') }}
        </ElButton>
        <ElButton type="danger" v-if="canBatchOperate">
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #actions="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
      </template>
    </Grid>

    <Drawer />
  </Page>
</template>
