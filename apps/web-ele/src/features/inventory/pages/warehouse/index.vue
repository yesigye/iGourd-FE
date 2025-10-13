<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useWarehouse } from '@@/inventory/hooks';

import StatusTemplate from '#/components/status/index.vue';

defineOptions({
  name: 'IWarehouse',
});

const { t } = useI18n();
const {
  Grid,
  Drawer,
  handleEdit,
  handleView,
  canBatchOperate,
  handleBatchDelete,
} = useWarehouse();

const STATUS_CONFIG = [
  {
    name: 'common.no',
    value: 'false',
    iconColor: '#9e9e9e',
  },
  {
    name: 'common.yes',
    value: 'true',
    iconColor: '#4caf51',
  },

];
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('inventory.addWarehouse') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #status="{ row }">
        <StatusTemplate
          :value="row.is_sale?'true':'false'"
          :status-list="STATUS_CONFIG"
        />
      </template>

      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleView(row)">
          {{ t('common.detail') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
