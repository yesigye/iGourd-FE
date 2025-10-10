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

import {
  getPurchaseOrderDetailApi,
  reviewPurchaseOrderApi,
} from '@@/purchase/apis';
import { usePurchaseOrder } from '@@/purchase/hooks';

import { AuditDialog } from '#/components';

import Detail from '../../components/order/detail.vue';

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
const { currentLoginUserApp } = useUserStore();

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
const getlabel = (value:string) => {
  const obj = operationOpt.find((item) => item.value === value);
  return obj?.label;
};
const detailDrawerRef = ref();
const unitChange = () => {};

const currentRow = ref();
const openModal = (row: tableItem) => {
  if (row.review_status === 'PENDING') {
    currentRow.value = row;
    auditDialogRef.value.openModal();
  }
};
const handleDetail = async (row: tableItem, mode: string) => {
  const detail = await getPurchaseOrderDetailApi({
    purchase_order_id: row.id,
  });
  detailDrawerRef.value.open(detail, mode);
};
const handleconfirm = (data: AuditFormData) => {
  data.id = currentRow.value.id;
  data.merchant_id = currentLoginUserApp.owner_id;
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
        <ElDropdown>
          <span>
            {{ getlabel(row.review_status) }}
            <ElIcon class="el-icon--right">
              <ArrayDown />
            </ElIcon>
          </span>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem
                v-for="item in operationOpt"
                :key="item?.value"
                @click="() => unitChange(item)"
              >
                <div>{{ item.label }}</div>
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
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
    <!--
    <template #footer >
      <div>总计：100T</div>
    </template>
    -->
  </Page>
  <!--调用公共审核框 -->
  <AuditDialog ref="auditDialogRef" @confirm="handleconfirm" />
  <Detail ref="detailDrawerRef" data="" />
</template>
