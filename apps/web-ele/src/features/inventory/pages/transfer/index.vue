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
      if (row.review_status === 'PENDING' && item.value === 'REJECTED') {
        currentRow.value = row;
        auditDialogRef.value.openModal();
      } else if (row.review_status === 'PENDING' && item.value === 'APPROVED') {
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
        const params = {
          ...row,
          ...item,
        };
        drawerApi.setData(params).open();
      }

      break;
    case 'TRANSFER_DIFFERENT_STORE':
      if (row.source_merchant_id === currentLoginUserApp.owner_id) {
        if (row.review_status === 'PENDING' && item.value === 'REJECTED') {
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
      } else {
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
          const params = {
            ...row,
            ...item,
          };
          drawerApi.setData(params).open();
        }
      }
      break;
  }
};

const handleconfirm = (data: any) => {
  const row = currentRow.value;
  let params = null;
  switch (row.transfer_type) {
    case 'TRANSFER_OUT_ONLY':
      params = {
        review_status: 'REJECTED',
        id: row.id,
        review_opinion: data.review_opinion,
        handler_type: 'SOURCE_REVIEW',
      };
      break;
    case 'TRANSFER_IN_ONLY':
      params = {
        destination_review_status: 'REJECTED',
        id: row.id,
        review_opinion: data.review_opinion,
        handler_type: 'DESTINATION_REVIEW',
      };

      break;
    case 'TRANSFER_SAME_STORE':
      params = {
        destination_review_status: 'REJECTED',
        id: row.id,
        review_opinion: data.review_opinion,
        handler_type: 'DESTINATION_REVIEW',
      };
      break;
    case 'TRANSFER_DIFFERENT_STORE':
      params = {
        destination_review_status: 'REJECTED',
        id: row.id,
        review_opinion: data.review_opinion,
        handler_type: 'DESTINATION_REVIEW',
      };
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
  return getEnumLabel(transferStatus, row.overall_status);
};

//获取操作状态
const getOperateStatus = computed(() => (row) => {
  let status = '';

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
  // 创建成功	调拨出库	审核通过	审核拒绝	调拨入库	审核通过	审核拒绝
  // CREATED(操作：调拨出库)	OUTBOUND(操作：审核)	APPROVED_OUTBOUND(操作：调拨入库)	REJECTED_OUTBOUND	INBOUND(操作：审核)	APPROVED_INBOUND	REFUSED_INBOUND
  switch (row.transfer_type) {
    case 'TRANSFER_OUT_ONLY':
      if (row.overall_status === 'CREATED') {
        return filterOpt(['OUTBOUND']);
      }

    case 'TRANSFER_IN_ONLY':
      if (row.overall_status === 'CREATED') {
        return filterOpt(['INBOUND']);
      }
      break;
    case 'TRANSFER_SAME_STORE':
      if (row.overall_status === 'CREATED') {
        return filterOpt(['OUTBOUND']);
      } else if (row.overall_status === 'OUTBOUND') {
        return filterOpt(['INBOUND']);
      }
      break;
    case 'TRANSFER_DIFFERENT_STORE':
      if (row.source_merchant_id === currentLoginUserApp.owner_id) {
        if (row.overall_status === 'CREATED') {
          return filterOpt(['OUTBOUND']);
        } else if (row.overall_status === 'OUTBOUND') {
          return [];
        }
      } else {
        if (row.overall_status === 'CREATED') {
          return [];
        }
      }
      break;
    default:
      return [];
  }

  return [];
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
      if (row.status === 'OUTBOUND' || row.status === 'REFUSED_OUTBOUND') {
        flag = false;
      }
      break;
    case 'TRANSFER_IN_ONLY':
      if (
        row.destination_status === 'INBOUND' ||
        row.destination_status === 'REFUSED_INBOUND'
      ) {
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
const checkReviewOperate = (row: any) => {
  if (row.id == '1985243151210721281') {
  }
  let flag = false;
  //调拨类型
  switch (row.transfer_type) {
    case 'TRANSFER_OUT_ONLY':
      if (row.overall_status === 'OUTBOUND') {
        flag = true;
      }
      break;
    case 'TRANSFER_IN_ONLY':
      if (row.overall_status === 'INBOUND') {
        flag = true;
      }
      break;
    case 'TRANSFER_SAME_STORE':
      if (row.overall_status === 'INBOUND') {
        flag = true;
      }

      break;
    case 'TRANSFER_DIFFERENT_STORE':
      if (row.source_merchant_id === currentLoginUserApp.owner_id) {
        if (row.overall_status === 'OUTBOUND') {
          flag = true;
        }
      } else {
        if (row.overall_status === 'INBOUND') {
          flag = true;
        }
      }

      break;
  }
  return flag;
};
// 获取审核文字
const getReviewLabel = (row: any) => {
  console.log('getReviewLabel');
  if (
    row.overall_status == 'APPROVED_OUTBOUND' ||
    row.overall_status == 'APPROVED_INBOUND'
  ) {
    return getEnumLabel(operationOpt.value, 'APPROVED');
  } else if (
    row.overall_status == 'REJECTED_OUTBOUND' ||
    row.overall_status == 'REFUSED_INBOUND'
  ) {
    return getEnumLabel(operationOpt.value, 'REJECTED');
  } else {
    return getEnumLabel(operationOpt.value, 'PENDING');
  }
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
        <ElDropdown v-if="getStatusOptions(row).length > 0">
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
        <span v-else class="review-approved"> {{ getLabel(row) }}</span>
      </template>
      <template #review_status="{ row }">
        <ElDropdown v-if="checkReviewOperate(row)">
          <span class="custom-dropdown">
            {{ getReviewLabel(row) }}
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
        <span v-else> {{ getReviewLabel(row) }}</span>
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
