<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleAdd">
          {{ t('customer.addCustomerFeature') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          :disabled="!selectedRows.length"
          @click="handleBatchDeleteFeature"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      
      <template #operation="{ row }">
        <ElButton type="text" @click="handleDetail(row)">
          {{ t('common.detail') }}
        </ElButton>
        <ElButton 
          type="text"
          @click="handleEditFeature(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton 
          type="text"
          @click="handleDelete(row)"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>
    
    <FeatureDrawer @success="refresh" />
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
  FeatureDrawer,
  selectedRows,
  handleAdd,
  handleEditFeature,
  handleDetail,
  handleDelete,
  handleBatchDeleteFeature,
  canBatchOperate,
  refresh,
} = useCustomerFeature();
</script>
