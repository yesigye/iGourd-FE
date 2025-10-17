<script lang="ts" setup>
import { ModalTable } from '#/components/modal-table';
import { useForm, useIgourdModal } from '@igourd/common-ui';
import { usePurchaseBills } from '@@/purchase/hooks';
import { useI18n } from '@igourd/locales';
import { unref } from 'vue';
import { sum } from '@igourd/utils';
const defaultQueryParams = {
  customer_id: '',
  payment_type: 'CREDIT',
  status_list: ['NO_REPAID', 'PARTIAL_REPAID'],
};
const { Grid: SaleGrid, gridApi: saleGridApi } =
  usePurchaseBills(defaultQueryParams);

// const { Grid: AccountNotesGrid } = useNotesList(defaultQueryParams);
const { t } = useI18n();
const form = useForm();

async function onBeforeOpen() {
  await unref(form).validate('customer_id');
  defaultQueryParams.customer_id = unref(form).getValuesIn('customer_id');
}

const [Modal, modalApi] = useIgourdModal({
  connectedComponent: ModalTable,
  class: 'w-3/4',
  title: '选择源订单',
  destroyOnClose: true,

  onConfirm() {
    const records = saleGridApi.grid.getCheckboxRecords();
    const formAPI = unref(form);
    if (!records) {
      return;
    }
    const last_debt = sum(records.map((item: any) => item.repaid_amount));
    const total_amount = sum(records.map((item: any) => item.total_amount));
    formAPI.setValues({
      order_info: records,
      receipt_order_item_list: [{}],
      total_amount,
      last_debt: last_debt,
    });
    modalApi.close();
  },
});
</script>

<template>
  <Modal :onBeforeOpen="onBeforeOpen" title="源订单">
    <template #reference>
      {{ t('account.source_order_information') }}
    </template>
    <div class="h-[54vh]">
      <SaleGrid />
    </div>
    <!-- <ElTabs>
      <ElTabPane label="订单" class="h-[54vh]" key="Sales_Order"> -->

    <!-- </ElTabPane>
      <ElTabPane label="记账笔记" class="h-[54vh]">
        <AccountNotesGrid key="AccountNotes" />
      </ElTabPane>
    </ElTabs> -->
  </Modal>
</template>
