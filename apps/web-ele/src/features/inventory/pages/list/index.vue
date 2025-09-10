<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <el-button
          v-auth="'inventory_list_add'"
          type="primary"
          @click="handleAdd"
        >
          <i class="iconfont icon-tianjia-dianpu"></i>
          {{ t('employee.addButton') }}
        </el-button>
        <el-button
          v-if="selectedRows.length"
          v-auth="'inventory_list_delete'"
          type="danger"
          plain
          @click="handleDelete"
        >
          <i class="iconfont icon-shanchu2"></i>
          {{ t('employee.deleteButton') }}
        </el-button>
        <el-button
          v-if="selectedRows.length"
          v-auth="'inventory_list_clear'"
          type="warning"
          plain
          @click="handleClear"
        >
          <i class="iconfont icon-qingkong"></i>
          {{ t('inventory.clearStock') }}
        </el-button>
        <el-button @click="showFieldSettings">
          <i class="iconfont icon-liebiaoshezhixianshi"></i>
          {{ t('employee.field') }}
        </el-button>
      </template>
      <template #cost_price="{ row }">
        {{ formatCurrency(row.cost_price) }}
      </template>
      <template #total_value="{ row }">
        {{ formatCurrency(row.total_value) }}
      </template>
      <template #action="{ row }">
        <el-tooltip
          content="Edit"
          placement="top"
          :show-after="600"
          :enterable="false"
        >
          <el-button
            link
            type="primary"
            size="small"
            @click="handleEdit(row.id)"
          >
            <i class="iconfont icon-icon_Edit"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip
          content="Detail"
          placement="top"
          :show-after="600"
          :enterable="false"
        >
          <el-button
            link
            type="primary"
            size="small"
            @click="handleDetail(row.id)"
          >
            <i class="iconfont icon-chakan"></i>
          </el-button>
        </el-tooltip>
      </template>
    </Grid>
  </Page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { Page } from '@igourd/common-ui';
import { useInventoryList } from '../../hooks/use-inventory-list';

const { t } = useI18n();

// 使用列表钩子
const { Grid, gridEvents } = useInventoryList();

// 选中的行
const selectedRows = ref<any[]>([]);

// 格式化货币
const formatCurrency = (value: number) => {
  if (!value) return '0.00';
  return `¥${Number(value).toFixed(2)}`;
};

// 添加
const handleAdd = () => {
  // TODO: 实现添加功能
  console.log('添加库存');
};

// 编辑
const handleEdit = (id: string) => {
  // TODO: 实现编辑功能
  console.log('编辑库存:', id);
};

// 详情
const handleDetail = (id: string) => {
  // TODO: 实现详情功能
  console.log('查看详情:', id);
};

// 删除
const handleDelete = () => {
  const ids = selectedRows.value.map(row => row.id);
  gridEvents.onDelete(ids);
};

// 清空库存
const handleClear = () => {
  const ids = selectedRows.value.map(row => row.id);
  gridEvents.onClear(ids);
};

// 显示字段设置
const showFieldSettings = () => {
  // TODO: 实现字段设置功能
  console.log('显示字段设置');
};

</script>

<style lang="scss" scoped>
// 可以添加自定义样式
</style>
