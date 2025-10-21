<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useInventorySkuList } from '../../hooks/sku-list/list';
import StatusTemplate from '#/components/status/index.vue';

defineOptions({
  name: 'IInventorySkuList',
});

const { t } = useI18n();

const { Grid, Drawer, handleEdit, handleBatchDelete, canBatchOperate,handleView } =
  useInventorySkuList();


const STATUS_CONFIG = [
  {
    name: 'inventory.off-sale',
    value: 'OFF_SALE',
    iconColor: '#9e9e9e',
  },
  {
    name: 'inventory.on-sale',
    value: 'ON_SALE',
    iconColor: '#4caf51',
  },

];
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
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
          :value="row.status"
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
