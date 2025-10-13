<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { Check, Close } from '@igourd/icons';
import { useI18n } from '@igourd/locales';

import { useInventoryUnitList } from '@@/inventory/hooks';
import { ElSwitch } from 'element-plus';

defineOptions({
  name: 'IInventoryUnit',
});

const { t } = useI18n();
const { Grid, Drawer, handleEdit, handleBatchDelete, handleDelete,canBatchOperate } =
  useInventoryUnitList();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('common.add') }}
        </ElButton>
        <ElButton type="danger" v-if="canBatchOperate" @click="handleBatchDelete()">
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #isBasicUnit="{ row }">
        <el-tag :type="row.is_basic_unit ? 'success' : 'info'">
          {{ row.is_basic_unit ? t('inventory.yes') : t('inventory.no') }}
        </el-tag>
      </template>

      <template #status="{ row }">
        <ElSwitch
          :model-value="row.status === 'ACTIVE' || row.status === 'INIT'"
          class="mt-2"
          style="margin-left: 24px"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
          :disabled="row.source_type === 'SYSTEM'"
          @change="handleStatusChange(row)"
        />
      </template>

      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleDelete([row.id])">
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>

    <Drawer />
  </Page>
</template>
