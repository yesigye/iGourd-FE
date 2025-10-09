<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
// import { useSaleListList } from '../../hooks/use-sale-list-list';

defineOptions({
  name: 'ISaleList',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi, handleEdit, canBatchDelete, batchDelete } = {};
// useSaleListList();
</script>

<template>
  <Page auto-content-height>
    <Grid>
    <template #table-actions>
        <ElButton type="primary" @click="drawerApi.open()">
          {{ t('common.create') }}
        </ElButton>
        <ElButton type="danger" v-if="canBatchDelete" @click="batchDelete">
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
