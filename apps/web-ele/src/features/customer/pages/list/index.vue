<script setup lang="ts">
import { ref } from 'vue';

import {
  ElButton,
  ElInput,
  ElLink,
  ElTabPane,
  ElTabs,
  Page,
  useIgourdModal,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { useBalanceChange, useCustomerList } from '@@/customer/hooks';
import { getSaleOrderListApi } from '@@/sale/apis';
import { useSaleOrderDetailsDrawer } from '@@/sale/hooks';

import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import detailsIcon from '#/assets/img/details.svg';

defineOptions({
  name: 'IPurchaseCustomized',
});

const { t } = useI18n();
const useStore = useUserStore();
const { merchantInfo } = useStore;
const currencySymbol = merchantInfo?.currency_symbol || '';
const { Grid, Drawer, handleEdit, canBatchOperate, handleBatchDelete } =
  useCustomerList();
const { Drawer: BalanceChangeDrawer, drawerApi: balanceChangeDrawerApi } =
  useBalanceChange();
const { Drawer: OrderDetailsDrawer, drawerApi: orderDetailsDrawerApi } =
  useSaleOrderDetailsDrawer();
const handleBalanceChange = (row) => {
  balanceChangeDrawerApi.setData({ data: row }).open();
};
// 获取客户订单详情
const customerId = ref(0);
const activeTab = ref('orderDetails');
const searchOrderNo = ref('');
const handleModal = (row) => {
  modalApi.setData({ data: row }).open();
};
const orderColumns = ref([
  {
    field: 'order_create_time',
    title: t('list.order-time'),
    minWidth: 170,
    align: 'center',
  },
  {
    field: 'order_no',
    title: t('list.order-no'),
    minWidth: 170,
    align: 'center',
    slots: { default: 'order_no' },
  },
  {
    field: 'payment_card_type',
    title: t('list.contact-order-type'),
    minWidth: 170,
    align: 'center',
  },
  {
    field: 'customer_name',
    title: t('list.customer'),
    minWidth: 170,
    align: 'center',
  },

  {
    field: 'total_amount',
    title: t('list.transaction-amount'),
    minWidth: 170,
    align: 'center',
  },
  {
    field: 'subtotal_amount',
    title: t('list.paid'),
    minWidth: 170,
    align: 'center',
  },
  {
    field: 'repaid_amount',
    title: t('list.refunded'),
    minWidth: 170,
    align: 'center',
  },
  {
    field: 'payment_balance_amount',
    title: t('list.balance'),
    minWidth: 170,
    align: 'center',
  },
  {
    field: 'currency',
    title: t('list.currency'),
    minWidth: 170,
    align: 'center',
    slots: { default: 'currency' },
  },
  {
    field: 'creator_name',
    title: t('list.creator'),
    minWidth: 170,
    align: 'center',
  },
  {
    field: 'create_time',
    title: t('list.creator-time'),
    minWidth: 170,
    align: 'center',
  },
]);
const orderGridOptions = ref({
  id: 'curtomer-order',
  columns: orderColumns.value,
  mergeCells: [],
  class: 'w-full p-0',
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        const res = await getSaleOrderListApi({
          ...page,
          keywords: searchOrderNo.value,
          page_num: page.currentPage,
          customer_id: customerId.value,
          payment_type: 'CREDIT',
          status_list: ['NO_REPAID', 'PARTIAL_REPAID'],
        });
        return res || {};
      },
    },
  },
});
const [orderGrid, orderGridApi] = useIgourdVxeGrid({
  gridOptions: orderGridOptions.value,
});
const [Modal, modalApi] = useIgourdModal({
  class: 'w-3/4',
  title: t('list.order-details'),
  async onOpenChange(isOpen) {
    const customerInfoActive = modalApi.getData();
    if (isOpen) {
      customerId.value = customerInfoActive.id;
      orderGridApi.reload();
    }
  },
});
const handleClickOrderNo = (row) => {
  orderDetailsDrawerApi.setData({ order_no: row.order_no }).open();
};
const handleSearch = () => {
  orderGridApi.reload();
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary" @click="handleEdit()">
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
      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
      </template>
      <template #balance="{ row }">
        <div class="flex w-full items-center justify-between px-5">
          <span>{{ row.balance || '--' }}</span>

          <img
            :src="detailsIcon"
            class="h-3 w-3 cursor-pointer"
            @click="handleBalanceChange(row)"
            alt=""
          />
        </div>
      </template>
      <template #debt_amount="{ row }">
        <div class="flex w-full items-center justify-between px-5">
          <span>{{ row.debt_amount || '--' }}</span>

          <img
            v-if="row.debt_amount"
            :src="detailsIcon"
            class="h-3 w-3 cursor-pointer"
            @click="handleModal(row)"
            alt=""
          />
        </div>
      </template>
    </Grid>
    <Drawer />
    <BalanceChangeDrawer />
    <OrderDetailsDrawer />
    <Modal>
      <ElTabs v-model="activeTab">
        <ElTabPane :label="t('list.sales-order')" name="orderDetails">
          <div class="mb-2.5 flex items-center gap-2.5 px-3">
            <ElInput
              v-model="searchOrderNo"
              class="w-[288px]"
              :placeholder="t('list.enter-purchase-order-no-vendor-name-')"
            />
            <ElButton type="primary" @click="handleSearch">
              {{ t('common.search') }}
            </ElButton>
          </div>
          <orderGrid>
            <template #currency>
              {{ currencySymbol || '--' }}
            </template>
            <template #order_no="{ row }">
              <!-- 不跳转 -->
              <ElLink type="primary" @click="handleClickOrderNo(row)">
                {{ row.order_no || '--' }}
              </ElLink>
            </template>
          </orderGrid>
        </ElTabPane>
      </ElTabs>
    </Modal>
  </Page>
</template>
