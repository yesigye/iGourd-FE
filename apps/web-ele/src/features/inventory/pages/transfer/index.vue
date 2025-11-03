<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@igourd/stores';
import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  Page,
  ElSelect,
  ElOption,
} from '@igourd/common-ui';
import { ArrayDown } from '@igourd/icons';
import { useI18n } from '@igourd/locales';
import { AuditDialog } from '#/components';
import { reviewTransferStatus } from '@@/inventory/apis';
import { useLanguage } from '#/hooks';
import { useEnum } from '#/hooks';

import { useInventoryTransferList } from '../../hooks/transfer/list';
const { transferStatus } = useEnum();

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
  gridApi,
  Drawer,
  drawerApi,
  handleEdit,
  handleCreate,
  handleBatchDelete,
  canBatchOperate,
  handleDelete,
} = useInventoryTransferList();

const currentRow = ref();
const auditDialogRef = ref();
const openModal = (row, item) => {
  switch (row.transfer_type) {
    case 'TRANSFER_OUT_ONLY':
      if (
        row.review_status === 'PENDING' &&
        item.value === 'REJECTED'
      ) {
        currentRow.value = row;
        auditDialogRef.value.openModal();
      } else if (
        row.review_status === 'PENDING' &&
        item.value === 'APPROVED'
      ) {
        const param = {
          handler_type: 'SOURCE_REVIEW',
          id: row.id,
          merchant_id: currentLoginUserApp.owner_id,
          review_status: 'APPROVED',
        };
        reviewTransferStatus(param).then(() => {
          auditDialogRef.value.closeModal();
          gridApi.reload();
        });
      }
      break;
    case 'TRANSFER_IN_ONLY':
      if (
        row.destination_review_status === 'PENDING' &&
        item.value === 'REJECTED'
      ) {
        currentRow.value = row;
        auditDialogRef.value.openModal();
      } else if (
        row.destination_review_status === 'PENDING' &&
        item.value === 'APPROVED'
      ) {
        const param = {
          handler_type: 'DESTINATION_REVIEW',
          id: row.id,
          merchant_id: currentLoginUserApp.owner_id,
          destination_review_status: 'APPROVED',
        };
        reviewTransferStatus(param).then(() => {
          auditDialogRef.value.closeModal();
          gridApi.reload();
        });
      }
      break;
    case 'TRANSFER_SAME_STORE':

      break;
    case 'TRANSFER_DIFFERENT_STORE':
      break;
  }
};

const handleconfirm = (data:any) => {
  const row = currentRow.value;
  let params = null
  switch (row.transfer_type) {
    case 'TRANSFER_OUT_ONLY':
      params = {
        review_status:"REJECTED",
        id:row.id,
        review_opinion:data.review_opinion,
        handler_type:"SOURCE_REVIEW"
      }
      break;
    case 'TRANSFER_IN_ONLY':
      params = {
        destination_review_status:"REJECTED",
        id:row.id,
        review_opinion:data.review_opinion,
        handler_type:"DESTINATION_REVIEW"
      }

      break;
    case 'TRANSFER_SAME_STORE':
       params = {
        destination_review_status:"REJECTED",
        id:row.id,
        review_opinion:data.review_opinion,
        handler_type:"DESTINATION_REVIEW"
      }
      break;
    case 'TRANSFER_DIFFERENT_STORE':
      params = {
        destination_review_status:"REJECTED",
        id:row.id,
        review_opinion:data.review_opinion,
        handler_type:"DESTINATION_REVIEW"
      }
      break;
  }
  reviewTransferStatus(params).then(() => {
    auditDialogRef.value.closeModal();
    gridApi.reload();
  });
};
// 过滤出可执行的操作
const filterOpt = (keys) => {
  const list = transferStatus.filter((item) => keys.indexOf(item.value) >= 0);
  return list;
};
const getLabel = (row) => {
  let currentStatus = '';
  //调拨类型
  switch (row.transfer_type) {
    case 'TRANSFER_OUT_ONLY':
      currentStatus = row.status;
      break;
    case 'TRANSFER_IN_ONLY':
      currentStatus = row.destination_status;
      break;
    case 'TRANSFER_SAME_STORE':
      currentStatus = row.status;
      break;
    case 'TRANSFER_DIFFERENT_STORE':
      currentStatus = row.status;
      break;
  }
  return getEnumLabel(transferStatus, currentStatus);
};

//获取操作状态
const getOperateStatus = computed(() => (row) => {
  let status = "";

  switch (row.transfer_type) {
    case 'TRANSFER_OUT_ONLY':
      status = row['status'];
      break;
    case 'TRANSFER_IN_ONLY':
       status = row['destination_status'];
      break;
    case 'TRANSFER_SAME_STORE':
      status = row['destination_status'];

      break;
    case 'TRANSFER_DIFFERENT_STORE':
      status = row['destination_status'];
      break;
  }
  return status;
});
//获取状态选项
const getStatusOptions = computed(() => (row) => {
  const baseOptions = [{ value: 'CREATED', label: 'Created', key: 'created' }];

  //调拨类型
  switch (row.transfer_type) {
    case 'TRANSFER_OUT_ONLY':
      return filterOpt(['OUTBOUND']);
    case 'TRANSFER_IN_ONLY':
      // 入库 看 destination_status 状态
      if (row.destination_status == 'CREATED') {
        return filterOpt(['CREATED', 'INBOUND']);
      } else {
        return filterOpt(['INBOUND']);
      }
      break;

    case 'TRANSFER_SAME_STORE':
      if (row.status == 'CREATED') {
        return filterOpt(['OUTBOUND']);
      } else if (row.status == 'OUTBOUND') {
        return filterOpt(['INBOUND']);
      }
      break;
    case 'TRANSFER_DIFFERENT_STORE':
      if (row.source_merchant_id === currentLoginUserApp.owner_id) {
        // 源门店（出库）选项
        if (row.status != 'CREATED') {
          return [
            { value: 'OUTBOUND', label: 'Transfer Out', key: 'transfer_out' },
            {
              value: 'REFUSED_OUTBOUND',
              label: 'Reject Out',
              key: 'reject_out',
            },
          ];
        }
        return [
          ...baseOptions,
          { value: 'OUTBOUND', label: 'Transfer Out', key: 'transfer_out' },
          // { value: 'REFUSED_OUTBOUND', label: 'Reject Out', key: 'reject_out' }
        ];
      } else if (
        row.destination_merchant_id === currentLoginUserApp.owner_id &&
        row.status === 'OUTBOUND' &&
        row.review_status === 'APPROVED'
      ) {
        // 目标门店（入库）选项
        if (row.status != 'CREATED') {
          return [
            { value: 'INBOUND', label: 'Transfer In', key: 'transfer_in' },
            // { value: 'REFUSED_INBOUND', label: 'Reject In', key: 'reject_in' }
            { value: 'OUTBOUND', label: 'Transfer Out', key: 'transfer_out' },
          ];
        }
        return [
          ...baseOptions,
          { value: 'INBOUND', label: 'Transfer In', key: 'transfer_in' },
          // { value: 'REFUSED_INBOUND', label: 'Reject In', key: 'reject_in' }
        ];
      } else {
        if (row.status != 'CREATED') {
          return [
            { value: 'INBOUND', label: 'Transfer In', key: 'transfer_in' },
            { value: 'OUTBOUND', label: 'Transfer Out', key: 'transfer_out' },
            // { value: 'REFUSED_INBOUND', label: 'Reject In', key: 'reject_in' }
            {
              value: 'REFUSED_OUTBOUND',
              label: 'Reject Out',
              key: 'reject_out',
            },
          ];
        }
        return [
          ...baseOptions,
          { value: 'INBOUND', label: 'Transfer In', key: 'transfer_in' },
          // { value: 'REFUSED_INBOUND', label: 'Reject In', key: 'reject_in' },
          { value: 'OUTBOUND', label: 'Transfer Out', key: 'transfer_out' },
          // { value: 'REFUSED_OUTBOUND', label: 'Reject Out', key: 'reject_out' }
        ];
      }

    default:
      return baseOptions;
  }

  return transferStatus;
});
const handleStatusChange = async (row, value) => {
  const params = {
    ...row,
    ...value,
  };
  drawerApi.setData(params).open();
};
//获取审核状态
const getReviewStatus = computed(() => (row) => {
  if (row.transfer_type === 'TRANSFER_OUT_ONLY') {
    return row['review_status'];
  }
  if (row.transfer_type === 'TRANSFER_IN_ONLY') {
    return row['destination_review_status'];
  }
  if (row.transfer_type === 'TRANSFER_DIFFERENT_STORE') {
    if (row.source_merchant_id === currentLoginUserApp.owner_id)
      return row['review_status'];
    if (row.destination_merchant_id === currentLoginUserApp.owner_id)
      return row['destination_review_status'];
  }
  if (row.transfer_type === 'TRANSFER_SAME_STORE') {
    if (row.status !== 'OUTBOUND') {
      return row['review_status'];
    }
    return row['destination_review_status'];
  }
});

const checkOperate = (row) => {
  let flag = true;
  //调拨类型
  switch (row.transfer_type) {
    case 'TRANSFER_OUT_ONLY':
      if (row.status === 'OUTBOUND' ||  row.status==="REFUSED_OUTBOUND") {
        flag = false;
      }
      break;
    case 'TRANSFER_IN_ONLY':
      if (row.destination_status === 'INBOUND' || row.destination_status==="REFUSED_INBOUND") {
        flag = false;
      }
      break;
    case 'TRANSFER_SAME_STORE':
      if (row.destination_status === 'INBOUND') {
        flag = false;
      }

      break;
    case 'TRANSFER_DIFFERENT_STORE':
      if (row.destination_status === 'INBOUND') {
        flag = false;
      }

      break;
  }
  return flag;
};
// 判断审核操作
const checkReviewOperate = (row:any) => {
  if(row.id=="1984250235206053890"){
    debugger
  }
  let flag = false;
  //调拨类型
  switch (row.transfer_type) {
    case 'TRANSFER_OUT_ONLY':
      if (row.status === 'OUTBOUND') {
         flag = true;
      }
      break;
    case 'TRANSFER_IN_ONLY':
      if (row.destination_status === 'INBOUND' && row.destination_review_status ==='PENDING') {
        flag = true;
      }
      break;
    case 'TRANSFER_SAME_STORE':
      if (row.destination_status === 'INBOUND') {
        flag = true;
      }

      break;
    case 'TRANSFER_DIFFERENT_STORE':
      if (row.destination_status === 'INBOUND') {
        flag = true;
      }
      break;
  }
  return flag;
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
        <ElDropdown v-if="checkOperate(row)">
          <span class="custom-dropdown">
            {{ getLabel(row) }}
            <ElIcon class="el-icon--right">
              <ArrayDown />
            </ElIcon>
          </span>
          <template #dropdown>
            <ElDropdownMenu>
              <template
                v-for="item in getStatusOptions(row)"
                :key="item?.value"
              >
                <ElDropdownItem @click="() => handleStatusChange(row, item)">
                  <div>{{ item.label }}</div>
                </ElDropdownItem>
              </template>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
        <span v-if="getOperateStatus(row) ==='OUTBOUND' || getOperateStatus(row) === 'INBOUND'"  class="review-approved"> {{ getLabel(row) }}</span>
        <span v-if="getOperateStatus(row) ==='REFUSED_OUTBOUND' || getOperateStatus(row) ==='REFUSED_INBOUND'" class="review-rejected"> {{ getLabel(row) }}</span>
      </template>
      <template #review_status="{ row }">
        <ElDropdown v-if="checkReviewOperate(row)">
          <span class="custom-dropdown">
            {{ getEnumLabel(operationOpt, getReviewStatus(row)) }}
            <ElIcon class="el-icon--right">
              <ArrayDown />
            </ElIcon>
          </span>
          <template #dropdown>
            <ElDropdownMenu>
              <template v-for="item in operationOpt" :key="item?.value">
                <ElDropdownItem @click="() => openModal(row, item)">
                  <div>{{ item.label }}</div>
                </ElDropdownItem>
              </template>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
        <span v-if="getReviewStatus(row) ==='APPROVED'" class="review-approved" >{{ getEnumLabel(operationOpt, getReviewStatus(row)) }}</span>
        <span v-if="getReviewStatus(row) ==='REJECTED'"  class="review-rejected" >{{ getEnumLabel(operationOpt, getReviewStatus(row)) }}</span>
         <span v-if="getReviewStatus(row) ==='PENDING' && !checkReviewOperate(row)"   >{{ getEnumLabel(operationOpt, getReviewStatus(row)) }}</span>
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
