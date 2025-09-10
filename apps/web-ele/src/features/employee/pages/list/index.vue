<template>
  <Page auto-content-height>
    <Drawer />
    <Grid>
      <template #table-title>
        <IgourdButton @click="handlerCreate">{{ t('employee.add') }}</IgourdButton>
      </template>
      
      <!-- 登录账号列插槽 -->
      <template #loginAccount="{ row }">
        <div v-for="(item, index) in row.login_ids" :key="index">
          {{ item.country_area_code }} {{ item.login_account }}
        </div>
      </template>
      
      <!-- 角色列插槽 -->
      <template #roles="{ row }">
        <el-tag v-for="(item, index) in row.roles" :key="index" class="mr-1">
          {{ item.name }}
        </el-tag>
      </template>
      
      <!-- 状态列插槽 -->
      <template #status="{ row }">
        <el-switch
          :model-value="row.status === 'ACTIVE' || row.status === 'INIT'"
          class="mt-2"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
          @change="handleStatusChange(row)"
          :disabled="row.roles.some(role => role.type === 'SUPER_ADMIN')"
        />
      </template>
      
      <!-- 操作列插槽 -->
      <template #action="{ row }">
        <IgourdButton 
          type="primary" 
          size="small" 
          @click="handleEdit(row)"
        >
          {{ t('employee.edit') }}
        </IgourdButton>
        <IgourdButton 
          type="danger" 
          size="small" 
          @click="handleDelete(row)"
        >
          {{ t('employee.delete') }}
        </IgourdButton>
      </template>
    </Grid>
  </Page>
</template>

<script lang="ts" setup>
import type { VxeGridListeners } from '#/adapter/vxe-table';

import { IgourdButton, Page, useIgourdDrawer, alert, confirm } from '@igourd/common-ui';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Check, Close } from '@element-plus/icons-vue';

import Drawer from '@@/employee/components/employee-drawer.vue';
import { useEmployeeList, type EmployeeInfo } from '@@/employee/hooks/use-employee-list';
import { useI18n } from '@igourd/locales';

defineOptions({
  name: 'IEmployeeList',
});

const [Drawer, drawerApi] = useIgourdDrawer({
  connectedComponent: Drawer,
});

const { t } = useI18n();

function handlerCreate() {
  drawerApi.setData({}).open();
}

async function handleEdit(row: EmployeeInfo) {
  try {
    // 获取完整的行数据
    const fullRowData = await getRowData(row.user_id);
    drawerApi.setData({ ...fullRowData }).open();
  } catch (error) {
    ElMessage.error(t('employee.editError'));
    console.error('编辑失败:', error);
  }
}

async function handleDelete(row: EmployeeInfo) {
  try {
    const confirmed = await confirm(
      t('employee.deleteConfirm'),
      t('employee.deleteTitle')
    );
    
    if (confirmed) {
      // 执行删除操作
      await deleteRowData(row.user_id);
      ElMessage.success(t('employee.deleteSuccess'));
      
      // 刷新表格
      refreshGrid();
    }
  } catch (error) {
    ElMessage.error(t('employee.deleteError'));
    console.error('删除失败:', error);
  }
}

// 状态切换处理
async function handleStatusChange(row: EmployeeInfo) {
  try {
    if (row.status === 'FROZEN') {
      // 解冻
      const { unfreezeEmployeeApi } = await import('@@/employee/apis');
      const response = await unfreezeEmployeeApi({ user_id: row.user_id });
      if (response.code === 'SUCCESS') {
        row.status = 'ACTIVE';
        ElMessage.success(t('employee.unfreezeSuccess'));
        refreshGrid();
      } else {
        ElMessage.error(response.message || t('employee.unfreezeError'));
      }
    } else {
      // 冻结
      const { freezeEmployeeApi } = await import('@@/employee/apis');
      const response = await freezeEmployeeApi({ user_id: row.user_id });
      if (response.code === 'SUCCESS') {
        row.status = 'FROZEN';
        ElMessage.success(t('employee.freezeSuccess'));
        refreshGrid();
      } else {
        ElMessage.error(response.message || t('employee.freezeError'));
      }
    }
  } catch (error) {
    ElMessage.error(t('employee.freezeError'));
    console.error('状态切换失败:', error);
  }
}

// 获取行数据的函数
async function getRowData(id: string) {
  const { getEmployeeDetailApi } = await import('@@/employee/apis');
  return await getEmployeeDetailApi(id);
}

// 删除数据的函数
async function deleteRowData(id: string) {
  const { deleteEmployeeApi } = await import('@@/employee/apis');
  await deleteEmployeeApi(id);
}

const gridEvents: VxeGridListeners<EmployeeInfo> = {
  cellClick: ({ row }) => {
    // 点击行可以查看详情
    console.log('点击行:', row);
  },
  filterChange({ $grid, filterList }) {
    const query: Record<string, any> = {};
    filterList.forEach((item) => {
      query[item.field] = item.values;
    });
    $grid!.commitProxy('reload', query);
  },
};

const [Grid, { gridRef }] = useEmployeeList({ gridEvents });

// 刷新表格的函数
function refreshGrid() {
  if (gridRef.value) {
    gridRef.value.commitProxy('reload');
  }
}
</script>
