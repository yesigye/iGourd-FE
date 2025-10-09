<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useRole } from '@@/employee/hooks';

defineOptions({
  name: 'IRole',
});

const { t } = useI18n();
const { Grid, Drawer, handleEdit, canBatchOperate, handleBatchDelete } =
  useRole();
</script>

<template>
  <Page auto-content-height>
    <Grid>
    <template #table-actions>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('employee.addRole') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.detail') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
