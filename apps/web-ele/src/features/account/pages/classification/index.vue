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
          @click="handleBatchDeleteClassification"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      
      <template #operation="{ row }">
        <ElButton 
          type="text" 
          :disabled="row.source_type === 'SYSTEM'"
          @click="handleEditClassification(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
      </template>
    </Grid>
    
    <Drawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useClassification } from '@@/account/hooks';

defineOptions({
  name: 'IClassification',
});

const { t } = useI18n();

const {
  Grid,
  Drawer,
  selectedIds,
  handleAdd,
  handleEditClassification,
  handleBatchDeleteClassification,
  canBatchOperate,
  refresh,
} = useClassification();
</script>
