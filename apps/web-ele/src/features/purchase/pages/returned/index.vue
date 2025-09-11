<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="drawerApi.open()">
          {{ t('common.create') }}
        </ElButton>
        <ElButton type="danger" v-if="canBatchDelete" @click="batchDelete">
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #actions="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
<script setup lang="ts">
import { Page, ElButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { usePurchaseReturnedList } from '../../hooks/use-purchase-returned-list';

defineOptions({
  name: 'IPurchaseReturned',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi, handleEdit, canBatchDelete, batchDelete } =
  usePurchaseReturnedList();
</script>
