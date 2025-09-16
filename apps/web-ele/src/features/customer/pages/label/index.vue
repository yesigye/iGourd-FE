<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleAdd">
          {{ t('customer.addCustomerLabel') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          :disabled="!selectedRows.length"
          @click="handleBatchDeleteLabel"
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
          @click="handleEditLabel(row)"
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
    
    <LabelDrawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useCustomerLabel } from '@@/customer/hooks';

defineOptions({
  name: 'ICustomerLabel',
});

const { t } = useI18n();

const {
  Grid,
  LabelDrawer,
  selectedRows,
  handleAdd,
  handleEditLabel,
  handleDetail,
  handleDelete,
  handleBatchDeleteLabel,
  canBatchOperate,
  refresh,
} = useCustomerLabel();
</script>
