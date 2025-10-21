<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue';

import { ElButton, useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { getCustomTemplateListApi, orderDetailApi } from '@@/sale/apis';

import {
  ReceiptTemplate,
  useReceiptTemplate,
} from '#/components/receipt-template'; // 生成小票模板
import { initializeCurrencySymbol } from '#/utils/sale';

defineOptions({
  name: 'SaleOrderPrintReceiptDrawer',
});
const props = defineProps({
  draweListShow: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  editId: {
    type: String,
    default: '',
  },
});

/**
 * emit组合
 */
const emit = defineEmits(['close-tkr', 'refresh']);
const order_no = ref('');

const [Drawer, drawerApi] = useIgourdDrawer({
  onOpenChange: (val) => {
    if (val) {
      const { order_no: no } = drawerApi.getData();
      order_no.value = no;
      initMounted();
    }
  },
});

const { t } = useI18n();

const isListShow = ref(false);
const handleClose = () => {
  printTemplate.value = {};
  orderDetail.value = {};
  isListShow.value = false;
  drawerApi.close();
  emit('close-tkr');
};

const state = reactive({
  loading: false,

  roleList: [] as any[],
  countriesList: [] as any[],

  currentSymbol: '',
  orderDetail: {} as any,
  printTemplate: {} as any,
  orderItemModelList: [] as any[],
  merchant_id: '',
});
const { currentSymbol, orderDetail, printTemplate, orderItemModelList } =
  toRefs(state);

// ======================== 打印相关 ==============================

const printParams = {
  ids: 'receiptPrintId',
  popTitle: '页面打印',
};
function renderQuantUnit() {
  return 'x';
}
const { receiptRoles, setOrderDetail } = useReceiptTemplate({
  title: 'printTemp.refund',
  printTemplate,
  fieldColumns: [
    { column_option_code: 'refund_total_amount', is_selected: true },
    { column_option_code: 'order_returned_no', is_selected: true },
  ],
  callbackBefore: {
    quantity: renderQuantUnit,
    total_quantity: renderQuantUnit,
    refund_total_amount: () => '-',
  },
});

// ======================== 打印相关 ==============================

async function initMounted() {
  currentSymbol.value = await initializeCurrencySymbol();
  fetchOrderDetail();
  getTemplateList('RECEIPT');
}
// 01-模板数据
const getTemplateList = async (type: string) => {
  // 再请求新数据
  const params = {
    type,
    is_default: true,
  };
  const res = await getCustomTemplateListApi(params);
  if (type === 'RECEIPT') {
    printTemplate.value = res?.find((item) => item.is_default) || {};
  }
};
// 02-订单数据
async function fetchOrderDetail() {
  try {
    const res = await orderDetailApi({
      order_no: order_no.value,
    });
    orderDetail.value = res;
    setOrderDetail({
      ...orderDetail.value,
      total_amount: orderDetail.value.total_amount,
      order_returned_no: orderDetail.value.order_returned_no,
      order_item_model_list: orderDetail.value.order_calc_product_model_list,
      refund_total_amount: orderDetail.value.refund_total_amount,
    });
    orderItemModelList.value = res?.order_item_model_list;
  } catch (error: any) {
    console.error(error);
  }
}
</script>
<template>
  <Drawer>
    <div>
      <ReceiptTemplate
        :roles="receiptRoles"
        :print-id="printParams.ids"
        :option-content="printTemplate.option_content"
        :image-url="printTemplate.profile_photo"
        :print-info="[{ ...orderDetail, Template: { ...printTemplate } }]"
        template-type="RECEIPT"
      />
    </div>
    <template #footer>
      <div class="flex justify-end">
        <ElButton type="default" size="default" @click="handleClose">
          {{ t('common.close') }}
        </ElButton>
        <ElButton type="default" size="default" v-print="printParams">
          {{ t('common.print') }}
        </ElButton>
      </div>
    </template>
  </Drawer>
</template>
