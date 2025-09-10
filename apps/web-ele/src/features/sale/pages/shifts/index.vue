<template>
  <div class="sale-shifts">
    <IgourdVxeGrid
      :grid-options="gridOptions"
      :grid-events="gridEvents"
      :form-options="formOptions"
    />
    
    <!-- 添加/编辑抽屉 -->
    <SaleShiftsDrawer
      v-if="drawerVisible"
      :data="currentData"
      :mode="drawerMode"
      @success="handleDrawerSuccess"
      @cancel="handleDrawerCancel"
    />
    
    <!-- 详情抽屉 -->
    <SaleShiftsDetail
      v-if="detailVisible"
      :data="currentData"
      @close="handleDetailClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/ui';
import { useSaleShiftsList } from '../../hooks';
import { SaleShiftsDrawer, SaleShiftsDetail } from '../../components';

// 使用列表逻辑
const {
  tableData,
  total,
  loading,
  selectedRows,
  columns,
  searchFormSchema,
  getSaleShiftsList,
  handleSearch,
  handleReset,
  handlePageChange,
  handlePageSizeChange,
  handleSelectionChange,
  handleDelete,
  handleExport,
  handleStartShift,
  handleEndShift,
  init,
} = useSaleShiftsList();

// 配置表格
const { gridOptions, gridEvents } = useIgourdVxeGrid({
  columns: columns.value,
  data: tableData,
  loading,
  total,
  searchFormSchema,
  onSearch: handleSearch,
  onReset: handleReset,
  onPageChange: handlePageChange,
  onPageSizeChange: handlePageSizeChange,
  onSelectionChange: handleSelectionChange,
  onDelete: handleDelete,
  onExport: handleExport,
});

// 配置搜索表单
const formOptions = {
  schema: searchFormSchema,
  layout: 'inline',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

// 抽屉相关
const drawerVisible = ref(false);
const detailVisible = ref(false);
const drawerMode = ref<'add' | 'edit' | 'view'>('add');
const currentData = ref({});

// 使用抽屉
const [Drawer, drawerApi] = useIgourdDrawer({
  connectedComponent: SaleShiftsDrawer,
});

// 处理添加
const handleAdd = () => {
  currentData.value = {};
  drawerMode.value = 'add';
  drawerApi.setData({}).open();
};

// 处理编辑
const handleEdit = (row: any) => {
  currentData.value = row;
  drawerMode.value = 'edit';
  drawerApi.setData(row).open();
};

// 处理查看
const handleView = (row: any) => {
  currentData.value = row;
  detailVisible.value = true;
};

// 处理开始班次
const handleStartShiftAction = (row: any) => {
  handleStartShift(row);
};

// 处理结束班次
const handleEndShiftAction = (row: any) => {
  handleEndShift(row);
};

// 抽屉成功回调
const handleDrawerSuccess = () => {
  drawerApi.close();
  getSaleShiftsList();
};

// 抽屉取消回调
const handleDrawerCancel = () => {
  drawerApi.close();
};

// 详情关闭回调
const handleDetailClose = () => {
  detailVisible.value = false;
};

// 初始化
onMounted(() => {
  init();
});
</script>

<style scoped>
.sale-shifts {
  height: 100%;
}
</style>

