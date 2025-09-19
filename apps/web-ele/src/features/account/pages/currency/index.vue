<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary">
          {{ t('common.add') }}
        </ElButton>
        <ElButton type="danger" v-if="canBatchOperate">
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleBatchDelete()">
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

import { useCurrency } from '@@/account/hooks';

defineOptions({
  name: 'ICurrency',
});

const { t } = useI18n();

const { Grid, Drawer, handleEdit, handleBatchDelete, canBatchOperate } =
  useCurrency();
</script>
