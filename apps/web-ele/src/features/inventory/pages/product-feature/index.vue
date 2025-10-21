<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useCustomizedFeature } from '#/hooks';

defineOptions({
  name: 'IInventoryProductFeature',
});

const { t } = useI18n();
const {
  Grid,
  Drawer,
  handleEdit,
  handleView,
  canBatchOperate,
  handleBatchDelete,
} = useCustomizedFeature('PRODUCT');
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton
          v-auth="'inventory_product_feature_add'"
          type="primary"
          @click="handleEdit()"
        >
          <i class="iconfont icon-tianjia-dianpu mr-1"></i>
          {{ t('inventory.add-feature') }}
        </ElButton>
        <ElButton
          v-if="canBatchOperate"
          type="danger"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #operations="{ row }">
        <ElButton
          v-auth="'inventory_product_feature_edit'"
          type="text"
          @click="handleEdit(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleBatchDelete()">
          {{ t('common.delete') }}
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
  </Page>
</template>
