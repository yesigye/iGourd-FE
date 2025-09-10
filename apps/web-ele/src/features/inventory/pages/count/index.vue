<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <el-button
          v-auth="'inventory_physical_add'"
          type="primary"
          @click="handleAdd"
        >
          <i class="iconfont icon-tianjia-dianpu"></i>
          {{ t('employee.addButton') }}
        </el-button>
        <el-button
          v-auth="'inventory_physical_delete'"
          type="danger"
          plain
          :disabled="!selectedRows.length"
          @click="handleDelete"
        >
          <i class="iconfont icon-shanchu2"></i>
          {{ t('employee.deleteButton') }}
        </el-button>
        <el-button @click="showFieldSettings">
          <i class="iconfont icon-liebiaoshezhixianshi"></i>
          {{ t('employee.field') }}
        </el-button>
      </template>
      <template #count_type="{ row }">
        {{ t(`inventory.${row.count_type}`) }}
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ t(`inventory.${row.status}`) }}
        </el-tag>
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
    <Drawer />
  </Page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { Page } from '@igourd/common-ui';
import { useInventoryCountList } from '../../hooks/use-inventory-count-list';
import { useInventoryCountForm } from '../../hooks/use-inventory-count-form';

const { t } = useI18n();

// 使用列表钩子
const { Grid, gridApi, gridEvents } = useInventoryCountList();

// 使用表单钩子
const { Drawer, drawerApi } = useInventoryCountForm();

// 选中的行
const selectedRows = ref([]);

// 获取状态类型
const getStatusType = (status: string) => {
  const statusMap = {
    'PENDING': 'warning',
    'IN_PROGRESS': 'primary',
    'COMPLETED': 'success',
    'CANCELLED': 'danger',
  };
  return statusMap[status] || 'info';
};

// 添加
const handleAdd = () => {
  drawerApi.value?.open({
    title: "{{t('inventory.addCount')}}",
    formData: {},
  });
};

// 编辑
const handleEdit = (id: string) => {
  drawerApi.value?.open({
    title: "{{t('inventory.editCount')}}",
    formData: { id },
  });
};

// 详情
const handleDetail = (id: string) => {
  // TODO: 实现详情页面
  console.log('查看详情:', id);
};

// 删除
const handleDelete = () => {
  const ids = selectedRows.value.map(row => row.id);
  gridEvents.onDelete(ids);
};

// 显示字段设置
const showFieldSettings = () => {
  // TODO: 实现字段设置功能
  console.log('显示字段设置');
};

// 监听表格选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection;
};
</script>

<style lang="scss" scoped>
// 可以添加自定义样式
</style>

