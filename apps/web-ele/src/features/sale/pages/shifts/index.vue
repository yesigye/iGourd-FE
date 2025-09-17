<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useSaleShifts } from '@@/sale/hooks';

defineOptions({
  name: 'ISaleShifts',
});

const { t } = useI18n();

const { Grid, Drawer, handleEdit, handleBatchDelete, canBatchOperate } =
  useSaleShifts();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary">
          {{ t('sale.addSaleShifts') }}
        </ElButton>
        <ElButton type="default">
          {{ t('sale.export') }}
        </ElButton>
        <ElButton type="danger" v-if="canBatchOperate">
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #operation="{ row }">
        <ElButton type="text">
          {{ t('common.detail') }}
        </ElButton>
        <ElButton
          v-if="row.status === 'ACTIVE'"
          type="text"
          @click="handleEdit(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton v-if="row.status === 'ACTIVE'" type="text">
          {{ t('sale.endShift') }}
        </ElButton>
        <ElButton v-if="row.status === 'COMPLETED'" type="text">
          {{ t('sale.startShift') }}
        </ElButton>
        <ElButton
          v-if="['ACTIVE', 'COMPLETED'].includes(row.status)"
          type="text"
          @click="handleBatchDelete(row)"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>

    <Drawer />
  </Page>
</template>
