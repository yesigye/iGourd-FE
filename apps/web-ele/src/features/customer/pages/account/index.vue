<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <div class="flex gap-4">
          <ElButton
            type="success"
            @click="handleAddRevenue"
          >
            {{ t('customers.addRevenue') }}
          </ElButton>
          <ElButton
            type="danger"
            @click="handleAddExpenditure"
          >
            {{ t('customers.addExpenditures') }}
          </ElButton>
          <ElButton
            type="default"
            @click="handleImport"
          >
            {{ t('customers.import') }}
          </ElButton>
        </div>
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
          @click="handleDelete(row)"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>
    
    <RevenueDrawer @success="refresh" />
    <ImportDrawer @success="refresh" />
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
  RevenueDrawer,
  ImportDrawer,
  handleAddRevenue,
  handleAddExpenditure,
  handleImport,
  handleEdit,
  handleDelete,
  refresh,
} = useCustomerAccount();
</script>
