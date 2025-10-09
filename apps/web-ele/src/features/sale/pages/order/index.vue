<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useSaleOrder } from '@@/sale/hooks';

defineOptions({
  name: 'ISaleOrder',
});

const { t } = useI18n();
const {
  Grid,
  Drawer,
  handleEdit,
  canBatchOperate,
  handleBatchDelete,
  handleCancel,
} = useSaleOrder();
</script>

<template>
  <Page auto-content-height>
    <Grid>
    <template #table-actions>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #operation="{ row }">
        <ElButton type="text" v-if="row.status === 'PAID'" @click="handleEdit(row)">
          {{ t('common.print') }}
        </ElButton>
        <ElButton type="text" v-if="row.status === 'PAID'" @click="handleEdit(row)">
          {{ t('common.print-receipt') }}
        </ElButton>
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.details') }}
        </ElButton>
        <ElButton type="text" v-if="row.status === 'PENDING'" @click="handleEdit(row)">
          {{ t('common.pay') }}
        </ElButton>
        <ElButton type="text" v-if="row.status !== 'PENDING'" @click="handleEdit(row)">
          {{ t('common.refund') }}
        </ElButton>
        <ElButton type="text" v-if="row.status !== 'PENDING'" @click="handleCancel(row)">
          {{ t('common.cancel') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
