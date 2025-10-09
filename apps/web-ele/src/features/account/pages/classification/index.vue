<template>
  <Page auto-content-height>
    <Grid>
    <template #table-actions>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('common.add') }}
        </ElButton>
        <ElButton type="danger" v-if="canBatchOperate">
          {{ t('common.delete') }}
        </ElButton>
        <ElRadioGroup v-model="filterType" @change="handleFilterChange">
          <ElRadio value="">全部</ElRadio>
          <ElRadio value="REVENUE">收入</ElRadio>
          <ElRadio value="EXPENDITURE">支出</ElRadio>
        </ElRadioGroup>
      </template>

      <template #operation="{ row }">
        <ElButton
          type="text"
          :disabled="row.source_type === 'SYSTEM'"
          @click="handleEdit(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
      </template>
    </Grid>

    <Drawer />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page, ElRadioGroup, ElRadio } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useClassification } from '@@/account/hooks';
import { ref } from 'vue';
const filterType = ref('REVENUE');
defineOptions({
  name: 'IClassification',
});

const { t } = useI18n();
//
const handleFilterChange = (val: string) => {
  filterType.value = val;
  gridApi.reload()
};

const { Grid,gridApi, Drawer, handleEdit, handleBatchDelete, canBatchOperate } =
  useClassification(filterType);
</script>
