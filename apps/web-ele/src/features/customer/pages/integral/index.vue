<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleAdd">
          {{ t('customer.addCustomerIntegral') }}
        </ElButton>
        <ElButton type="default" @click="handleSetting">
          {{ t('customer.integralSetting') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          :disabled="!selectedRows.length"
          @click="handleBatchDeleteIntegral"
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
          @click="handleEditIntegral(row)"
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
    
    <IntegralDrawer @success="refresh" />
    <SettingDrawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useCustomerIntegral } from '@@/customer/hooks';

defineOptions({
  name: 'ICustomerIntegral',
});

const { t } = useI18n();

const {
  Grid,
  IntegralDrawer,
  SettingDrawer,
  selectedRows,
  handleAdd,
  handleEditIntegral,
  handleDetail,
  handleSetting,
  handleDelete,
  handleBatchDeleteIntegral,
  canBatchOperate,
  refresh,
} = useCustomerIntegral();
</script>
