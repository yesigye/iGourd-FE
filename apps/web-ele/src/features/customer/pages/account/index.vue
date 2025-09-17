<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary">
          {{ t('customers.addRevenue') }}
        </ElButton>
        <ElButton type="danger">
          {{ t('customers.addExpenditures') }}
        </ElButton>
        <ElButton type="default">
          {{ t('customers.import') }}
        </ElButton>
      </template>
      
      <template #operation="{ row }">
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

import { useCustomerAccount } from '@@/customer/hooks';

defineOptions({
  name: 'ICustomerAccount',
});

const { t } = useI18n();

const {
  Grid,
  Drawer,
  handleEdit,
  handleBatchDelete,
  canBatchOperate,
} = useCustomerAccount();
</script>
