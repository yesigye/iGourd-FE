<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue';

import { useIgourdDrawer } from '@igourd/common-ui';
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
      console.log(order_no.value);
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

const { receiptRoles } = useReceiptTemplate({
  title: 'printTemp.settle',
  orderDetail,
  printTemplate,
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
        :print-id="printParams.ids"
        :option-content="printTemplate.option_content"
        :image-url="printTemplate.profile_photo"
        :print-info="[{ ...orderDetail, Template: { ...printTemplate } }]"
      />
    </div>
  </Drawer>
</template>
