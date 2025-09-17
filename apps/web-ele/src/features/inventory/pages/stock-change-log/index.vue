<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { ElButton, ElTooltip } from 'element-plus';

import { useInventoryChangeLogList } from '../../hooks/change-log/list';

defineOptions({
  name: 'IInventoryChangeLog',
});

const { t } = useI18n();
const { Grid, handleCreate, handleEdit, handleBatchDelete, Drawer } =
  useInventoryChangeLogList();

// // 统计信息
// const statistics = ref(null);

// // 获取统计信息
// const loadStatistics = async () => {
//   statistics.value = await getStatistics();
// };

// onMounted(() => {
//   loadStatistics();
// });
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleCreate()">
          {{ t('common.add') }}
        </ElButton>
      </template>
      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleBatchDelete()">
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
