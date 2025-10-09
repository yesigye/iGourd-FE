<script lang="ts" setup>
import { ElButton, Page } from '@igourd/common-ui';
import { Check, CircleX } from '@igourd/icons';
import { useI18n } from '@igourd/locales';

import { useEmployee } from '@@/employee/hooks';

defineOptions({
  name: 'IEmployeeList',
});

const { t } = useI18n();

const { Grid, Drawer, handleEdit, handleBatchDelete, canBatchOperate } =
  useEmployee();

// 状态切换处理
async function handleStatusChange(row: any) {
  try {
    if (row.status === 'FROZEN') {
      // 解冻
      const { unfreezeEmployeeApi } = await import('@@/employee/apis');
      const response = await unfreezeEmployeeApi({ user_id: row.user_id });
      if (response.code === 'SUCCESS') {
        row.status = 'ACTIVE';
        // 这里可以添加成功提示
      } else {
        // 这里可以添加错误提示
      }
    } else {
      // 冻结
      const { freezeEmployeeApi } = await import('@@/employee/apis');
      const response = await freezeEmployeeApi({ user_id: row.user_id });
      if (response.code === 'SUCCESS') {
        row.status = 'FROZEN';
        // 这里可以添加成功提示
      } else {
        // 这里可以添加错误提示
      }
    }
  } catch (error) {
    console.error('状态切换失败:', error);
  }
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
    <template #table-actions>
        <ElButton type="primary">
          {{ t('employee.add') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
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
          :inactive-icon="CircleX"
          @change="handleStatusChange(row)"
          :disabled="row.roles.some((role) => role.type === 'SUPER_ADMIN')"
        />
      </template>

      <!-- 操作列插槽 -->
      <template #action="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('employee.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleBatchDelete()">
          {{ t('employee.delete') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
