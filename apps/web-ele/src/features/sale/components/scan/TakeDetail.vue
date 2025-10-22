<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue';

import {
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
import { useSelectCustomer } from '@@/sale/hooks';

import { ReceiptTemplate } from '#/components/receipt-template'; // 生成小票模板

import HoldOrderTakeCard from './HoldOrderTakeCard.vue';
import SelectGuiderDrawer from './SelectGuiderDrawer.vue';
import SelectProducts from './SelectProducts.vue';

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
  isSelectProductDialog.value = true;
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
  drawerDetailsGuider.value = {
    title: t('scan.select-guider'),
    visible: true,
  };
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

  // advanceStatement.value = data.find(item => item.is_default) || {}
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
  <div class="coupon-send">
    <Drawer>
      <!-- 列表关闭栏 -->
      <div class="drawer-container">
        <div class="drawer-content">
          <div class="drawer-content-box">
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
                  <div class="drawer-content-left bg-white">
                    <!-- 挂单选择 -->
                    <ElRadioGroup
                      v-model="currentId"
                      style="width: 100%"
                      @change="handChangeOfline"
                    >
                      <ElRadio
                        v-for="item in suspendList"
                        :key="item.id"
                        class="take-left-radio"
                        :class="
                          currentId == item.id ? 'take-left-radio-active' : ''
                        "
                        :value="item.id"
                        :label="item.id"
                      >
                        <HoldOrderTakeCard :item-info="item" />
                      </ElRadio>
                    </ElRadioGroup>
                  </div>
                </ElScrollbar>
              </ElCol>
              <ElCol :span="18" class="h-full">
                <div
                  v-if="Object.keys(currentInfo).length > 0"
                  class="drawer-content-right h-full"
                >
                  <div class="basic-details bg-white">
                    <div class="basic-details-title">
                      {{ t('scan.basic-details') }}
                    </div>
                    <div
                      class="basic-details-info mt-2.5 flex items-center gap-1"
                    >
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
                        <span class="text-blue-primary">{{
                          currentInfo.customer_id &&
                          currentInfo.customer_id != '0'
                            ? t('scan.replace')
                            : t('scan.select')
                        }}</span>
                      </ElButton>
                    </div>
                    <div
                      v-if="currentInfo.remark"
                      class="basic-details-info mt-2.5 flex items-center gap-1"
                    >
                      <span>{{ t('scan.remarks') }}:</span>
                      <p>
                        {{ currentInfo?.remark || '' }}
                      </p>
                    </div>
                  </div>
                  <div class="basic-details mt-[5px] bg-white">
                    <div class="basic-details-title">
                      {{ t('scan.product-details') }}
                    </div>
                    <ElScrollbar class="scrollbar-box">
                      <div
                        v-for="(item, holdIndex) in currentInfo.order_holding"
                        :key="item.id"
                      >
                        <div
                          class="order-table-header-info bg-cloud-white mt-2.5"
                        >
                          <div class="order-table-header-info-left">
                            <span class="order-table-header-info-time">{{
                              item?.create_time || '-'
                            }}</span>
                            <span class="text-light-gray">
                              <!-- {{ currentInfo?.guider_login_id || '-' }} -->
                              {{ currentInfo?.guider_name || '-' }}
                              <ElButton
                                link
                                type="primary"
                                @click="handleEditGuider(index)"
                              >
                                <i
                                  class="icon iconfont icon-icon_Edit ml-[10px]"
                                ></i></ElButton></span>
                          </div>
                          <div class="order-take-print-btn-group">
                            <ElButton
                              v-if="holdIndex == 0"
                              class="order-take-print-btn"
                              color="#C6E2FF"
                              @click="handlePrintTakeAll"
                            >
                              <span class="text-blue-primary">
                                {{ $t('scan.hold-take.print-take-all') }}</span>
                            </ElButton>

                            <ElButton
                              class="order-take-print-btn"
                              color="#C6E2FF"
                              @click="handlePrintTake(holdIndex)"
                            >
                              <span class="text-blue-primary">
                                {{ $t('scan.hold-take.print-take') }}
                              </span>
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
                    class="bg-linen text-dark-gray mt-2 flex h-11 items-center justify-end gap-2 pl-2 pr-2 text-[12px]"
                  >
                    <span>{{ t('scan.columns.QTY') }}:
                      <span class="text-orange-medium">{{
                        currentInfo?.quantity || 0
                      }}</span>
                    </span>
                    <span>{{ t('common.total-amount') }}:
                      <span class="text-coral-light">
                        {{ currentInfo?.total_amount || '' }}
                      </span>
                    </span>
                  </div>
                  <div class="takeOrderAtion bg-white">
                    <div class="order-take-action">
                      <!-- v-auth="['sale_hold_detele']" -->
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
                          <span> {{ t('scan.hold-take.take') }}</span>
                        </ElButton>
                      </div>
                    </div>
                  </div>
                </div>
              </ElCol>
            </ElRow>
          </div>
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

          <!-- <el-table
            ref="tableRef"
            :data="suspendList || []"
            :header-cell-style="{
              background: '#F6F8FC',
              color: '#323232',
              height: '30px'
            }"
            style="width: 100%"
            stripe
            border
            class="down-table-list"
            single-selection
            @select="handleSelectionChange"
            @cell-click="handleCellClick"
          >
            <template v-for="(item, index) in columnsVisible">
              <el-table-column
                v-if="item.prop === 'id'"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :align="item.align"
                :fixed="item.fixed"
              >
              </el-table-column>
              <el-table-column
                v-if="item.prop === 'totalQuantity'"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :align="item.align"
              >
              </el-table-column>
              <el-table-column
                v-else-if="item.prop === 'product_code'"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :align="item.align"
              >
              </el-table-column>
              <el-table-column
                v-else-if="['customer_name', 'create_time', 'origin_quantity'].includes(item.prop)"
                :key="item.align"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :align="item.align"
              >
              </el-table-column>
            </template>
            <el-table-column :label="t('scan.action')" width="100" align="center" fixed="right">
              <template #default="scope">
                <el-button link type="primary" size="small" @click.stop="handleDelete(scope.row.id)">
                  <i class="iconfont icon-shanchu2 shanchu"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table> -->
        </div>
      </div>
      <div class="AdvanceStatement absolute z-0">
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
            {{ t('common.print') }}
          </ElButton>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<style lang="scss" scoped>
.close86 {
  z-index: 2399;
}
//新样式
.drawer-content-box {
  width: calc(100% - 10px);
  height: calc(100vh - 90px);

  .drawer-content-left {
    height: calc(100vh - 164px);
    padding: 10px 20px;
  }

  .drawer-content-left {
    height: calc(100vh - 164px);
  }

  .basic-details {
    width: 100%;
    padding: 10px 20px;
    border-radius: 4px;

    .basic-details-title {
      display: flex;
      gap: 5px;
      align-items: center;
      padding-bottom: 2px;
      border-bottom: 1px solid #eee;

      &::before {
        clear: both;
        display: block;
        width: 4px;
        height: 10px;
        content: '';
        background: #0d99ff;
        border-radius: 4px;
      }
    }

    .basic-details-info {
      font-size: 14px;

      span {
        font-weight: 700;
      }
    }

    .order-table-header-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 10px;

      .order-table-header-info-left {
        display: flex;
        gap: 10px;

        .icon {
          font-size: 12px;
        }
      }

      .order-table-header-info-time {
        font-weight: 700;
      }

      :last-child {
      }
    }

    .take-order-info {
    }
  }

  .takeOrderAtion {
    // height: 66px;
    padding: 11px 10px;
  }

  .order-take-action {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-delete {
      // padding-top: 15px;
    }
  }
}

.drawer-title {
  height: 112px;
  padding-top: 37px;
  padding-left: 50px;
  text-align: left;
  background: #fff;
  border-bottom: 1px solid #eee;

  .title {
    font-size: 24px;

    .icon-bangzhu {
      color: #7d90b2;
    }
  }
}

.drawer-content {
  margin-top: 5px;

  .down-table-list {
    //width: 1123px;
    height: 511px;
  }

  :deep(.el-table .el-table__header) {
    width: 100% !important;
  }

  :deep(.el-table .el-table__body) {
    width: 100% !important;
  }
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}

.drawer-title {
  font-size: 24px;
  font-weight: bold;
}

.drawer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
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
  height: calc(100vh - 400px);
}

.take-left-radio-active {
  background-color: var(--primary);
}
</style>
