<script setup lang="ts">
import { ElButton, Page } from '@/components/Page';
import { useI18n } from 'vue-i18n';
import { useInventoryProductFeatureList } from '../../hooks/product-feature/list';

defineOptions({
  name: 'IInventoryProductFeature',
});

const { t } = useI18n();
const { Grid, handleEdit, canBatchOperate, handleBatchDelete } = useInventoryProductFeatureList();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
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
          <i class="iconfont icon-icon_Edit mr-1"></i>
          {{ t('common.edit') }}
        </ElButton>
        <ElButton
          v-auth="'inventory_product_feature_detail'"
          type="text"
          @click="handleDetail(row)"
        >
          <i class="iconfont icon-icon_details mr-1"></i>
          {{ t('common.detail') }}
        </ElButton>
      </template>
    </Grid>
  </Page>
</template>

<script lang="ts">
// 详情处理
const handleDetail = (row: any) => {
  // 实现详情逻辑
  console.log('详情', row);
};
</script>
