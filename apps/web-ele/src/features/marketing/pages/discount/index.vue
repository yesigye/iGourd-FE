<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useDiscount } from '@@/marketing/hooks';

defineOptions({
  name: 'IDiscount',
});

const { t } = useI18n();
const { Grid, Drawer, handleEdit, canBatchOperate, handleBatchDelete } =
  useDiscount();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('common.create') }}
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
        <ElButton type="text" @click="handleEdit(row)">
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
