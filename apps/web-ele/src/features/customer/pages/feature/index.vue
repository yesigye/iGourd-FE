<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useCustomizedFeature } from '#/hooks';

defineOptions({
  name: 'ICustomerFeature',
});

const { t } = useI18n();

const { Grid, Drawer, handleEdit, handleBatchDelete, canBatchOperate,handleDelete} =
  useCustomizedFeature('CUSTOMER');
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('common.create') }}
        </ElButton>
        <ElButton type="danger" v-if="canBatchOperate">
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #operations="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleDelete([row.id])">
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #type="{ row }">
        {{
          row.type === 'INPUT'
            ? t('feature.input-box')
            : t('feature.select-box')
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
  </Page>
</template>
