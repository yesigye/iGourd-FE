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

import { usePurchaseReceipt,useReceiptOrderDetail } from '@@/purchase/hooks';

import {
  getPurchaseReceiptDetailApi,
  auditPurchaseReceiptApi,
} from '@@/purchase/apis';
defineOptions({
  name: 'IPurchaseReceipt',
});
import { AuditDialog } from '#/components';
const{Drawer:Detail,drawerApi:detailDrawerApi} = useReceiptOrderDetail()
const { currentLoginUserApp } = useUserStore();
import { useLanguage } from '#/hooks';
import { getEnumLabel } from '#/utils/global';

const {
  Grid,
  gridApi,
  Drawer,
  handleEdit,
  handleBatchDelete,
  canBatchOperate,
} = usePurchaseReceipt();
// table数据项
interface tableItem {
  id?: string;
  review_status: string;
}
interface AuditFormData {
  id?: string;
  merchant_id: string;
}

const { t } = useI18n();

const operationOpt = ref()
useLanguage('common.review-status-enum').then((res) => {
  operationOpt.value = res;
});

const auditDialogRef = ref();

const detailDrawerRef = ref();
const currentRow = ref();
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
    auditPurchaseReceiptApi(param).then(() => {
      gridApi.reload();
    });
  }
};
const handleDetail = async (row: tableItem, mode: string) => {
  const detail = await getPurchaseReceiptDetailApi({
    goods_receipt_note_id: row.id,
  });
  detailDrawerApi.setData({...detail,productList:detail.goods_receipt_note_item_model_list}, mode).open();
};
const handleconfirm = (data: AuditFormData) => {
  data.id = currentRow.value.id;
  data.merchant_id = currentLoginUserApp.owner_id;
  data.review_status = 'REJECTED';
  auditPurchaseReceiptApi(data).then(() => {
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
        <ElDropdown v-if="row.review_status === 'PENDING'">
          <span class="custom-dropdown">
            {{ getEnumLabel(operationOpt,row.review_status)}}
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
          v-if="row.review_status === 'APPROVED'" class="review-approved"
        >
           {{ getEnumLabel(operationOpt,row.review_status)}}
        </span>
        <span class="review-rejected"
          v-if="row.review_status === 'REJECTED'"
        >
          {{ getEnumLabel(operationOpt,row.review_status)}}
        </span>
      </template>

      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleDetail(row,'view')">
          {{ t('common.detail') }}
        </ElButton>
      </template>
    </Grid>

    <Drawer />
    <AuditDialog ref="auditDialogRef" @confirm="handleconfirm" />
    <Detail ref="detailDrawerRef" />
  </Page>
</template>
<style scoped>
.custom-dropdown:focus-visible {
  outline: unset;
}
</style>
