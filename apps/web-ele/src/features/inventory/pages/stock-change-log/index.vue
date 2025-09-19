<script setup lang="ts">
import { Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

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
    <Grid />
    <Drawer />
  </Page>
</template>
