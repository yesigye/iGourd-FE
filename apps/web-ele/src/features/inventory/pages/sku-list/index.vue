<script setup lang="ts">
import { ElButton, Page } from '@/components/Page';
import { useI18n } from 'vue-i18n';
import { useInventorySkuList } from '../../hooks/sku-list/list';
import { ref } from 'vue';

defineOptions({
  name: 'IInventorySkuList',
});

const { t } = useI18n();
const { 
  Grid, 
  selectedRows,
  handleSelectionChange,
  handleDelete,
  handleEdit,
  handleDetail
} = useInventorySkuList();

// 处理编辑成功回调
const handleEditSuccess = () => {
  console.log('编辑成功，刷新数据');
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <div class="flex justify-between items-center w-full">
          <div class="flex items-center gap-4">
            <ElButton
              v-if="selectedRows.length === 1"
              v-auth="'inventory_sku-list_delete'"
              type="danger"
              @click="handleDelete"
            >
              {{ t('employee.deleteButton') }}
            </ElButton>
          </div>
        </div>
      </template>
      
      <template #image="{ row }">
        <el-image
          :src="row.profile_photo"
          class="w-12 h-12 rounded"
          alt="Product Image"
          :preview-src-list="[row.profile_photo]"
          fit="cover"
        >
          <template #error>
            <div class="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
              <img src="@/assets/img/productDefault.png" alt="Default" class="w-8 h-8" />
            </div>
          </template>
        </el-image>
      </template>
      
      <template #status="{ row }">
        <div class="flex items-center justify-center">
          <div 
            :class="[
              'w-2.5 h-2.5 rounded-full mr-2',
              row.status === 'ON_SALE' ? 'bg-green-500' : 'bg-orange-400'
            ]"
          ></div>
          <span>{{ row.status === 'ON_SALE' ? t('inventory.onSale') : t('inventory.offSale') }}</span>
        </div>
      </template>
      
      <template #operation="{ row }">
        <div class="flex items-center gap-2">
          <ElButton
            v-auth="'inventory_sku-list_edit'"
            type="text"
            size="small"
            @click="handleEdit(row)"
          >
            {{ t('common.edit') }}
          </ElButton>
          <ElButton
            v-auth="'inventory_sku-list_detail'"
            type="text"
            size="small"
            @click="handleDetail(row)"
          >
            {{ t('common.detail') }}
          </ElButton>
        </div>
      </template>
    </Grid>
  </Page>
</template>

<style scoped>
.table-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
}
</style>
