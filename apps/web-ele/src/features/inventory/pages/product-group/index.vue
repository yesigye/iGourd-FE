<script setup lang="ts">
import { ElButton, Page } from '@/components/Page';
import { useI18n } from 'vue-i18n';
import { useInventoryProductGroupList } from '../../hooks/product-group/list';

defineOptions({
  name: 'IInventoryProductGroup',
});

const { t } = useI18n();
const { leftCrud, rightCrud } = useInventoryProductGroupList();

// 处理左侧选择
const handleLeftSelect = (row: any) => {
  // 实现左侧选择逻辑
  console.log('选择左侧分组', row);
};

// 处理添加父级分组
const handleAddParentGroup = () => {
  console.log('添加父级分组');
};

// 处理添加子分组
const handleAddGroup = (row: any) => {
  console.log('添加子分组', row);
};

// 处理编辑父级分组
const handleParentGroupEdit = (row: any) => {
  console.log('编辑父级分组', row);
};

// 处理编辑子分组
const handleProductGroupEdit = (row: any) => {
  console.log('编辑子分组', row);
};

// 处理删除父级分组
const handleParentGroupDelete = (row: any) => {
  console.log('删除父级分组', row);
};

// 处理删除子分组
const handleSonGroupDelete = (row: any) => {
  console.log('删除子分组', row);
};
</script>

<template>
  <Page auto-content-height>
    <div class="flex gap-4 h-full">
      <!-- 左侧表格 -->
      <div class="w-1/3">
        <div class="mb-4">
          <h3 class="text-lg font-medium">{{ t('inventory.parentProductGroup') }}</h3>
        </div>
        <div class="border rounded">
          <div class="p-4">
            <div class="flex justify-between items-center mb-4">
              <ElButton
                v-auth="'inventory_product_group_add'"
                type="primary"
                @click="handleAddParentGroup"
              >
                <i class="iconfont icon-tianjia-dianpu mr-1"></i>
                {{ t('employee.addButton') }}
              </ElButton>
            </div>
            <div class="h-96 overflow-auto">
              <el-table
                :data="leftCrud.dataList?.list || []"
                border
                stripe
                highlight-current-row
                @row-click="handleLeftSelect"
                v-loading="leftCrud.loading"
              >
                <el-table-column
                  type="selection"
                  width="55"
                  align="center"
                />
                <el-table-column
                  :label="t('inventory.parentProductGroup')"
                  prop="major_name"
                  min-width="200"
                />
                <el-table-column
                  :label="t('inventory.action')"
                  width="135"
                  align="center"
                >
                  <template #default="scope">
                    <ElButton
                      v-auth="'inventory_product_group_add'"
                      type="text"
                      size="small"
                      @click.stop="handleAddGroup(scope.row)"
                    >
                      <i class="iconfont icon-tianjia-dianpu"></i>
                    </ElButton>
                    <ElButton
                      v-auth="'inventory_product_group_edit'"
                      type="text"
                      size="small"
                      @click.stop="handleParentGroupEdit(scope.row)"
                    >
                      <i class="iconfont icon-icon_Edit"></i>
                    </ElButton>
                    <ElButton
                      v-auth="'inventory_product_group_delete'"
                      type="text"
                      size="small"
                      @click.stop="handleParentGroupDelete(scope.row)"
                    >
                      <i class="iconfont icon-shanchu2 text-red-500"></i>
                    </ElButton>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="mt-4 flex justify-end">
              <el-pagination
                v-model:current-page="leftCrud.searchParams.page_num"
                v-model:page-size="leftCrud.searchParams.page_size"
                :total="leftCrud.dataList?.total || 0"
                :page-sizes="[10, 20, 50, 100]"
                layout="prev, pager, next, sizes"
                @size-change="leftCrud.handleSizeChange"
                @current-change="leftCrud.handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧表格 -->
      <div class="w-2/3">
        <div class="mb-4">
          <h3 class="text-lg font-medium">{{ t('inventory.productTwoGroup') }}</h3>
        </div>
        <div class="border rounded">
          <div class="p-4">
            <div class="h-96 overflow-auto">
              <el-table
                :data="rightCrud.dataList?.list || []"
                border
                stripe
                v-loading="rightCrud.loading"
              >
                <el-table-column
                  :label="t('inventory.productTwoGroup')"
                  prop="major_name"
                  min-width="200"
                />
                <el-table-column
                  :label="t('inventory.parentProductGroup')"
                  prop="parent_group_name"
                  min-width="200"
                />
                <el-table-column
                  :label="t('inventory.productNumber')"
                  prop="product_number"
                  min-width="160"
                />
                <el-table-column
                  :label="t('inventory.creator')"
                  prop="creator_name"
                  min-width="180"
                />
                <el-table-column
                  :label="t('inventory.create_time')"
                  prop="create_time"
                  min-width="180"
                />
                <el-table-column
                  :label="t('inventory.action')"
                  width="100"
                  align="center"
                >
                  <template #default="scope">
                    <ElButton
                      v-auth="'inventory_product_group_edit'"
                      type="text"
                      size="small"
                      @click="handleProductGroupEdit(scope.row)"
                    >
                      <i class="iconfont icon-icon_Edit"></i>
                    </ElButton>
                    <ElButton
                      v-auth="'inventory_product_group_delete'"
                      type="text"
                      size="small"
                      @click="handleSonGroupDelete(scope.row)"
                    >
                      <i class="iconfont icon-shanchu2 text-red-500"></i>
                    </ElButton>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="mt-4 flex justify-end">
              <el-pagination
                v-model:current-page="rightCrud.searchParams.page_num"
                v-model:page-size="rightCrud.searchParams.page_size"
                :total="rightCrud.dataList?.total || 0"
                :page-sizes="[10, 20, 50, 100]"
                layout="prev, pager, next, sizes"
                @size-change="rightCrud.handleSizeChange"
                @current-change="rightCrud.handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>
