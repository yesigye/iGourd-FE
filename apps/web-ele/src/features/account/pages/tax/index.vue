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
          :disabled="!selectedIds.length"
          @click="handleBatchDeleteTax"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      
      <template #operation="{ row }">
        <ElButton 
          type="text"
          @click="handleEditTax(row)"
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
    
    <Drawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useTax } from '@@/account/hooks';

defineOptions({
  name: 'ITax',
});

const { t } = useI18n();

const {
  Grid,
  Drawer,
  selectedIds,
  handleAdd,
  handleEditTax,
  handleDelete,
  handleBatchDeleteTax,
  canBatchOperate,
  refresh,
} = useTax();
</script>
