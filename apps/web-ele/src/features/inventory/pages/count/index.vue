<script setup lang="ts">
import { ref } from 'vue';

import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  Page,
} from '@igourd/common-ui';
import { ArrayDown } from '@igourd/icons';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { AuditDialog } from '#/components';
import { useLanguage } from '#/hooks';

import { updateCountStatus } from '../../apis/count';
import { useInventoryCountList } from '../../hooks/count/list';

defineOptions({
  name: 'IInventoryCount',
});
const { t } = useI18n();
const { currentLoginUserApp } = useUserStore();

const operationOpt = ref();
useLanguage('common.review-status-enum').then((res) => {
  operationOpt.value = res;
});

const auditDialogRef = ref();

const {
  Grid,
  gridApi,
  Drawer,
  drawerApi,
  handleEdit,
  handleBatchDelete,
  canBatchOperate,
  handleDelete,
} = useInventoryCountList();
const currentRow = ref();
const openModal = (row, item) => {
  if (row.review_status.value === 'PENDING' && item.value === 'REJECTED') {
    currentRow.value = row;
    auditDialogRef.value.openModal();
  } else if (
    row.review_status.value === 'PENDING' &&
    item.value === 'APPROVED'
  ) {
    const param = {
      id: row.id,
      merchant_id: currentLoginUserApp.owner_id,
      review_status: 'APPROVED',
    };
    updateCountStatus(param).then(() => {
      gridApi.reload();
    });
  }
};
const handleDetail = (row) => {
  handleEdit(row);
};
const handleconfirm = (data) => {
  data.id = currentRow.value.id;
  data.merchant_id = currentLoginUserApp.owner_id;
  data.review_status = 'REJECTED';
  updateCountStatus(data).then(() => {
    auditDialogRef.value.closeModal();
    gridApi.reload();
  });
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('common.add') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #modal="{ row }">
        <ElDropdown v-if="row.review_status.value === 'PENDING'">
          <span class="custom-dropdown">
            {{ row.review_status.label }}
            <ElIcon class="el-icon--right">
              <ArrayDown />
            </ElIcon>
          </span>
          <template #dropdown>
            <ElDropdownMenu>
              <template v-for="item in operationOpt" :key="item?.value">
                <ElDropdownItem
                  v-if="item.value !== 'PENDING'"
                  @click="() => openModal(row, item)"
                >
                  <div>{{ item.label }}</div>
                </ElDropdownItem>
              </template>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
        <span
          v-if="row.review_status.value === 'APPROVED'"
          style="color: var(--el-color-success)"
          >{{ row.review_status.label }}</span
        >
        <span
          v-if="row.review_status.value === 'REJECTED'"
          style="color: var(--el-color-danger)"
          >{{ row.review_status.label }}</span
        >
      </template>

      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleDetail(row)">
          {{ t('common.detail') }}
        </ElButton>
        <!--
        <ElButton type="text" @click="handleDelete([row.id])">
          {{ t('common.delete') }}
        </ElButton>-->
      </template>
    </Grid>
    <Drawer />
    <!--调用公共审核框 -->
    <AuditDialog ref="auditDialogRef" @confirm="handleconfirm" />
  </Page>
</template>
<style scoped>
.custom-dropdown:focus-visible {
  outline: unset;
}
</style>
