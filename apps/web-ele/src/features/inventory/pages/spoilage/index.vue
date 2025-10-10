<script setup lang="ts">
import { ref } from 'vue';

import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { AuditDialog } from '#/components';

import { approveSpoilage, rejectSpoilage } from '../../apis/spoilage';
import { useInventorySpoilageList } from '../../hooks/spoilage/list';

defineOptions({
  name: 'IInventorySpoilage',
});
const { currentLoginUserApp } = useUserStore();
const auditDialogRef = ref();
const { t } = useI18n();

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
const openModal = (row) => {
  currentRow.value = row;
  auditDialogRef.value.openModal();
};

const handleconfirm = (data) => {
  data.id = currentRow.value.id;
  data.merchant_id = currentLoginUserApp.owner_id;
  data.status = data.review_status;
  if (!data.review_opinion) {
    data.review_opinion = '';
  }
  if (data.review_status === 'APPROVED') {
    approveSpoilage(data).then(() => {
      auditDialogRef.value.closeModal();
      gridApi.reload();
    });
  } else {
    rejectSpoilage(data).then(() => {
      auditDialogRef.value.closeModal();
      gridApi.reload();
    });
  }
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
        <ElButton type="text" @click="openModal(row)">
          <i class="iconfont icon-daishenhe status_icon"></i>
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
    </Grid>
    <Drawer />
    <!--调用公共审核框 -->
    <AuditDialog ref="auditDialogRef" @confirm="handleconfirm" />
  </Page>
</template>
