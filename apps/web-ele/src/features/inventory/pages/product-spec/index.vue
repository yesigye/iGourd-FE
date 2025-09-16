<script setup lang="ts">
import { ElButton, Page } from '@/components/Page';
import { useI18n } from 'vue-i18n';
import { useInventoryProductSpec } from '../../hooks/product-spec/list';
import { ref } from 'vue';

defineOptions({
  name: 'IInventoryProductSpec',
});

const { t } = useI18n();
const {
  productSpecList,
  productSpecValueList,
  selectedSpec,
  keywords,
  pagination,
  treeData,
  tableColumns,
  getProductSpecList,
  getProductSpecValueList,
  deleteSpec,
  deleteSpecValue,
  handleSpecSelect,
  search,
  clearSearch,
  handleSizeChange,
  handleCurrentChange,
  getSpecById
} = useInventoryProductSpec();

const treeRef = ref();

// 处理节点点击
const handleNodeClick = (node: any) => {
  if (!node.isRoot) {
    const spec = productSpecList.value.find(s => s.id === node.id);
    if (spec) {
      handleSpecSelect(spec);
    }
  }
};

// 添加规格
const addProductSpec = () => {
  console.log('添加规格');
};

// 编辑规格
const editProductSpec = (data: any) => {
  console.log('编辑规格', data);
};

// 添加规格值
const addSpecValue = () => {
  console.log('添加规格值');
};

// 编辑规格值
const editSpecValue = (row: any) => {
  console.log('编辑规格值', row);
};

// 处理规格成功回调
const handleSpecSuccess = (result: any) => {
  if (result && result.type === 'spec') {
    getProductSpecList();
  } else if (result && result.type === 'specValue') {
    handleNodeClick({
      id: result.data.product_spec_id,
      product_spec_name: result.data.product_spec_name
    });
  }
  if (result && result.type === 'spec' && result.action === 'add') {
    setTimeout(() => {
      // 选择第一个规格
      if (productSpecList.value && productSpecList.value.length > 0) {
        const firstSpec = productSpecList.value[0];
        handleSpecSelect(firstSpec);
      }
    }, 100);
  }
};
</script>

<template>
  <Page auto-content-height>
    <div class="flex gap-4 h-full">
      <!-- 左侧规格树 -->
      <div class="w-80 min-w-80">
        <div class="border rounded h-full flex flex-col">
          <div class="p-4 border-b">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium">{{ t('inventory.product_spec.product_spec') }}</h3>
              <ElButton
                v-auth="'inventory_product-spec_add'"
                type="primary"
                link
                @click="addProductSpec"
              >
                + {{ t('inventory.product_spec.add_spec') }}
              </ElButton>
            </div>
          </div>
          <div class="flex-1 overflow-auto p-4">
            <el-tree
              ref="treeRef"
              :highlight-current="true"
              :data="treeData"
              node-key="id"
              :props="{ children: 'children', label: 'label' }"
              default-expand-all
              class="spec-tree"
            >
              <template #default="{ node, data }">
                <div
                  class="custom-tree-node"
                  :class="{ 'selected-node': selectedSpec === data.id && !data.isRoot }"
                  @click="data.isRoot ? null : handleNodeClick(data)"
                >
                  <div class="node-label font-semibold">
                    <el-radio
                      v-if="!data.isRoot"
                      v-model="selectedSpec"
                      :label="data.id"
                      @click.stop
                    >
                      {{ node.label }}
                    </el-radio>
                    <span v-else>{{ node.label }}</span>
                  </div>
                  <div v-if="!data.isRoot && selectedSpec === data.id" class="flex gap-1">
                    <ElButton
                      type="primary"
                      link
                      size="small"
                      :disabled="getSpecById(data.id)?.source_type === 'SYSTEM'"
                      v-auth="'inventory_product-spec_edit'"
                      @click.stop="editProductSpec(data)"
                    >
                      {{ t('common.edit') }}
                    </ElButton>
                    <ElButton
                      link
                      type="danger"
                      size="small"
                      :disabled="getSpecById(data.id)?.source_type === 'SYSTEM'"
                      v-auth="'inventory_product-spec_delete'"
                      @click="deleteSpec(getSpecById(data.id))"
                    >
                      {{ t('common.del') }}
                    </ElButton>
                  </div>
                </div>
              </template>
            </el-tree>
          </div>
        </div>
      </div>

      <!-- 右侧规格值列表 -->
      <div class="flex-1">
        <div class="border rounded h-full flex flex-col">
          <div class="p-4 border-b">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium">{{ t('inventory.product_spec.product_spec_value') }}</h3>
              <ElButton
                v-auth="'inventory_product-spec_value-add'"
                v-if="selectedSpec"
                type="primary"
                @click="addSpecValue"
              >
                <i class="iconfont icon-tianjia-dianpu mr-1"></i>
                {{ t('employee.addButton') }}
              </ElButton>
            </div>
          </div>
          <div class="flex-1 overflow-auto">
            <el-table
              :data="productSpecValueList"
              style="width: 100%"
              height="100%"
              :header-cell-style="{
                background: '#F6F8FC',
                color: '#323232'
              }"
            >
              <template #empty>
                <el-empty :description="t('inventory.product_spec.none_table')" />
              </template>
              <el-table-column
                v-for="column in tableColumns"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                :width="column.width"
                :min-width="column.minWidth"
                :fixed="column.fixed"
                :show-overflow-tooltip="column.showOverflowTooltip"
              >
                <template #default="scope" v-if="column.slot">
                  <template v-if="column.slot === 'operate'">
                    <ElButton
                      :disabled="scope.row.source_type === 'SYSTEM'"
                      link
                      :style="scope.row.source_type === 'SYSTEM' ? 'color: #999' : 'color: #409EFF'"
                      v-auth="'inventory_product-spec_value-edit'"
                      @click="editSpecValue(scope.row)"
                    >
                      {{ t('common.edit') }}
                    </ElButton>
                    <ElButton
                      :disabled="scope.row.source_type === 'SYSTEM'"
                      link
                      type="danger"
                      v-auth="'inventory_product-spec_value-delete'"
                      @click="deleteSpecValue(scope.row)"
                    >
                      {{ t('common.del') }}
                    </ElButton>
                  </template>
                  <template v-else-if="column.slot === 'status'">
                    <div class="flex items-center">
                      <div
                        class="w-2.5 h-2.5 rounded-full mr-2"
                        :style="{ backgroundColor: scope.row.status === 'OPEN' ? '#67C23A' : '#FF69B4' }"
                      ></div>
                      {{ t(`inventory.product_spec.${scope.row.status}`) }}
                    </div>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="p-4 border-t">
            <el-pagination
              v-model:current-page="pagination.currentPage"
              v-model:page-size="pagination.pageSize"
              :page-sizes="[20, 30, 50, 100]"
              :total="pagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<style scoped>
.spec-tree {
  :deep(.el-tree-node__content) {
    height: 40px;
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  cursor: pointer;
}

.node-label {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.selected-node {
  :deep(.el-tree-node__content) {
    background-color: #f0f7ff !important;
  }
}
</style>
