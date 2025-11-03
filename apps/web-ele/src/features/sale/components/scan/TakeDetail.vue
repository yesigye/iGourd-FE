<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue';

import {
  Card,
  ElButton,
  ElCol,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElRadio,
  ElRadioGroup,
  ElRow,
  ElScrollbar,
  ElTable,
  ElTableColumn,
  ElText,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import {
  getCustomTemplateListApi,
  orderHoldingDetailApi,
  orderHoldingModifyApi,
  orderHoldingRemoveApi,
  orderSuspendListApi,
} from '@@/sale/apis';
import { codeConfig } from '@@/sale/components/scan/const/codeConfig';
import {
  useSelectCustomer,
  useSelectGuider,
  useSelectProduct,
} from '@@/sale/hooks';

import floatingLayerArrowIcon from '#/assets/sale/floating-layer-arrow.svg';
import { ReceiptTemplate } from '#/components/receipt-template'; // 生成小票模板
// 生成小票模板

import HoldOrderTakeCard from './HoldOrderTakeCard.vue';

const props = defineProps({
  drawerReturnShow: {
    type: Boolean,
    default: false,
  },
  drawerReturnTitle: {
    type: String,
    default: '',
  },
  tag: {
    type: String,
    default: '',
  },
});
const emit = defineEmits([
  'close-tkr',
  'handleTakeOrderInfo',
  'calculationBadgeCount',
]);
const { Drawer: SelectCustomersDrawer, drawerApi: drawerApiCustomer } =
  useSelectCustomer();
const { Drawer: SelectGuiderDrawer, drawerApi: drawerApiGuider } =
  useSelectGuider();
const { Drawer: SelectProducts, drawerApi: drawerApiProduct } =
  useSelectProduct();
const [Drawer, drawerApi] = useIgourdDrawer({
  onOpenChange: (val) => {
    if (val) {}
  },
});
const tableRef = ref();
const { t } = useI18n();
const isReturnShow = ref(false);
const currentId = ref('');
const isSelectProductDialog = ref(false);
const takeTitle = ref('select product');
const printParams = {
  ids: 'advanceStatement',
  popTitle: '页面打印',
};
const drawerDetailsCustomers = ref({
  title: '',
  visible: false,
});
const drawerDetailsGuider = ref({
  title: '',
  visible: false,
});
const handleClose = () => {
  isReturnShow.value = false;
  emit('close-tkr');
};
const handleCloseSelectProducts = () => {
  isSelectProductDialog.value = false;
};
const columnsVisible = ref([
  {
    prop: 'id',
    label: t('scan.hold_no'),
    width: '200px',
    align: 'left',
    fixed: 'left',
  },
  {
    prop: 'totalQuantity',
    label: t('scan.product_qty'),
    width: '161px',
    align: 'left',
  },
  {
    prop: 'customer_name',
    label: t('scan.customer_name'),
    width: '161px',
    align: 'left',
  },
  {
    prop: 'create_time',
    label: t('scan.hold-date'),
    width: '161px',
    align: 'left',
  },
  {
    prop: 'origin_quantity',
    label: t('scan.salesman'),
    width: '190px',
    align: 'left',
  },
  {
    prop: 'total_amount',
    label: t('scan.total_amount'),
    width: '161px',
    align: 'left',
  },
  {
    prop: 'remark',
    label: t('scan.remark'),
    width: '200px',
    align: 'left',
    fixed: 'right',
  },
]);
// 挂单参数
const orderSuspendParams = ref({
  device_id: null,
  end_create_time: '',
  page_num: 1,
  page_size: 100,
  pos_user_id: null,
  start_create_time: '',
  status: 'PENDING',
  customer_keywords: '',
});
const suspendList = ref([]);
const isSuspend = inject<any>('isSuspend');
// 打开挂单添加商品弹窗
const handleSelectProducts = () => {
  // isSelectProductDialog.value = true;
  drawerApiProduct.open();
};
const customerName = ref('');

// 获取挂单列表
const fetchOrderSuspendList = async () => {
  orderSuspendParams.value.customer_keywords = customerName.value;
  try {
    const res = await orderSuspendListApi(orderSuspendParams.value);
    suspendList.value = res?.list;
    suspendList.value.forEach((item) => {
      item.totalQuantity = '';
      item.order_holding.forEach((holdItem) => {
        item.totalQuantity += holdItem.order_holding_item_list.reduce(
          (acc, curr) => {
            return acc + curr.quantity;
          },
          0,
        );
      });
      // .order_holding_item_list.reduce((acc, curr) => {
      //   return acc + curr.quantity;
      // }, 0);
    });
  } catch (error: any) {
    ElMessage.error(error.message);
  }
};
const handleSearchClick = async () => {
  fetchOrderSuspendList();
};
// 删除 rowSelection ref
// const rowSelection = ref([]);

// 修改 handleSelectionChange 函数
const handleSelectionChange = (selection, row) => {
  if (selection.length > 0) {
    handleTakeOrder(row);
  }
};
const handChangeOfline = () => {
  getDetail();
};
const currentInfo = ref({});
const getDetail = async () => {
  const res = await orderHoldingDetailApi({
    id: currentId.value,
  });
  currentInfo.value = res;
};
const removeHandler = () => {
  ElMessageBox.confirm(t('scan.delete-confirm'), t('scan.tips'), {
    confirmButtonText: t('scan.confirm'),
    cancelButtonText: t('scan.cancel'),
    type: 'warning',
  }).then(async (event) => {
    if (event === 'confirm') {
      const res = await orderHoldingRemoveApi({
        order_holding_id_list: [currentInfo.value.id],
      });
      fetchOrderSuspendList();
      currentId.value = '';
      currentInfo.value = {};
      handleClose();
      emit('calculationBadgeCount', true);
    }
  });
};
// 取单
const handleTakeOrder = async (row) => {
  try {
    emit('handleTakeOrderInfo', row);
    if (isSuspend.value) {
      const res = await orderHoldingRemoveApi({
        order_holding_id_list: [row.id],
      });
      currentId.value = '';
      currentInfo.value = {};
      ElMessage.success(t('scan.take-success'));
      fetchOrderSuspendList();
      handleClose();
      emit('calculationBadgeCount', true);
    }
  } catch (error) {
    console.log(error);
  }
};
const confirmHandler = async (data) => {
  const params = {
    id: currentInfo.value.id,
    order_holding: currentInfo.value?.order_holding,
  };
  data.forEach((item) => {
    item.product_id = item.id;
    item.quantity = item.sale_warehouse_product_stock_quantity;
    item.warehouse_id = item.sale_warehouse_id;
    item.warehouse_name = item.sale_warehouse_name;
  });
  // 现有的商品与添加商品product_id相同的情况下,比对价格与仓库信息是否相同
  // 如果不同,则跳过这个商品,添加其余商品
  let newOrderHolding = [];
  const orderHoldingitemList = [];
  currentInfo.value?.order_holding?.forEach((item) => {
    newOrderHolding = [...newOrderHolding, ...item.order_holding_item_list];
  });
  if (newOrderHolding.length > 0) {
    data.forEach((item) => {
      const findIndex = newOrderHolding.findIndex(
        (i) => i.product_id === item.product_id,
      );
      if (findIndex === -1) {
        orderHoldingitemList.push(item);
      } else {
        if (
          newOrderHolding[findIndex].selling_price === item.custom_price &&
          newOrderHolding[findIndex].warehouse_id === item.warehouse_id
        ) {
          orderHoldingitemList.push(item);
        } else {
          ElMessage.warning(t('scan.product-price-or-warehouse-not-same'));
        }
      }
    });
  }

  if (orderHoldingitemList.length > 0) {
    params.order_holding.push({
      guider_id: '',
      order_holding_item_list: orderHoldingitemList,
    });
  }
  const res = await orderHoldingModifyApi(params);
  isSelectProductDialog.value = false;
  getDetail();
  fetchOrderSuspendList();
};
const handleReplaceCustomer = () => {
  drawerApiCustomer.open();
};
const handleEditGuider = () => {
  drawerApiGuider.open();
};
const handleSelectCustomerRow = (row) => {
  currentInfo.value.customer_id = row.id;
  currentInfo.value.customer_name = row.name;
  currentInfo.value.phone_number = row.phone_number;

  // 如果顾客信息不为空 计算订单价格
  // if (customerInfo.value && mergeGoodsList.value.length > 0) {
  //   calculateOrderPrice();
  // }
};
const confirmClose = () => {
  drawerDetailsCustomers.value.visible = false;
};
const handleSelectGuiderRow = async (row) => {
  currentInfo.value.guider_id = row.user_id;
  const res = await orderHoldingModifyApi(currentInfo.value);
  getDetail();
  drawerDetailsGuider.value.visible = false;
};
const confirmGuiderClose = () => {
  drawerDetailsGuider.value.visible = false;
};
// 删除 selectable 函数，因为不再需要
// 行选择
const rowSelection = ref([]);
// const selectionOrderRow = inject('selectionOrderRow');
// const handleSelectionChange = selection => {
//   rowSelection.value = selection;
// };
const handleDelete = async (row, index) => {
  if (
    currentInfo.value.order_holding[index].order_holding_item_list.length == 1
  ) {
    currentInfo.value.order_holding[index].order_holding_item_list.splice(
      index,
      1,
    );
  } else {
    currentInfo.value.order_holding[index].order_holding_item_list.splice(
      index,
      1,
    );
  }
  const params = {
    id: currentInfo.value.id,
    order_holding: currentInfo.value.order_holding,
  };
  const res = await orderHoldingModifyApi(params);
  if (currentInfo.value.order_holding[index].length === 0) {
    currentInfo.value = {};
    currentId.value = '';
    return false;
  }
  fetchOrderSuspendList();
  getDetail();
};

function handleCellClick(row) {
  handleTakeOrder(currentInfo.value);
}
// 打印相关
const printTemplate = ref({});

const printBtn = ref(null);
// 打印全部
const handlePrintTakeAll = async () => {
  const params = {
    type: 'PRELIMINARY_BILL_RECEIPT',
  };
  const res = await getCustomTemplateListApi(params);
  printTemplate.value = res.find((item) => item.is_default) || {};

  if (Object.keys(printTemplate.value).length > 0) {
    const order_item_model_list = [];
    currentInfo.value.order_holding.forEach((item) => {
      item.order_holding_item_list.forEach((item) => {
        order_item_model_list.push(item);
      });
    });
    currentInfo.value.order_item_model_list = order_item_model_list;
  }
  // 模拟按钮点击事件 ref=printBtn
  const printDom = document.querySelector('#printBtn');
  setTimeout(() => {
    printDom.click();
  }, 500);

  // sendOrderHoldingRemove(ids)
};
const handlePrintTake = async (index) => {
  const params = {
    type: 'PRELIMINARY_BILL_RECEIPT',
  };
  const res = await getCustomTemplateListApi(params);
  printTemplate.value = res.find((item) => item.is_default) || {};

  const order_item_model_list = [];
  if (Object.keys(printTemplate.value).length > 0) {
    currentInfo.value.order_holding[index].order_holding_item_list.forEach(
      (item) => {
        order_item_model_list.push(item);
      },
    );
    currentInfo.value.order_item_model_list = order_item_model_list;
  }
  // 模拟按钮点击事件 ref=printBtn
  const printDom = document.querySelector('#printBtn');
  setTimeout(() => {
    printDom.click();
  }, 500);
};

// // 取单
// const handleTakeOrder = async () => {
//   // 是否选中
//   if (!rowSelection.value.length) {
//     ElMessage.warning('Please select an order');
//     return;
//   }
//   emit('handleTakeOrderInfo', rowSelection.value[0]);
//   // 删除这个单
//   try {
//     const res = await OrderService.orderSuspendDelete({
//       order_holding_id_list: [rowSelection.value[0].id],
//       merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id
//     });
//     if (String(res.code) === 'SUCCESS') {
//       ElMessage.success(t('scan.takeSuccess'));
//       fetchOrderSuspendList();
//       handleClose();
//       emit('calculationBadgeCount', true);
//     } else {
//       ElMessage.warning(res.message);
//     }
//   } catch (error: any) {
//     ElMessage.error(error.message);
//   }
// };
// 禁用
const selectable = (row) => {};
watch(
  () => props.drawerReturnShow,
  (val) => {
    if (val) {
      isReturnShow.value = true;
      fetchOrderSuspendList();
    }
  },
);
onMounted(() => {
  fetchOrderSuspendList();
});
defineExpose({
  suspendList,
});
</script>

<template>
  <Drawer>
    <!-- 列表关闭栏 -->
    <div class="relative h-full w-full overflow-hidden">
      <ElRow :gutter="5" class="h-full">
        <ElCol :span="6" class="h-full">
          <ElScrollbar class="h-full">
            <div class="select-products-search-box flex p-2">
              <div class="select-products-search flex w-full">
                <ElInput
                  v-model="customerName"
                  :clearable="true"
                  class="h-13"
                  :placeholder="$t('scan.please-enter-the-customer-name')"
                />
                <ElButton
                  class="w-25 h-full"
                  type="primary"
                  @click="handleSearchClick"
                >
                  {{ t('scan.search') }}
                </ElButton>
              </div>
            </div>
            <div class="px-5 py-2">
              <!-- 挂单选择 -->
              <ElRadioGroup
                v-model="currentId"
                style="width: 100%"
                @change="handChangeOfline"
              >
                <ElRadio
                  v-for="item in suspendList"
                  :key="item.id"
                  class="take-left-radio relative"
                  :class="currentId === item.id ? 'take-left-radio-active' : ''"
                  :value="item.id"
                  :label="item.id"
                >
                  <HoldOrderTakeCard
                    :active="currentId === item.id"
                    :item-info="item"
                  />
                  <img
                    :src="floatingLayerArrowIcon"
                    class="absolute right-[-15px] top-1/2 h-3 w-6 -translate-y-1/2"
                    v-if="currentId === item.id"
                  />
                </ElRadio>
              </ElRadioGroup>
            </div>
          </ElScrollbar>
        </ElCol>
        <ElCol :span="18" class="h-full">
          <!-- 调整为垂直flex布局，商品明细占剩余高度，间距固定10px -->
          <div class="flex h-full flex-col gap-2.5">
            <Card
              v-if="Object.keys(currentInfo).length > 0"
              :header="t('scan.basic-details')"
              class="flex-shrink-0 border-0"
            >
              <div>
                <div class="basic-details-info flex items-center gap-1">
                  <span>{{ t('scan.customer') }}:</span>
                  <p>
                    {{ currentInfo?.customer_name || '-' }}/{{
                      currentInfo?.phone_number || '-'
                    }}
                  </p>
                  <ElButton
                    color="#C6E2FF"
                    class="ml-2"
                    @click="handleReplaceCustomer"
                  >
                    <span class="text-blue-primary">
                      {{
                        currentInfo.customer_id &&
                        currentInfo.customer_id != '0'
                          ? t('scan.replace')
                          : t('scan.select')
                      }}
                    </span>
                  </ElButton>
                </div>
                <div
                  v-if="currentInfo.remark"
                  class="basic-details-info mt-2.5 flex items-center gap-1"
                >
                  <span>{{ t('scan.remarks') }}:</span>
                  <p>{{ currentInfo?.remark || '' }}</p>
                </div>
              </div>
            </Card>
            <Card
              v-if="Object.keys(currentInfo).length > 0"
              :header="t('scan.product-details')"
              class="flex min-h-0 flex-1 flex-col border-0"
            >
              <div class="min-h-0 flex-1">
                <ElScrollbar class="h-full">
                  <div
                    v-for="(item, holdIndex) in currentInfo.order_holding"
                    :key="item.id"
                  >
                    <div class="order-table-header-info bg-cloud-white">
                      <div class="flex flex-wrap items-center gap-2">
                        <span class="order-table-header-info-time">{{
                          item?.create_time || '-'
                        }}</span>
                        <p class="text-light-gray">
                          {{ currentInfo?.guider_name || '-' }}
                          <ElButton
                            link
                            type="primary"
                            @click="handleEditGuider(index)"
                          >
                            <i
                              class="icon iconfont icon-icon_Edit ml-[10px] text-base"
                            ></i>
                          </ElButton>
                        </p>
                      </div>
                      <div class="order-take-print-btn-group mt-2.5">
                        <ElButton
                          v-if="holdIndex == 0"
                          class="order-take-print-btn"
                          color="#C6E2FF"
                          @click="handlePrintTakeAll"
                        >
                          <span class="text-blue-primary">{{
                            $t('scan.hold-take.print-take-all')
                          }}</span>
                        </ElButton>
                        <ElButton
                          class="order-take-print-btn"
                          color="#C6E2FF"
                          @click="handlePrintTake(holdIndex)"
                        >
                          <span class="text-blue-primary">{{
                            $t('scan.hold-take.print-take')
                          }}</span>
                        </ElButton>
                      </div>
                    </div>
                    <div class="order-table-box">
                      <ElTable
                        :data="item?.order_holding_item_list"
                        header-row-class-name="take-table-header"
                      >
                        <ElTableColumn
                          v-for="(schema, index) in codeConfig"
                          :key="index"
                          :align="schema.align || 'left'"
                          :label="t(schema.label)"
                          :prop="schema.field"
                        />
                        <ElTableColumn :label="t('common.action')">
                          <template #default="scope">
                            <ElButton
                              v-auth="['sale_hold_detele']"
                              type="danger"
                              link
                              @click="handleDelete(scope.row, holdIndex)"
                            >
                              <ElText type="danger" tag="ins">
                                {{ t('common.delete') }}
                              </ElText>
                            </ElButton>
                          </template>
                        </ElTableColumn>
                      </ElTable>
                    </div>
                  </div>
                </ElScrollbar>
              </div>
              <div
                class="bg-linen text-dark-gray mt-2.5 flex h-11 items-center justify-end gap-2 pl-2 pr-2 text-[12px]"
              >
                <span>
                  {{ t('scan.columns.QTY') }}:
                  <span class="text-orange-medium">{{
                    currentInfo?.quantity || 0
                  }}</span>
                </span>
                <span>
                  {{ t('common.total-amount') }}:
                  <span class="text-coral-light">{{
                    currentInfo?.total_amount || ''
                  }}</span>
                </span>
              </div>
            </Card>
            <div
              class="w-full flex-shrink-0 px-5"
              v-if="Object.keys(currentInfo).length > 0"
            >
              <div class="flex w-full items-center justify-between">
                <div class="order-take-action-delete">
                  <ElButton
                    v-auth="['sale_hold_detele']"
                    class="mr-[10px] h-11"
                    type="danger"
                    @click.stop="removeHandler"
                  >
                    {{ t('scan.hold-take.delete') }}
                  </ElButton>
                </div>
                <div class="take-right-bottom">
                  <ElButton
                    color="#D1EDC4"
                    class="mr-[10px] h-11"
                    @click="handleSelectProducts"
                  >
                    <span class="text-grass-green">{{
                      t('scan.hold-take.add')
                    }}</span>
                  </ElButton>
                  <ElButton
                    class="h-11"
                    type="primary"
                    @click="handleCellClick"
                  >
                    <span>{{ t('scan.hold-take.take') }}</span>
                  </ElButton>
                </div>
              </div>
            </div>
          </div>
        </ElCol>
      </ElRow>
      <!-- @calculation-badge-count="handleCalculationBadgeCount" -->
      <SelectProducts
        key="selectProductsRefs"
        ref="selectProductsRef"
        :drawer-return-show="isSelectProductDialog"
        :drawer-return-title="takeTitle"
        @close-tkr="handleCloseSelectProducts"
        @handle-take-order-info="handleTakeOrder"
        @confirm="confirmHandler"
      />
      <!-- 选择顾客 -->
      <SelectCustomersDrawer
        key="takeCustomersDrawer"
        :title="drawerDetailsCustomers.title"
        :show-dialog="drawerDetailsCustomers.visible"
        @close-tkr="confirmClose"
        @select-customer-row:row="handleSelectCustomerRow"
      />
      <!-- 选择导购员 -->
      <SelectGuiderDrawer
        key="takeGuiderDrawer"
        :title="drawerDetailsGuider.title"
        :show-dialog="drawerDetailsGuider.visible"
        @close-tkr="confirmGuiderClose"
        @select-customer-row:row="handleSelectGuiderRow"
      />
      <div class="absolute z-0">
        <ReceiptTemplate
          :print-id="printParams.ids"
          :option-content="printTemplate.option_content"
          :image-url="printTemplate.profile_photo"
          :print-info="[{ ...currentInfo, Template: { ...printTemplate } }]"
          template-type="PRELIMINARY_BILL_RECEIPT"
          :is-barcode="false"
          :roles="receiptRoles"
        />
        <div class="btn-box">
          <ElButton id="printBtn" v-print="printParams" class="save-btn">
            {{ t('common.print') }}1`11111`
          </ElButton>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<style lang="scss" scoped>
.close86 {
  z-index: 2399;
}

.scan-dialog-btn {
  padding: 20px 0;
  text-align: center;
  background: #fff;
  border-top: 1px solid #eee;

  .btn-common {
    width: 160px;
    height: 50px;
    margin: 0 10px;

    &:nth-child(1) {
      background: #dfdfdf;
    }

    &:nth-child(2) {
      color: #fff;
      background: #0d99ff;
    }
  }
}

.btn-common {
  width: 160px;
  height: 50px;
}
</style>
<style lang="scss">
.take-left-radio {
  box-sizing: border-box;
  width: 100%;
  height: 100% !important;
  padding: 10px 8px;
  margin-right: 0;
  margin-bottom: 10px;
  border: 1px solid #ebf5ff;
  border-radius: 4px;
  box-shadow: 1px 1px 7.3px 0 #d6edff;

  .el-radio__label {
    display: block;
    width: 100%;
    height: 100%;
    color: inherit !important;
  }
}

.scrollbar-box {
  height: calc(100vh - 800px);
}

.take-left-radio-active {
  background-color: var(--primary);
  border: 2px solid var(--el-color-primary) !important;
}

.take-table-header {
  background-color: red !important;
}
</style>
