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
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #operations="{ row }">
        <ElButton
          type="text"
          @click="handleEdit(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton
          type="text"
          @click="handleBatchDelete()"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #type="{ row }">
        {{ row.type === 'INPUT' ?t('feature.input-box'):t('feature.select-box') }}
      </template>
    </Grid>

    <Drawer />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useCustomerFeature } from '@@/customer/hooks';

defineOptions({
  name: 'ICustomerFeature',
});

const { t } = useI18n();

const {
  Grid,
  Drawer,
  handleEdit,
  handleBatchDelete,
  canBatchOperate,
} = useCustomerFeature();
</script>
