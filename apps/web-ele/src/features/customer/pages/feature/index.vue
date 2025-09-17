<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary">
          {{ t('customer.addCustomerFeature') }}
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
