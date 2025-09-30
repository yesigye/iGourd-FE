<script setup lang="ts">
import { ElButton, ElIcon, ElTooltip, Page } from '@igourd/common-ui';
import { Warning } from '@igourd/icons';
import { useI18n } from '@igourd/locales';

import { useInventory } from '@@/inventory/hooks';

defineOptions({
  name: 'IInventory',
});

const { t } = useI18n();
const { Grid, Drawer, handleEdit, canBatchOperate, handleBatchDelete } =
  useInventory();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('common.add') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #tooltip="{ row }">
        <span>{{ row.major_unit_name }}</span>
        <ElTooltip class="box-item" effect="light" placement="top">
          <template #content>
            <div v-for="item in row.stock_quantity_message" :key="item">
              {{ item.symbol + item.numerical_value + item.unit }}
            </div>
          </template>
          <ElIcon class="ml-4"><Warning /></ElIcon>
        </ElTooltip>
      </template>
      <template #tooltipNum="{ cellValue, row }">
        <span>{{ cellValue }}</span>
        <ElTooltip class="box-item" effect="light" placement="top">
          <template #content>
            <div v-for="item in row.stock_quantity_message" :key="item">
              {{ item.symbol + item.numerical_value + item.unit }}
            </div>
          </template>
          <ElIcon class="ml-4"><Warning /></ElIcon>
        </ElTooltip>
      </template>

      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.detail') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
