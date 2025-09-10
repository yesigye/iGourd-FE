<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton 
          v-auth="'employee_role_add'"
          type="primary"
          @click="handleAdd"
        >
          {{ t('employee.addButton') }}
        </IgourdButton>
      </template>
    </Grid>
  </Page>
  <Drawer />
</template>

<script setup lang="ts">
import { Page, IgourdButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useEmployeeRoleList } from '../../hooks/use-employee-role-list';

defineOptions({
  name: 'IEmployeeRole',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi } = useEmployeeRoleList();

// 添加角色
const handleAdd = () => {
  drawerApi.open();
};
</script>

