<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@igourd/stores';
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
import { AuditDialog } from '#/components';
import { reviewTransferStatus } from '@@/inventory/apis';
import { useLanguage } from '#/hooks';

import { useInventoryTransferList } from '../../hooks/transfer/list';

defineOptions({
  name: 'IInventoryTransfer',
});

const operationOpt = ref();
useLanguage('common.review-status-enum').then((res) => {
  operationOpt.value = res;
});
const { t } = useI18n();
import { getEnumLabel } from '#/utils/global';
const { currentLoginUserApp } = useUserStore();
const {
  Grid,
  Drawer,
  handleEdit,
  handleCreate,
  handleBatchDelete,
  canBatchOperate,
  handleDelete,
} = useInventoryTransferList();

const currentRow = ref();
const openModal = (row, item) => {
  if (row.review_status === 'PENDING' && item.value === 'REJECTED') {
    currentRow.value = row;
    auditDialogRef.value.openModal();
  } else if (row.review_status === 'PENDING' && item.value === 'APPROVED') {
    const param = {
      handler_type: 'DESTINATION_STATUS',
      id: row.id,
      merchant_id: currentLoginUserApp.owner_id,
      status: 'APPROVED',
    };
    reviewTransferStatus(param).then(() => {
      auditDialogRef.value.closeModal();
      gridApi.reload();
    });
  }
};

const handleconfirm = (data) => {
  data.id = currentRow.value.id;
  data.merchant_id = currentLoginUserApp.owner_id;
  data.status = 'REJECTED';
  data.handler_type = 'DESTINATION_STATUS';
  if (!data.review_opinion) {
    data.review_opinion = '';
  }
  reviewTransferStatus(data).then(() => {
    auditDialogRef.value.closeModal();
    gridApi.reload();
  });
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary" @click="handleCreate()">
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

      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleDelete([row.id])">
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #status="{ row }">
        {{ row.status?.label || '--' }}
      </template>
      <template #review_status="{ row }">
        <ElDropdown v-if="row.review_status === 'PENDING'">
          <span class="custom-dropdown">
            {{ getEnumLabel(operationOpt, row.review_status) }}
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
          v-if="row.review_status === 'APPROVED'"
          style="color: var(--el-color-success)"
          >{{ getEnumLabel(operationOpt, row.review_status) }}</span
        >
        <span
          v-if="row.review_status === 'REJECTED'"
          style="color: var(--el-color-danger)"
          >{{ getEnumLabel(operationOpt, row.review_status) }}</span
        >
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
