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

import {
  getPurchaseOrderDetailApi,
  reviewPurchaseOrderApi,
} from '@@/purchase/apis';
import { usePurchaseOrder,usePurchaseOrderDetail } from '@@/purchase/hooks';

import { AuditDialog } from '#/components';


defineOptions({
  name: 'IPurchaseOrder',
});
// table数据项
interface tableItem {
  id?: string;
  review_status: string;
}
interface AuditFormData {
  id?: string;
  merchant_id: string;
}
const auditDialogRef = ref();

const { t } = useI18n();

const {
  Grid,
  gridApi,
  Drawer,
  handleEdit,
  handleBatchDelete,
  canBatchOperate,
} = usePurchaseOrder();
const{Drawer:Detail,drawerApi:detailDrawerApi} = usePurchaseOrderDetail()
const { currentLoginUserApp } = useUserStore();
import { useLanguage } from '#/hooks';
const operationOpt = ref();
useLanguage('common.review-status-enum').then((res) => {
  operationOpt.value = res;
});

const detailDrawerRef = ref();

const currentRow = ref();
const openModal = (row: tableItem, item) => {
  if (row.review_status.value === 'PENDING' && item.value === 'REJECTED') {
    currentRow.value = row;
    auditDialogRef.value.openModal();
  } else if (row.review_status.value === 'PENDING' && item.value === 'APPROVED') {
    const param = {
      id: row.id,
      merchant_id: currentLoginUserApp.owner_id,
      review_status: 'APPROVED',
    };
    reviewPurchaseOrderApi(param).then(() => {
      gridApi.reload();
    });
  }
};
const handleDetail = async (row: tableItem, mode: string) => {
  const detail = await getPurchaseOrderDetailApi({
    purchase_order_id: row.id,
  });
  detailDrawerApi.setData({...detail,productList:detail.purchase_order_item_model_list}, mode).open()
  //detailDrawerRef.value.open({...detail,productList:detail.purchase_order_item_model_list}, mode);
};
const handleconfirm = (data: AuditFormData) => {
  data.id = currentRow.value.id;
  data.merchant_id = currentLoginUserApp.owner_id;
  data.review_status = 'REJECTED';
  reviewPurchaseOrderApi(data).then(() => {
    auditDialogRef.value.closeModal();
    gridApi.reload();
  });
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary" @click="handleEdit">
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
        >
          {{ row.review_status.label }}
        </span>
        <span
          v-if="row.review_status.value === 'REJECTED'"
          style="color: var(--el-color-danger)"
        >
          {{ row.review_status.label }}
        </span>
        <!--
        <ElButton type="text" @click="openModal(row)">
          <i
            v-if="row.review_status === 'PENDING'"
            class="iconfont icon-daishenhe status_icon"
            style="color: var(--el-color-warning)"
          ></i>
          <i
            v-if="row.review_status === 'APPROVED'"
            class="iconfont icon-SURE status_icon"
            style="color: var(--el-color-success)"
          ></i>
          <i
            v-if="row.review_status === 'REJECTED'"
            class="iconfont icon-fILED status_icon"
            style="color: var(--el-color-danger)"
          ></i>
        </ElButton>-->
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
        <ElButton type="text" @click="handleDetail(row, 'close')">
          {{ t('common.close') }}
        </ElButton>
        <!--
        <ElButton type="text" @click="handleDetail(row)">
          {{ t('common.print') }}
        </ElButton>
        -->
      </template>
    </Grid>
    <Drawer />
    <AuditDialog ref="auditDialogRef" @confirm="handleconfirm" />
    <Detail  />
  </Page>
</template>
<style scoped>
.custom-dropdown:focus-visible {
  outline: unset;
}
</style>
