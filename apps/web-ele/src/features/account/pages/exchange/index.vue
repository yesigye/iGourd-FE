<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleAdd">
          {{ t('employee.addButton') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          :disabled="!selectedIds.length"
          @click="handleBatchDeleteExchange"
        >
          {{ t('employee.deleteButton') }}
        </ElButton>
      </template>
      
      <template #operation="{ row }">
        <ElButton 
          type="text"
          @click="handleEditExchange(row)"
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

import { useExchange } from '@@/account/hooks';

defineOptions({
  name: 'IExchange',
});

const { t } = useI18n();

const {
  Grid,
  Drawer,
  selectedIds,
  handleAdd,
  handleEditExchange,
  handleDelete,
  handleBatchDeleteExchange,
  canBatchOperate,
  refresh,
} = useExchange();
</script>
