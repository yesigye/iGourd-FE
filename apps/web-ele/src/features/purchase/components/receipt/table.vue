<script lang="ts" setup>
import { ModalTable } from '#/components/modal-table';
import { useForm, useIgourdModal } from '@igourd/common-ui';
import { usePreOrderList } from '@@/purchase/hooks';
import { useI18n } from '@igourd/locales';
import { unref } from 'vue';
import { sum } from '@igourd/utils';
import { Plus } from '@igourd/icons';

const defaultQueryParams = {
  customer_id: '',
  payment_type: 'CREDIT',
  status_list: ['NO_REPAID', 'PARTIAL_REPAID'],
};
const { Grid: SaleGrid, gridApi: saleGridApi } =
  usePreOrderList(defaultQueryParams);

// const { Grid: AccountNotesGrid } = useNotesList(defaultQueryParams);
const { t } = useI18n();
const form = useForm();

async function onBeforeOpen() {
  //await unref(form).validate('customer_id');
  // defaultQueryParams.customer_id = unref(form).getValuesIn('customer_id');
}

const [Modal, modalApi] = useIgourdModal({
  connectedComponent: ModalTable,
  class: 'w-3/4',
  title: '选择源订单',
  destroyOnClose: true,

  onConfirm() {
    debugger;
    let records = saleGridApi.grid.getCheckboxRecords();
    const formAPI = unref(form);
    if (!records) {
      return;
    }
    records = records.map((item) => {
      return {
        ...item,
        label: item.advance_payment_order_no,
        value: item.id,
      };
    });
    formAPI.setValues({
      advance_payment_offset_opts: JSON.stringify(records),
    });
    modalApi.close();
  },
});
</script>

<template>
  <Modal :onBeforeOpen="onBeforeOpen" title="">
    <template #reference>
      <Plus></Plus>
    </template>
    <div class="h-[54vh]">
      <SaleGrid />
    </div>
  </Modal>
</template>
