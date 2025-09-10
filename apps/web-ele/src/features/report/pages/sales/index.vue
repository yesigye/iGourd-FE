<template>
  <div class="report-sales">
    <IgourdVxeGrid
      :grid-options="gridOptions"
      :grid-events="gridEvents"
      :form-options="formOptions"
    />
    
    <!-- 详情抽屉 -->
    <ReportSalesDetail
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
import { useReportSalesList } from '../../hooks';
import { ReportSalesDetail } from '../../components';

// 使用列表逻辑
const {
  tableData,
  total,
  loading,
  selectedRows,
  columns,
  searchFormSchema,
  getReportSalesList,
  handleSearch,
  handleReset,
  handlePageChange,
  handlePageSizeChange,
  handleSelectionChange,
  handleExport,
  init,
} = useReportSalesList();

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
const detailVisible = ref(false);
const currentData = ref({});

// 处理查看
const handleView = (row: any) => {
  currentData.value = row;
  detailVisible.value = true;
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
.report-sales {
  height: 100%;
}
</style>

