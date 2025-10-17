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

import { usePurchaseReturned } from '@@/purchase/hooks';
const { currentLoginUserApp } = useUserStore();

import {
  getPurchaseOrderDetailApi,
  auditPurchaseReturnedApi,
  getPurchaseReturnedDetailApi,
} from '@@/purchase/apis';
import { usePurchaseReturnDetail } from '@@/purchase/hooks';

// table数据项
interface tableItem {
  id?: string;
  review_status: string;
}
interface AuditFormData {
  id?: string;
  merchant_id: string;
}
defineOptions({
  name: 'IPurchaseReturned',
});

const { t } = useI18n();

const operationOpt = [
  {
    label: t('common.pending'),
    value: 'PENDING',
  },
  {
    label: t('common.approve'),
    value: 'APPROVED',
  },
  {
    label: t('common.reject'),
    value: 'REJECTED',
  },
];
const getlabel = (value: string) => {
  const obj = operationOpt.find((item) => item.value === value);
  return obj?.label;
};
const auditDialogRef = ref();
const currentRow = ref();

const {
  Grid,
  gridApi,
  Drawer,
  handleEdit,
  handleBatchDelete,
  canBatchOperate,
} = usePurchaseReturned();
const { Drawer: Detail, drawerApi: detailDrawerApi } =
  usePurchaseReturnDetail();

const openModal = (row: tableItem, item) => {
  if (row.review_status === 'PENDING' && item.value === 'REJECTED') {
    currentRow.value = row;
    auditDialogRef.value.openModal();
  } else if (row.review_status === 'PENDING' && item.value === 'APPROVED') {
    const param = {
      id: row.id,
      merchant_id: currentLoginUserApp.owner_id,
      review_status: 'APPROVED',
    };
    auditPurchaseReturnedApi(param).then(() => {
      gridApi.reload();
    });
  }
};
const handleDetail = async (row: tableItem, mode: string) => {
  const detail = await getPurchaseReturnedDetailApi({
    purchase_returned_id: row.id,
  });
  detailDrawerApi
    .setData(
      { ...detail, productList: detail.purchase_order_item_model_list },
      mode,
    )
    .open();
  //detailDrawerRef.value.open({...detail,productList:detail.purchase_order_item_model_list}, mode);
};
const handleconfirm = (data: AuditFormData) => {
  data.id = currentRow.value.id;
  data.merchant_id = currentLoginUserApp.owner_id;
  data.review_status = 'REJECTED';
  auditPurchaseReturnedApi(data).then(() => {
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
          {{ t('returned.add-purchase-returned') }}
        </ElButton>
        <ElButton type="danger" v-if="canBatchOperate">
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #modal="{ row }">
        <ElDropdown v-if="row.review_status === 'PENDING'">
          <span class="custom-dropdown">
            {{ getlabel(row.review_status) }}
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
        >
          {{ getlabel(row.review_status) }}
        </span>
        <span
          v-if="row.review_status === 'REJECTED'"
          style="color: var(--el-color-danger)"
        >
          {{ getlabel(row.review_status) }}
        </span>
      </template>

      <template #operation="{ row }">
        <ElButton
          v-if="row.status === 'CREATED' || row.review_status === 'PENDING'"
          type="text"
          @click="handleEdit(row)"
        >
          {{ t('common.edit') }}
        </ElButton>

        <ElButton type="text" @click="handleDetail(row, 'view')">
          {{ t('common.detail') }}
        </ElButton>
      </template>
    </Grid>
    <AuditDialog ref="auditDialogRef" @confirm="handleconfirm" />
    <Drawer />
    <Detail />
  </Page>
</template>
<style scoped>
.custom-dropdown:focus-visible {
  outline: unset;
}
</style>
