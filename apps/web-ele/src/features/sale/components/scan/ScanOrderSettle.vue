<script setup lang="ts">
import { reactive, ref, toRefs, watch } from 'vue';

import { ElDrawer } from '@igourd/common-ui';

import { getCustomTemplateListApi } from '@@/sale/apis';

import {
  ReceiptTemplate,
  useReceiptTemplate,
} from '#/components/ReceiptTemplateNew'; // 生成小票模板
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

const { receiptRoles } = useReceiptTemplate({
  title: 'printTemp.settle',
  orderDetail,
  printTemplate,
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

const printParams = {
  id: 'receiptPrintId3',
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
// 关键词搜索
watch(
  () => props.showDialog,
  (val) => {
    if (val) {
      isModalShow.value = true;
      initMounted();
      // scanCashSettlementRef.value.isSettled = true;
    }
  },
);

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
    <ElDrawer
      v-model="isModalShow"
      :append-to-body="true"
      :with-header="false"
      size="65%"
      :show-close="false"
      custom-class="coupon-drawer-prevent-send"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="close65" @click="handleClose">
        <i class="iconfont icon-guanbi"></i>
      </div>
      <div class="innerDrawer">
        <div class="innerLeft">
          <ReceiptTemplate
            :print-id="printParams.id"
            :option-content="printTemplate.option_content"
            :image-url="printTemplate.profile_photo"
            :print-info="[{ ...orderDetail, Template: { ...printTemplate } }]"
            :roles="receiptRoles"
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
          />
        </div>
      </div>
    </ElDrawer>
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
