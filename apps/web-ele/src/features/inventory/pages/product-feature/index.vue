<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useInventoryProductFeatureList } from '@@/inventory/hooks';

defineOptions({
  name: 'IInventoryProductFeature',
});

const { t } = useI18n();
const { Grid, Drawer, handleEdit,handleView, canBatchOperate, handleBatchDelete } =
  useInventoryProductFeatureList();
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
          {{ t('inventory.addFeature') }}
        </ElButton>
        <ElButton
          v-if="canBatchOperate"
          type="danger"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #operation="{ row }">
        <ElButton
          v-auth="'inventory_product_feature_edit'"
          type="text"
          @click="handleEdit(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton
          v-auth="'inventory_product_feature_detail'"
          type="text"
          @click="handleView(row)"
        >
          {{ t('common.detail') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
