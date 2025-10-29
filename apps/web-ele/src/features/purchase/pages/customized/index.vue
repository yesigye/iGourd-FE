<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useCustomizedFeature,useCustomizedDetail } from '#/hooks';

defineOptions({
  name: 'IPurchaseCustomized',
});

const { t } = useI18n();

const { Grid, Drawer, handleEdit, canBatchOperate, handleBatchDelete,handleView } =
  useCustomizedFeature('VENDOR');

const { Drawer: Detail, drawerApi: detailDrawerApi } = useCustomizedDetail(t("customized.view-supplier-attributes"));
const handleViewC=(row)=>{
  detailDrawerApi.setData(row).open();
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('common.create') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #operations="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleViewC(row)">
          {{ t('common.detail') }}
        </ElButton>
      </template>
      <template #type="{ row }">
        {{
          row.type === 'INPUT'
            ? t('add-customized.input-box')
            : t('add-customized.select-box')
        }}
      </template>
      <template #is_fixed_option="{ row }">
        {{
          row.is_fixed_option ? t('add-customized.yes') : t('add-customized.no')
        }}
      </template>
      <template #is_compulsory="{ row }">
        {{
          row.is_compulsory ? t('add-customized.yes') : t('add-customized.no')
        }}
      </template>
    </Grid>
    <Drawer />
    <Detail/>
  </Page>
</template>
