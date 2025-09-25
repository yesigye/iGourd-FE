<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useSaleEnter } from '@@/sale/hooks';

defineOptions({
  name: 'ISaleEnter',
});

const { t } = useI18n();

const { Grid, Drawer, handleEdit, handleBatchDelete, canBatchOperate } =
  useSaleEnter();
</script>

<template>
  <Page auto-content-height>
    <Grid>
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
        <ElButton v-if="row.status === 'DRAFT'" type="text">
          {{ t('sale.confirm') }}
        </ElButton>
        <ElButton
          v-if="['DRAFT', 'CONFIRMED'].includes(row.status)"
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
