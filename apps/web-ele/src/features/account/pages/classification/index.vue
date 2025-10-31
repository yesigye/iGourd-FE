<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useClassification, useClassificationDetails } from '@@/account/hooks';

defineOptions({
  name: 'IClassification',
});

const { t } = useI18n();
//

const {
  Grid,
  Drawer,
  handleEdit,
  canBatchOperate,
  handleBatchDelete,
  handleDelete,
} = useClassification();
const { Drawer: DetailsDrawer, drawerApi: detailsDrawerApi } =
  useClassificationDetails();

const handleDetail = (row: any) => {
  detailsDrawerApi.setData({ info: row }).open();
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('common.add') }}
        </ElButton>
        <ElButton
          type="danger"
          @click="handleBatchDelete()"
          v-if="canBatchOperate"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #operation="{ row }">
        <ElButton
          type="text"
          :disabled="row.source_type === 'SYSTEM'"
          @click="handleEdit(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleDetail(row)">
          {{ t('common.detail') }}
        </ElButton>
      </template>
      <template #type="{ row }">
        {{ t(`enum.account-classification-types.${row.type}`) }}
      </template>
    </Grid>

    <Drawer />
    <DetailsDrawer />
  </Page>
</template>
