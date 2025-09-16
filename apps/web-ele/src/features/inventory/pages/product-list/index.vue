<script setup lang="ts">
import { ElButton, Page } from '@/components/Page';
import { useI18n } from 'vue-i18n';
import { useInventoryProductList } from '../../hooks/product-list/list';
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';

defineOptions({
  name: 'IInventoryProductList',
});

const { t } = useI18n();
const { 
  Grid, 
  handleEdit, 
  canBatchOperate, 
  handleBatchDelete,
  statusList,
  selectedRows,
  handleSelectionChange,
  handleDelete,
  handleCopy,
  handleImport,
  handleExport
} = useInventoryProductList();

// 导入相关
const importDialogVisible = ref(false);
const importFile = ref<File | null>(null);

// 处理导入文件选择
const handleImportFileChange = (file: File) => {
  importFile.value = file;
};

// 处理导入确认
const handleImportConfirm = async () => {
  if (!importFile.value) {
    ElMessage.warning(t('inventory.pleaseSelectFile'));
    return;
  }
  
  await handleImport(importFile.value);
  importDialogVisible.value = false;
  importFile.value = null;
};

// 处理详情
const handleDetail = (row: any) => {
  console.log('查看详情', row);
};

// 处理更多操作
const handleMore = (row: any) => {
  console.log('更多操作', row);
};

// 格式化数字
const formatNumber = (value: number) => {
  return value ? value.toLocaleString() : '0';
};

// 获取货币符号
const getCurrencySymbol = () => {
  return '$'; // 这里应该从用户设置获取
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <div class="flex justify-between items-center w-full">
          <div class="flex items-center gap-4">
            <ElButton
              v-auth="'inventory_product_list_add'"
              type="primary"
              @click="handleEdit()"
            >
              <i class="iconfont icon-tianjia-dianpu mr-1"></i>
              {{ t('employee.addButton') }}
            </ElButton>
            <ElButton
              v-if="canBatchOperate"
              v-auth="'inventory_product_list_delete'"
              type="danger"
              :disabled="selectedRows.length > 1"
              @click="handleDelete"
            >
              {{ t('employee.deleteButton') }}
            </ElButton>
          </div>
          <div class="flex items-center gap-2">
            <ElButton
              v-auth="'inventory_product_list_import'"
              @click="importDialogVisible = true"
            >
              <i class="iconfont icon-import__ mr-1"></i>
              {{ t('inventory.import') }}
            </ElButton>
            <ElButton
              :disabled="selectedRows.length <= 0"
              @click="handleExport"
            >
              <i class="iconfont icon-shuchu mr-1"></i>
              {{ t('account.export') }}
            </ElButton>
          </div>
        </div>
      </template>
      
      <template #image="{ row }">
        <el-image
          :src="row.profile_photo"
          class="w-8 h-8"
          alt="Product Image"
          :preview-src-list="[row.profile_photo]"
          :initial-index="0"
          :preview-teleported="true"
        >
          <template #error>
            <div class="w-8 h-8 bg-gray-200 flex items-center justify-center">
              <img src="@/assets/img/productDefault.png" alt="Default" class="w-6 h-6" />
            </div>
          </template>
        </el-image>
      </template>
      
      <template #status="{ row }">
        <div class="flex items-center justify-center">
          <div 
            :class="[
              'w-2.5 h-2.5 rounded-full mr-1',
              row.status === 'ON_SALE' ? 'bg-green-500' : 'bg-orange-400'
            ]"
          ></div>
          <span>{{ row.status === 'ON_SALE' ? t('inventory.onSale') : t('inventory.offSale') }}</span>
        </div>
      </template>
      
      <template #productGroup="{ row }">
        <i class="iconfont icon-fenlei"></i>
      </template>
      
      <template #productLabel="{ row }">
        <div class="flex flex-wrap gap-1">
          <span 
            v-for="label in row.product_label_list" 
            :key="label.id"
            class="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs"
          >
            {{ label.name }}
          </span>
        </div>
      </template>
      
      <template #operation="{ row }">
        <div class="flex items-center gap-1">
          <ElButton
            v-auth="'inventory_product_list_edit'"
            type="text"
            size="small"
            @click="handleEdit(row)"
          >
            {{ t('common.edit') }}
          </ElButton>
          <ElButton
            v-auth="'inventory_product_list_detail'"
            type="text"
            size="small"
            @click="handleDetail(row)"
          >
            {{ t('common.detail') }}
          </ElButton>
          <el-dropdown v-auth="'inventory_product-list_more'">
            <span class="text-blue-500 text-xs cursor-pointer">
              {{ t('common.more') }}
              <el-icon class="ml-1">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleCopy(row)">
                  {{ t('common.copy') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </Grid>

    <!-- 导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      :title="t('inventory.productImport')"
      width="500px"
    >
      <el-upload
        class="upload-demo"
        drag
        :auto-upload="false"
        :on-change="handleImportFileChange"
        accept=".xlsx,.xls"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          {{ t('inventory.dragFileHere') }} 或 <em>{{ t('inventory.clickToUpload') }}</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            {{ t('inventory.onlyExcelFiles') }}
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="importDialogVisible = false">
            {{ t('common.cancel') }}
          </el-button>
          <el-button type="primary" @click="handleImportConfirm">
            {{ t('common.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </Page>
</template>

<style scoped>
.upload-demo {
  width: 100%;
}
</style>
