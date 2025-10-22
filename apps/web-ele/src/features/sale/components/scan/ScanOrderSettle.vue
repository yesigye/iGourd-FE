<script setup lang="ts">
import { reactive, ref, toRefs, watch } from 'vue';

import { ElButton, useIgourdDrawer } from '@igourd/common-ui';

import { getCustomTemplateListApi } from '@@/sale/apis';

import {
  ReceiptTemplate,
  useReceiptTemplate,
} from '#/components/receipt-template'; // 生成小票模板
import { initializeCurrencySymbol } from '#/utils/sale';

import ScanCashSettlement from './ScanCashSettlement.vue';

const props = defineProps({
  orderData: {
    type: Object,
    default: () => ({}),
  },
  showDialog: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  rowSelection: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['close-tkr', 'handleEmpty']);
const [Drawer, drawerApi] = useIgourdDrawer({
  async onOpenChange(val) {
    if (val) {
      isModalShow.value = true;
      initMounted();
    }
  },
  onClosed() {
    isModalShow.value = false;
    emit('close-tkr');
    emit('handleEmpty');
    isSettledShow.value = true;
  },
});
const isModalShow = ref(false);
const scanCashSettlementRef = ref<any>(null);
const state = reactive({
  loading: false,
  unitFrom: {
    name: '',
  },
  roleList: [] as any[],
  countriesList: [] as any[],
  currentSymbol: '',
  orderInfo: {} as any,
  orderItemModelList: [] as any[],
  merchant_id: '',
  settlementInfo: {} as any,
  // 通知子组件重置状态
  isSettledShow: false,
  orderDetail: {} as any,
  printTemplate: {} as any,
});
const {
  currentSymbol,
  settlementInfo,
  isSettledShow,
  orderDetail,
  printTemplate,
} = toRefs(state);
function renderQuantUnit() {
  return 'x';
}
const { receiptRoles } = useReceiptTemplate({
  title: 'print-temp.refund',
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

const handleClose = () => {
  orderDetail.value = {};
  printTemplate.value = {};
  isModalShow.value = false;
  emit('close-tkr');
  emit('handleEmpty');
  isSettledShow.value = true;
};
const hanleSettledShow = () => {
  isSettledShow.value = false;
};
const handleEmpty = () => {};

const printObj = {
  ids: 'receiptPrintId3',
  popTitle: '页面打印',
  breakInside: 'avoid',
  preview: false,
  // 小票模式
  receipt: true,
};

// ======================== 打印相关 ==============================
// 01-模板数据
const getTemplateList = async (type: string) => {
  // 再请求新数据
  const params = {
    type,
    is_default: true,
  };
  const res = await getCustomTemplateListApi(params);
  // if (String(res.code) === 'SUCCESS' && type === 'RECEIPT') {
  printTemplate.value = res.find((item) => item.is_default) || {};
  // }
};
async function initMounted() {
  currentSymbol.value = await initializeCurrencySymbol();
  getTemplateList('RECEIPT');
}
const handleSettlementSuccess = (settlementData) => {
  settlementInfo.value = settlementData;
};
const printBtn = ref();
const handlePrint = () => {
  // 模拟点击
  if (printBtn.value) {
    printBtn.value.$el.click();
  }
};
watch(
  () => props.orderData,
  (value) => {
    if (value) {
      orderDetail.value = value;
    }
  },
  {
    deep: true,
  },
);
</script>

<template>
  <div class="coupon-send">
    <Drawer>
      <div class="innerDrawer">
        <div class="innerLeft overflow-y-auto">
          <ReceiptTemplate
            :roles="receiptRoles"
            :print-id="printObj.ids"
            :option-content="printTemplate.option_content"
            :image-url="printTemplate.profile_photo"
            :print-info="[{ ...orderDetail, Template: { ...printTemplate } }]"
            template-type="RECEIPT"
          />
        </div>

        <div class="innerRight">
          <ScanCashSettlement
            ref="scanCashSettlementRef"
            v-model:detail="orderDetail"
            :is-settled-show="isSettledShow"
            :show-dialog="isModalShow"
            @update:close="handleClose"
            @handle-empty="handleEmpty"
            @hanle-settled-show="hanleSettledShow"
            @settlement-success="handleSettlementSuccess"
            @close-drawer="handleClose"
            @print="handlePrint"
          />
          <div>
            <ElButton
              style="display: none"
              ref="printBtn"
              v-print="printObj"
              type="primary"
            >
              打印
            </ElButton>
          </div>
        </div>
      </div>
    </Drawer>

    <!-- </ElDrawer> -->
  </div>
</template>

<style lang="scss">
//.el-input__inner{
//  height: 78px;
//}
</style>
<style lang="scss" scoped>
.innerDrawer {
  //   background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  height: 100%;

  .innerLeft {
    width: 46%;
    border-right: 1px solid #dfdfdf;
  }
}

.innerRight {
  width: 58%;
  background: #f9f9f9;
}
</style>
