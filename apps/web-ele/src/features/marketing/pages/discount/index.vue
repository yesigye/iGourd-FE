<script setup lang="ts">
import { ref } from 'vue';

import { ElButton, ElMessage, ElSwitch, Page } from '@igourd/common-ui';

import { updateDiscountStatusApi } from '@@/marketing/apis/discount';
import type { DiscountRow } from '@@/marketing/types';

import { useI18n } from '@igourd/locales';

import { useDiscount } from '@@/marketing/hooks';

defineOptions({
  name: 'IDiscount',
});
const { t } = useI18n();
const { Grid, Drawer, handleEdit, canBatchOperate, handleBatchDelete } =
  useDiscount();

const loadingRowIds = ref<number[]>([]);

// added a method to handle the toggle of the enabled switch
const handleToggleEnabled = async (row: DiscountRow, value: number) => {
  // add loading state
  loadingRowIds.value.push(row.id);
  try {
    await updateDiscountStatusApi({
      promotion_id: row.id,
      enabled: value,
    });
    ElMessage.success(
      value ? t('discount.message.enabled') : t('discount.message.disabled'),
    );
  } catch (err) {
    // revert UI value
    row.enabled = value === 1 ? 0 : 1;
    ElMessage.error(t('discount.message.update-failed'));
  } finally {
    loadingRowIds.value = loadingRowIds.value.filter((id) => id !== row.id);
  }
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('common.create') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <!-- added custom rendering for the 'enabled' field using a switch component -->
      <!-- backend API should return an enabled (or similar) boolean field -->
      <template #enabled="{ row }">
        <ElSwitch
          v-model="row.enabled"
          :active-value="1"
          :inactive-value="0"
          active-text="Yes"
          inactive-text="No"
          @change="(val) => handleToggleEnabled(row, val)"
        />
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
