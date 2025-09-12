<template>
  <Page auto-content-height> </Page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer, Page } from '@igourd/common-ui';
// import { useProductList } from '../../hooks';
// import { ProductDrawer, ProductDetail, ProductImport } from '../../components';

// // 使用列表逻辑
// const {
//   tableData,
//   total,
//   loading,
//   selectedRows,
//   columns,
//   searchFormSchema,
//   getProductList,
//   handleSearch,
//   handleReset,
//   handlePageChange,
//   handlePageSizeChange,
//   handleSelectionChange,
//   handleDelete,
//   handleExport,
//   handleImport,
//   init,
// } = useProductList();

// // 配置表格
// const { gridOptions, gridEvents } = useIgourdVxeGrid({
//   columns: columns.value,
//   data: tableData,
//   loading,
//   total,
//   searchFormSchema,
//   onSearch: handleSearch,
//   onReset: handleReset,
//   onPageChange: handlePageChange,
//   onPageSizeChange: handlePageSizeChange,
//   onSelectionChange: handleSelectionChange,
//   onDelete: handleDelete,
//   onExport: handleExport,
// });

// // 配置搜索表单
// const formOptions = {
//   schema: searchFormSchema,
//   layout: 'inline',
//   labelCol: { span: 6 },
//   wrapperCol: { span: 18 },
// };

// // 抽屉相关
// const drawerVisible = ref(false);
// const detailVisible = ref(false);
// const importVisible = ref(false);
// const drawerMode = ref<'add' | 'edit' | 'view'>('add');
// const currentData = ref({});

// // 使用抽屉
// const [Drawer, drawerApi] = useIgourdDrawer({
//   connectedComponent: ProductDrawer,
// });

// // 处理添加
// const handleAdd = () => {
//   currentData.value = {};
//   drawerMode.value = 'add';
//   drawerApi.setData({}).open();
// };

// // 处理编辑
// const handleEdit = (row: any) => {
//   currentData.value = row;
//   drawerMode.value = 'edit';
//   drawerApi.setData(row).open();
// };

// // 处理查看
// const handleView = (row: any) => {
//   currentData.value = row;
//   detailVisible.value = true;
// };

// // 处理导入
// const handleImportAction = () => {
//   importVisible.value = true;
// };

// // 抽屉成功回调
// const handleDrawerSuccess = () => {
//   drawerApi.close();
//   getProductList();
// };

// // 抽屉取消回调
// const handleDrawerCancel = () => {
//   drawerApi.close();
// };

// // 详情关闭回调
// const handleDetailClose = () => {
//   detailVisible.value = false;
// };

// // 导入关闭回调
// const handleImportClose = () => {
//   importVisible.value = false;
// };

// // 导入成功回调
// const handleImportSuccess = () => {
//   importVisible.value = false;
//   getProductList();
// };

// // 初始化
// onMounted(() => {
//   init();
// });
</script>

<style scoped>
.product-list {
  height: 100%;
}
</style>
