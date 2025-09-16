<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleAdd">
          {{ t('setting.addPayment') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          :disabled="!selectedRows.length"
          @click="handleBatchDeletePayment"
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
          @click="handleEditPayment(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton 
          type="text"
          @click="handleToggleStatus(row)"
        >
          {{ row.status === 'ACTIVE' ? t('setting.deactivate') : t('setting.activate') }}
        </ElButton>
        <ElButton 
          v-if="row.status !== 'ACTIVE'"
          type="text"
          @click="handleDelete(row)"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>
    
    <PaymentDrawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useSettingPayment } from '@@/setting/hooks';

defineOptions({
  name: 'ISettingPayment',
});

const { t } = useI18n();

const {
  Grid,
  PaymentDrawer,
  selectedRows,
  handleAdd,
  handleEditPayment,
  handleDetail,
  handleToggleStatus,
  handleDelete,
  handleBatchDeletePayment,
  canBatchOperate,
  refresh,
} = useSettingPayment();
</script>
