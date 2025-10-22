<script setup lang="ts">
import { ref } from 'vue';

import {
  ElButton,
  ElDatePicker,
  ElMessage,
  Page,
  useIgourdModal,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { manualGenerateSettlementApi } from '@@/sale/apis';
import { useSaleEnter } from '@@/sale/hooks';
import dayjs from 'dayjs';

defineOptions({
  name: 'ISaleEnter',
});

const { t } = useI18n();

const { Grid, Drawer, handleEdit, handleBatchDelete, canBatchOperate } =
  useSaleEnter();
const [Modal, modalApi] = useIgourdModal({
  title: t('enter.generate-settlement'),
  onConfirm: () => {
    handleSubmit();
  },
});
// 默认当前时间 使用dayjs 格式化日期为 YYYY-MM-DD
const settlementDate = ref(dayjs().format('YYYY-MM-DD'));
const handleGenerateSettlement = () => {
  modalApi.open();
};
// 生成日结记录
const handleSubmit = async () => {
  if (!settlementDate.value) {
    ElMessage.warning(t('enter.tips-message'));
    return;
  }
  try {
    await manualGenerateSettlementApi({
      settlement_date: settlementDate.value,
    });
    ElMessage.success(t('enter.success-message'));
    modalApi.close();
  } catch (error: any) {
    console.error('日结记录生成失败', error);
  }
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #operation="{ row }">
        <ElButton type="text">
          {{ t('common.detail') }}
        </ElButton>
        <ElButton
          v-if="row.status === 'DRAFT'"
          type="text"
          @click="handleEdit(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton v-if="row.status === 'DRAFT'" type="text">
          {{ t('sale.confirm') }}
        </ElButton>
        <ElButton
          v-if="['DRAFT', 'CONFIRMED'].includes(row.status)"
          type="text"
          @click="handleBatchDelete(row)"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #table-actions>
        <ElButton type="primary" @click="handleGenerateSettlement()">
          {{ t('enter.generate-settlement') }}
        </ElButton>
      </template>
    </Grid>

    <Drawer />
    <Modal>
      <p class="mb-2.5">{{ t('enter.date') }}:</p>
      <ElDatePicker
        v-model="settlementDate"
        style="width: 100%"
        type="date"
        value-format="YYYY-MM-DD"
        class="w-full"
      />
    </Modal>
  </Page>
</template>
