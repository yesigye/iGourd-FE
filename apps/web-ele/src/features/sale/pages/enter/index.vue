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
      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleView(row)">
          {{ t('common.view') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>

<script setup lang="ts">
import { Page, ElButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useSaleEnterList } from '../../hooks/use-sale-enter-list';

defineOptions({
  name: 'ISaleEnter',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi, handleEdit, handleView, canBatchDelete, batchDelete } =
  useSaleEnterList();
</script>

