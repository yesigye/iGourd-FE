<script setup lang="ts">
import { ref } from 'vue';

import {
  ElButton,
  Page,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
} from '@igourd/common-ui';

import { ArrayDown } from '@igourd/icons';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { AuditDialog } from '#/components';

import { approveSpoilage, rejectSpoilage } from '../../apis/spoilage';
import { useInventorySpoilageList } from '../../hooks/spoilage/list';
import { useLanguage } from '#/hooks';
import { getEnumLabel } from '#/utils/global';

defineOptions({
  name: 'IInventorySpoilage',
});
const { currentLoginUserApp } = useUserStore();
const auditDialogRef = ref();
const { t } = useI18n();
const operationOpt = ref();
useLanguage('common.review-status-enum').then((res) => {
  operationOpt.value = res;
});


const {
  Grid,
  gridApi,
  Drawer,
  handleEdit,
  handleBatchDelete,
  canBatchOperate,
  handleDelete,
} = useInventorySpoilageList();

const currentRow = ref();
const openModal = (row, item) => {
  if (row.status === 'PENDING' && item.value === 'REJECTED') {
    currentRow.value = row;
    auditDialogRef.value.openModal();
  } else if (row.status === 'PENDING' && item.value === 'APPROVED') {
    const param = {
      id: row.id,
      merchant_id: currentLoginUserApp.owner_id,
      status: 'APPROVED',
    };
    approveSpoilage(param).then(() => {
      auditDialogRef.value.closeModal();
      gridApi.reload();
    });
  }
};

const handleconfirm = (data) => {
  data.id = currentRow.value.id;
  data.merchant_id = currentLoginUserApp.owner_id;
  data.status = 'REJECTED';
  if (!data.review_opinion) {
    data.review_opinion = '';
  }
  rejectSpoilage(data).then(() => {
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
        <ElDropdown v-if="row.status === 'PENDING'">
          <span class="custom-dropdown">
            {{ getEnumLabel(operationOpt,row.status)}}
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
          v-if="row.status === 'APPROVED'"
          style="color: var(--el-color-success)"
          >{{ getEnumLabel(operationOpt,row.status)}}</span
        >
        <span
          v-if="row.status === 'REJECTED'"
          style="color: var(--el-color-danger)"
          >{{ getEnumLabel(operationOpt,row.status)}}</span
        >
      </template>

      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleDelete([row.id])">
          {{ t('common.delete') }}
        </ElButton>
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
