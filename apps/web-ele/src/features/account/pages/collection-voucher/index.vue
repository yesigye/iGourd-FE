<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleAdd">
          {{ t('common.add') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          :disabled="!selectedRows.length"
          @click="handleBatchDeleteCollectionVoucher"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      
      <template #operation="{ row }">
        <ElButton 
          type="text" 
          :disabled="row.review_status !== 'PENDING'"
          @click="handleEditCollectionVoucher(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton 
          type="text"
          @click="handleDetail(row)"
        >
          {{ t('inventory.details') }}
        </ElButton>
        <ElButton 
          type="text"
          @click="handlePrint(row)"
        >
          {{ t('account.print') }}
        </ElButton>
      </template>
    </Grid>
    
    <Drawer @success="refresh" />
    <DetailDrawer @close="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useCollectionVoucher } from '@@/account/hooks';

defineOptions({
  name: 'ICollectionVoucher',
});

const { t } = useI18n();

const {
  Grid,
  Drawer,
  DetailDrawer,
  selectedRows,
  handleAdd,
  handleEditCollectionVoucher,
  handleDetail,
  handlePrint,
  handleBatchDeleteCollectionVoucher,
  canBatchOperate,
  refresh,
} = useCollectionVoucher();
</script>
