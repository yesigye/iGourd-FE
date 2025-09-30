<script setup lang="ts">
import {
  computed,
  onMounted,
  provide,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';

import {
  ElBadge,
  ElButton,
  ElCol,
  ElMessage,
  ElMessageBox,
  ElRow,
  Page,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  getOrderPriceApi,
  inventoryProductDetailApi,
  orderCreateApi,
  orderDetailApi,
  orderSuspendListApi,
  productPageListApi,
} from '@@/sale/apis';
import ScanDialog from '@@/sale/components/scan/ScanDialog.vue';
import ScanOrderSettle from '@@/sale/components/scan/ScanOrderSettle.vue';
import ScanSearch from '@@/sale/components/scan/ScanSearch.vue';
import ScanTable from '@@/sale/components/scan/ScanTable.vue';
import SelectGuiderDrawer from '@@/sale/components/scan/SelectGuiderDrawer.vue';
import { useSelectCustomer } from '@@/sale/hooks';
import { storeToRefs } from 'pinia';

import { useOrderStore } from '#/store/sale/order';
import { useSetStore } from '#/store/sale/setStore';
import { useSaleSettleStore } from '#/store/sale/settle';
import {
  initializeCurrencySymbol,
  mergeByIdArray,
  thousandSeparator,
} from '#/utils/sale';

defineOptions({
  name: 'IScanSale',
});
// const { merchantInfo } = useUserStore();
const { setInfo } = storeToRefs(useSetStore());
const { Drawer: SelectCustomer, drawerApi } = useSelectCustomer();
const { t } = useI18n();

const state = reactive({
  drawerDialog: {
    title: '',
    visible: false,
  },
  drawerDialogCustomers: {
    title: '',
    visible: false,
  },
  drawerDialogGuider: {
    title: '',
    visible: false,
  },
  goodsList: [],
  customerInfo: {},
  scanContentRef: null,
  scanDialogVisible: false,
  rowSelection: null,
  scanSearchRef: null,
  newlyAddedProduct: null,
  totalPrice: 0,
  orderData: null,
  calculateOrderList: [],
  selectionOrderRow: [],
  isSuspendSuccess: false,
  isSuspend: false,
  orderCaclProductList: [],
  mergeGoodsList: [],
});
const {
  drawerDialog,
  drawerDialogCustomers,
  drawerDialogGuider,
  goodsList,
  customerInfo,
  scanContentRef,
  scanDialogVisible,
  rowSelection,
  scanSearchRef,
  newlyAddedProduct,
  totalPrice,
  orderData,
  calculateOrderList,
  selectionOrderRow,
  isSuspendSuccess,
  isSuspend,
  orderCaclProductList,
  mergeGoodsList,
} = toRefs(state);

const { orderInfo, orderSerialNo, serialNo } =
  storeToRefs(useSaleSettleStore());

const orderStore = useOrderStore();
const { mergeGoodsList: storeMergeGoodsList } = storeToRefs(orderStore);
const { userInfo } = storeToRefs(useUserStore());
// 订单价格计算
const orderPriceParams = ref({
  channel: 'WEB',
  coupon_id: null,
  customer_id: null,
  device_id: null,
  guider_id: null,
  merchant_id: null,
  order_calc_product_volist: [
    {
      product_id: null,
      quantity: null,
      merchant_id: null,
      product_unit_id: null,
      product_code: '',
      product_name: '',
      product_unit_name: '',
    },
  ],
  salesman_id: '',
  pos_user_id: null,
  vat_configuration: 'VAT_EXCLUSIVE',
});
// 创建订单参数
const orderParams = ref({
  merchant_id: '',
  cash_change_amount: 0,
  cash_received_amount: 0,
  channel: 'WEB',
  coupon_amount: 0,
  coupon_id: '',
  customer_id: '',
  device_id: '',
  guider_id: '',
  order_item_volist: [
    {
      cost_price: 0,
      origin_price: 0,
      other_tax_amount: 0,
      price: 0,
      product_code: '',
      product_id: '',
      product_name: '',
      product_profile_photo: '',
      product_unit_id: '',
      product_unit_name: '',
      promotion_discount_amount: 0,
      promotion_discount_description: '',
      promotion_id: '',
      quantity: 0,
      selling_price: 0,
      subtotal_amount: 0,
      total_amount: 0,
      vat_amount: 0,
      vip_discount_amount: 0,
    },
  ],
  order_no: '',
  order_serial_no: '',
  serial_no: '',
  other_tax_amount: 0,
  payment_balance_amount: 0,
  payment_card_amount: 0,
  payment_card_type: 'CREDIT_CARD',
  payment_cash_amount: 0,
  payment_method: [],
  payment_third_party_amount: 0,
  payment_third_party_type: '',
  pos_user_id: '',
  price_level_id: '',
  promotion_discount_amount: 0,
  round_down_amount: 0,
  salesman_id: '',
  store_id: '',
  status: 'PENDING',
  subtotal_amount: 0,
  total_amount: 0,
  total_paid_amount: 0,
  vat_amount: 0,
  vat_configuration: 'VAT_EXCLUSIVE',
  vip_discount_amount: 0,
  vip_discount_description: '',
});

// 计算订单价格
const calculateOrderPrice = async () => {
  orderPriceParams.value.order_calc_product_volist = goodsList.value.map(
    (item) => ({
      product_id: item.id,
      quantity: item.stock_total_quantity,
      product_unit_id: item.product_unit_id,
      product_barcode: item.sku_barcode,
      product_code: item.product_code,
      product_name: item.major_name,
      product_unit_name: item.product_unit_name,
      custom_price: Number(item.custom_price || item.selling_price),
      merchant_id: item.merchant_id,
      is_modify_price: item.is_modify_price || false,
    }),
  );

  orderPriceParams.value.pos_user_id =
    userInfo.value?.user_model?.user_id || '';
  orderPriceParams.value.customer_id = customerInfo.value?.id;
  try {
    const res = await getOrderPriceApi(orderPriceParams.value);
    orderCaclProductList.value = res?.order_calc_product_model_list;
    // 适配临时改价
    orderCaclProductList.value.forEach((item) => {
      item.custom_price = item.custom_price || item.origin_price;
    });
    mergeGoodsList.value = mergeByIdArray(
      goodsList.value,
      orderCaclProductList.value,
    );
    calculateOrderList.value = res || [];
    orderParams.value.pos_user_id = res?.pos_user_id || '';
    orderParams.value.order_item_volist = [
      ...(res?.order_item_product_model_list || []),
    ];
    orderParams.value.subtotal_amount = res?.subtotal_amount;
    orderParams.value.total_amount = res?.total_amount;
    orderParams.value.total_discount_amount = res?.total_discount_amount;
    orderParams.value.vat_amount = res?.vat_amount;
    orderParams.value.vip_discount_amount = res?.vip_discount_amount;
    orderParams.value.coupon_amount = res?.coupon_amount ?? 0;
    orderParams.value.order_no = res?.order_no;
    orderParams.value.promotion_discount_amount =
      res?.promotion_discount_amount;
    orderParams.value.round_down_amount = res?.round_down_amount;
    orderParams.value.other_tax_amount = res?.other_tax_amount;
    orderParams.value.total_paid_amount = res?.total_paid_amount;
    orderParams.value.payment_method = res?.payment_method;
    orderParams.value.payment_cash_amount = res?.payment_cash_amount;
    orderParams.value.payment_card_amount = res?.payment_card_amount;
    orderParams.value.payment_third_party_amount =
      res?.payment_third_party_amount;
    orderParams.value.payment_third_party_type = res?.payment_third_party_type;
    orderParams.value.payment_balance_amount = res?.payment_balance_amount;
    orderParams.value.cash_received_amount = res?.cash_received_amount;
    orderParams.value.cash_change_amount = res?.cash_change_amount;
    orderParams.value.vat_configuration = res?.vat_configuration;
    // } else {
    //   ElMessage.error(res?.message);
    // }
  } catch (error) {
    ElMessage.error(error?.message);
    console.error('计算订单价格失败:', error);
  }
};

// 添加商品
const handleGoods = (item) => {
  const existingItemIndex = goodsList.value.findIndex(
    (good) => good.id === item.id,
  );
  if (existingItemIndex === -1) {
    // 如果是新商品，直接添加到列表中，并设置初始数量为1
    item.stock_total_quantity = 1;
    goodsList.value.push({ ...item, custom_price: item.selling_price });
    // 计算订单价格
    calculateOrderPrice();
  } else {
    // 如果商品已存在，增加数量
    goodsList.value[existingItemIndex].stock_total_quantity++;
    // 计算算费
    calculateOrderPrice();
  }
};

// 更新商品数量
const handleUpdateQuantity = (updatedItem, newProduct) => {
  // 更新商品列表中对应商品的数量
  const index = goodsList.value.findIndex((item) => item.id === updatedItem.id);
  if (index !== -1) {
    goodsList.value[index].custom_price = updatedItem.custom_price;
    goodsList.value[index].stock_total_quantity =
      updatedItem.stock_total_quantity;
    goodsList.value[index].is_modify_price = true;
    goodsList.value[index].sale_warehouse_product_stock_quantity_message =
      updatedItem.sale_warehouse_product_stock_quantity_message;
    goodsList.value[index].sale_warehouse_product_stock_quantity =
      updatedItem.sale_warehouse_product_stock_quantity;
  }
  // 更新总价
  calculateOrderPrice();
};
const handleUpdateUnit = (updatedItem, newProduct, existingProduct) => {
  if (existingProduct) {
    const index = goodsList.value.findIndex(
      (item) => item.id === updatedItem.id,
    );
    if (index !== -1) {
      const quantityToAdd = goodsList.value[index].stock_total_quantity;
      goodsList.value.splice(index, 1);

      const existingIndex = goodsList.value.findIndex(
        (item) => item.id === existingProduct.id,
      );
      if (existingIndex !== -1) {
        goodsList.value[existingIndex].stock_total_quantity += quantityToAdd;
      }
    }
  } else {
    const index = goodsList.value.findIndex(
      (item) => item.id === updatedItem.id,
    );
    if (index !== -1) {
      goodsList.value[index].custom_price = updatedItem.custom_price;
      goodsList.value[index].stock_total_quantity =
        updatedItem.stock_total_quantity;
      goodsList.value[index].sale_warehouse_product_stock_quantity_message =
        updatedItem.sale_warehouse_product_stock_quantity_message;
      if (newProduct != null && newProduct != undefined) {
        goodsList.value[index] = {
          ...newProduct,
          stock_total_quantity: 1,
          custom_price: newProduct.selling_price,
          warehouse_id:
            updatedItem.sale_warehouse_id || updatedItem.warehouse_id,
          warehouse_name:
            updatedItem.sale_warehouse_name || updatedItem.warehouse_name,
          sale_warehouse_id:
            updatedItem.sale_warehouse_id || updatedItem.warehouse_id,
          sale_warehouse_name:
            updatedItem.sale_warehouse_name || updatedItem.warehouse_name,
          sale_warehouse_product_stock_quantity:
            updatedItem.sale_warehouse_product_stock_quantity,
          sale_warehouse_product_stock_quantity_message:
            updatedItem.sale_warehouse_product_stock_quantity_message,
          sub_product_stock_search_models:
            updatedItem.sub_product_stock_search_models,
        };
      }
    }
  }
  // 更新总价
  calculateOrderPrice();
};
const handleProductAdded = (newProduct) => {
  const existingItemIndex = goodsList.value.findIndex(
    (item) => item.code === newProduct.code,
  );
  if (existingItemIndex === -1) {
    goodsList.value.push({ ...newProduct, stock_total_quantity: 1 });
  } else {
    goodsList.value[existingItemIndex].stock_total_quantity++;
  }
};

provide('goodsList', goodsList);
provide('totalPrice', totalPrice);
provide('calculateOrderList', calculateOrderList);
provide('selectionOrderRow', selectionOrderRow);
provide('rowSelection', rowSelection);
provide('customerInfo', customerInfo);
provide('orderData', orderData);
provide('isSuspend', isSuspend);
provide('mergeGoodsList', mergeGoodsList);

// 检查是否有下架商品
const hasOffSaleItems = computed(() => {
  return mergeGoodsList.value?.some((item) => item.status === 'OFF_SALE');
});

// 刷新商品列表
const handleRefresh = () => {
  // goodsList.value = [];
};
const handlePickOrderNew = () => {
  scanSearchRef.value.handlePickOrder();
};
// 挂单：打开挂单弹窗
const handlePickOrder = () => {
  drawerDialog.value.title = t('scan.pick-up-order');
  drawerDialog.value.visible = true;
};

const getProduct = async (id) => {
  const res = await inventoryProductDetailApi({
    id,
  });
  return res;
};
const badgeCount = ref(0);

const getHoldListNum = async () => {
  const orderSuspendParam = {};
  try {
    const res = await orderSuspendListApi({ ...orderSuspendParam });
    badgeCount.value = res.total;
  } catch (error) {
    console.log('获取挂单数:', error);
    ElMessage.error(error.message);
  }
};

// 挂单：更新商品列表
const updateGoodsList = (selectedOrder) => {
  if (goodsList.value.length > 0) {
    ElMessage.warning(t('scan.list-has-retail-goods'));
    isSuspend.value = false;
  } else {
    getHoldListNum();
    // phone_number points balance salesman_name user_id name
    customerInfo.value.id = selectedOrder.customer_id;
    customerInfo.value.phone_number = selectedOrder.phone_number;
    customerInfo.value.points = selectedOrder.points;
    customerInfo.value.balance = selectedOrder.balance;
    customerInfo.value.salesman_name = selectedOrder.salesman_name;
    customerInfo.value.name = selectedOrder.customer_name;
    guiderInfo.value.user_id = selectedOrder.guider_id;
    guiderInfo.value.name = selectedOrder.guider_name;
    guiderInfo.value.login_id = selectedOrder.guider_login_id;

    isSuspend.value = true;
    const promises = [];
    selectedOrder.order_holding.forEach((item) => {
      promises.push(
        ...item.order_holding_item_list.map((item) => {
          return getProduct(item.product_id).then((res) => {
            {
              const product = res.data;
              return {
                id: product.id,
                code: product.product_code,
                major_name: product.major_name,
                stock_total_quantity: item.quantity || 1,
                stock_total_quantity_message:
                  item?.stock_total_quantity_message,
                sale_warehouse_product_stock_quantity:
                  product?.sale_warehouse_product_stock_quantity,
                sale_warehouse_product_stock_quantity_message:
                  product?.sale_warehouse_product_stock_quantity_message,

                custom_price: item.custom_price || product.selling_price,
                product_unit_id: product.product_unit_id,
                product_unit_name: product.product_unit_name,
                profile_photo: product.product_profile_photo,
                cost_price: item.cost_price || product.cost_price || 0,
                selling_price: item.selling_price || product.selling_price || 0,
                merchant_id: product.merchant_id,
                product_code: product.product_code,
                basic_unit_id: product.basic_unit_id,
                basic_unit_name: product.basic_unit_name,
                basic_unit_radio: product.basic_unit_radio,
                sale_warehouse_id: product.sale_warehouse_id,
                sale_warehouse_name: product.sale_warehouse_name,
                product_spec_kvmessage: product.product_spec_kvmessage,
                sub_product_stock_search_models:
                  product.sub_product_stock_search_models,
              };
            }
          });
        }),
      );
    });
    Promise.all(promises)
      .then((products) => {
        // id相同的商品合并  stock_total_quantity相加 返回新的products
        const mergedProducts = [];
        products.forEach((product) => {
          const findData = mergedProducts.find(
            (item) => item.id === product.id,
          );
          if (findData) {
            findData.stock_total_quantity += product.stock_total_quantity;
          } else {
            mergedProducts.push(product);
          }
        });
        goodsList.value = mergedProducts;
        if (goodsList.value.length > 0) {
          calculateOrderPrice();
        } else {
          ElMessage.warning(t('scan.suspend-failed'));
        }
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        ElMessage.error(t('scan.suspend-failed'));
      });
  }
};

const handleSelectCustomer = () => {
  // drawerDialogCustomers.value.title = t('scan.select-customers');
  // drawerDialogCustomers.value.visible = true;
  drawerApi.open();
};
const clearCustomerInfo = () => {
  customerInfo.value = {};
  goodsList.value.forEach((item) => {
    item.is_modify_price = false;
  });
  calculateOrderPrice();
};
const handleSelectGuider = () => {
  drawerDialogGuider.value.title = t('scan.select-guider');
  drawerDialogGuider.value.visible = true;
};
const handleSelectCustomerRow = (row) => {
  customerInfo.value = row;
  goodsList.value.forEach((item) => {
    item.is_modify_price = false;
  });
  // 如果顾客信息不为空 计算订单价格
  if (customerInfo.value && mergeGoodsList.value.length > 0) {
    calculateOrderPrice();
  }
};
const guiderInfo = ref({});
const handleSelectGuiderRow = (row) => {
  guiderInfo.value = row;
};

const confirmClose = () => {
  drawerDialog.value.visible = false;
  drawerDialogCustomers.value.visible = false;
  calculateOrderList.value = {};
};
const confirmClosePay = () => {
  calculateOrderList.value = {};
  drawerDialog.value.visible = false;
};
const confirmGuiderClose = () => {
  drawerDialogGuider.value.visible = false;
};

// 挂单：打开挂单弹窗
const handleHangOrder = () => {
  // 如果列表为空 暂无挂单的商品
  if (goodsList.value.length === 0) {
    ElMessage.warning(t('scan.no-goods-to-hang'));
    return;
  }
  scanDialogVisible.value = true;
};

const handleSelectRow = (val) => {
  rowSelection.value = val;
};

const hanleIsSuspend = (val) => {
  // 挂单成功 清空商品列表
  isSuspendSuccess.value = val;
  if (val) {
    goodsList.value = [];
    customerInfo.value = {};
    guiderInfo.value = {};
  } else {
    // 挂单失败 不进行操作
    ElMessage.error(t('scan.suspend-failed'));
  }
};

const refreshCalculationBadgeCount = (val) => {
  calculateOrderPrice();
  if (val) {
    isSuspendSuccess.value = false;
  }
  // 计算算费
};

const handleScanDialogVisible = () => {
  scanDialogVisible.value = false;
};

// 删除商品 清空数量 重新计算订单价格
const handleDeleteGoods = (goodsId) => {
  // 是否要删除
  ElMessageBox.confirm(t('scan.delete-goods'), t('scan.confirm'), {
    confirmButtonText: t('scan.yes'),
    cancelButtonText: t('scan.no'),
  }).then(() => {
    goodsList.value = goodsList.value.filter((item) => item.id !== goodsId);
    calculateOrderPrice();
  });
};

const handleSettleEmpty = () => {
  goodsList.value = [];
  mergeGoodsList.value = [];
  customerInfo.value = [];
  guiderInfo.value = {};
  // debugger;
  // scanPaymentRef.value.clearSettle();
};

// 查询订单详情
const getOrderDetail = async (order_no: string) => {
  const res = await orderDetailApi({
    order_no,
  });
  orderData.value = res;
};

// 添加订单
const addOrder = async () => {
  orderParams.value.customer_id = customerInfo.value?.id;
  orderParams.value.order_serial_no = orderSerialNo.value;
  orderParams.value.serial_no = serialNo.value;
  orderParams.value.order_item_volist = mergeGoodsList.value.map((newItem) => {
    const item = newItem.calcInfo || {};
    return {
      cost_price: item.cost_price,
      origin_price: item.origin_price,
      other_tax_amount: item.other_tax_amount,
      price: item.price,
      product_barcode: newItem.sku_barcode,
      product_code: newItem.product_code,
      price_type:
        newItem.selling_price == newItem.custom_price
          ? 'NORMAL'
          : 'CUSTOM_PRICE', // 自定义价格,
      quantity: newItem.stock_total_quantity,
      product_id: newItem.id,
      product_name: `${newItem.major_name}${
        newItem.product_spec_kvmessage
          ? `-${newItem.product_spec_kvmessage}`
          : ''
      }`,
      product_profile_photo: item.product_profile_photo, // 将 profile_photo 映射到 product_profile_photo
      product_unit_id: item.product_unit_id,
      product_unit_name: item.product_unit_name,
      promotion_discount_amount: item.promotion_discount_amount,
      promotion_discount_description: item.promotion_discount_description,
      promotion_id: item.promotion_id,
      selling_price: item.selling_price,
      subtotal_amount: item.subtotal_amount,
      total_amount: item.total_amount,
      vat_amount: item.vat_amount,
      vip_discount_amount: item.vip_discount_amount,

      product_profile_id: newItem.product_profile_id || '',
      basic_product_id: newItem.basic_product_id || '',
      basic_unit_id: newItem.basic_unit_id || '',
      basic_unit_name: newItem.basic_unit_name || '',
      basic_unit_radio: newItem.basic_unit_radio || '',
      warehouse_id: newItem.sale_warehouse_id || '',
      warehouse_name: newItem.sale_warehouse_name || '',
    };
  });
  try {
    const res = await orderCreateApi(orderParams.value);
    ElMessage.success(t('scan.order-created-successfully'));
    // orderData.value = res;
    await getOrderDetail(res.order_no);
    orderInfo.value.serialNo++;
    // handleSettleEmpty();
  } catch (error) {
    ElMessage.error(error?.message);
  }
};

const handleSettlePay = () => {
  if (goodsList.value.length <= 0) return false;
  // 判断选中的商品库存是否有足够库存 sale_warehouse_product_stock_quantity 不足提醒库存不足
  // 以及是否开启了超卖
  const hasInsufficientStock = displayedMergeGoodsList.value.some((item) => {
    return item.sale_warehouse_product_stock_quantity <= 0;
  });

  if (!hasInsufficientStock || !setInfo.value.isLessZeroProhibited) {
    drawerDialog.value.visible = true;
    addOrder();
  } else {
    ElMessage.error(t('scan.stock-quantity'));
  }
};

onMounted(() => {
  getHoldListNum();
});
// 监听 isSuspendSuccess 的变化
watch(isSuspendSuccess, async (newValue) => {
  if (newValue) {
    // 如果 isSuspendSuccess 为 true 且有新添加的商品
    let newGoods;
    try {
      const res = await productPageListApi({
        page_size: 20,
      });
      newGoods = res.data.list[0];
      getHoldListNum();
      console.log(newGoods);
    } catch (error) {
      console.error('Error suspending order:', error);
    }
    // addToGoodsList(newGoods);
    newlyAddedProduct.value = null; // 重置新添加的商品
    isSuspendSuccess.value = false; // 重置状态
  }
});

watch(mergeGoodsList, (newVal) => {
  orderStore.setMergeGoodsList(newVal);
});

// 优先使用 store 中的合并商品列表
const displayedMergeGoodsList = computed(() => {
  return storeMergeGoodsList.value?.length
    ? storeMergeGoodsList.value
    : mergeGoodsList.value;
});
const currentSymbol = ref('');

onMounted(async () => {
  currentSymbol.value = await initializeCurrencySymbol();
  // 如果 store 中已经存在 mergeGoodsList，恢复并进行计算
  if (storeMergeGoodsList.value.length > 0) {
    goodsList.value = storeMergeGoodsList.value.map((item) => {
      return {
        id: item.id || item.product_id,
        code: item.code || item.product_code,
        sku_barcode: item.sku_barcode,
        status: item.status,

        major_name: item.major_name || item.product_name,
        quantity: item.stock_total_quantity,
        sub_product_stock_search_models: item.sub_product_stock_search_models,
        major_unit_name: item?.major_unit_name,
        custom_price: item.custom_price || item.selling_price,
        product_unit_id: item.product_unit_id,
        product_unit_name: item.product_unit_name,
        merchant_id: item.merchant_id,
        selling_price: item.selling_price,
        calcInfo: item.calcInfo || null,
        sale_warehouse_name: item.sale_warehouse_name,
        sale_warehouse_product_stock_quantity:
          item.sale_warehouse_product_stock_quantity,
        stock_total_quantity: item.stock_total_quantity,
        warehouse_name: item.warehouse_name,
        warehouse_id: item.warehouse_id,
        sale_warehouse_id: item.sale_warehouse_id,
        sale_warehouse_product_stock_quantity_message:
          item.sale_warehouse_product_stock_quantity_message,
        product_profile_photo: item.product_profile_photo,
        cost_price: item.cost_price,
        product_code: item.product_code,
        basic_unit_id: item.basic_unit_id,
        basic_unit_name: item.basic_unit_name,
        basic_unit_radio: item.basic_unit_radio,
        product_spec_kvmessage: item.product_spec_kvmessage,
        product_profile_id: item.product_profile_id,
        basic_product_id: item.basic_product_id,
        other_tax_amount: item.other_tax_amount,
        origin_price: item.origin_price,
        price: item.price,
        price_type: item.price_type,
        vip_discount_amount: item.vip_discount_amount,
        vip_discount_description: item.vip_discount_description,
        promotion_discount_amount: item.promotion_discount_amount,
        promotion_discount_description: item.promotion_discount_description,
        promotion_id: item.promotion_id,
        subtotal_amount: item.subtotal_amount,
        total_amount: item.total_amount,
        vat_amount: item.vat_amount,
      };
    });
    await calculateOrderPrice();
  }
});
</script>

<template>
  <Page :auto-content-height="true">
    <section class="h-full w-full">
      <div class="scancode-container h-full w-full">
        <ElRow :gutter="5" class="h-full w-full">
          <ElCol :span="18" class="flex h-full flex-col justify-between gap-1">
            <section class="flex h-full flex-col justify-between gap-1">
              <div class="bg-card flex-shrink-0 p-2.5">
                <!-- 扫描搜索 -->
                <ScanSearch
                  ref="scanSearchRef"
                  :row-selection="rowSelection"
                  :is-suspend-success="isSuspendSuccess"
                  @refresh="handleRefresh"
                  @update-goods-list="updateGoodsList"
                  @handle-goods="handleGoods"
                  @handle-pick-order="handlePickOrder"
                  @product-added="handleProductAdded"
                  @handle-hang-order:show="handleHangOrder"
                  @handle-select-customer="handleSelectCustomer"
                  @refresh-calculation-badge-count="
                    refreshCalculationBadgeCount
                  "
                />
              </div>
              <div class="bg-card" style="flex-grow: 1">
                <div>
                  <!-- 扫描内容 -->
                  <ScanTable
                    ref="scanContentRef"
                    :merge-goods-list="displayedMergeGoodsList"
                    style="height: 100%; overflow-y: auto"
                    @update-quantity="handleUpdateQuantity"
                    @update-unit="handleUpdateUnit"
                    @handle-select-row="handleSelectRow"
                    @delete-goods="handleDeleteGoods"
                  />
                </div>
              </div>
              <div
                class="scan-order-action bg-card flex flex-shrink-0 items-center gap-6"
              >
                <div class="flex items-center justify-between gap-2">
                  <!-- 挂单 -->
                  <ElButton
                    class="w-25 h-[50px]"
                    @click="handleHangOrder"
                    type="primary"
                    plain
                  >
                    <span class="scan-order-action-primary text-blue-primary">{{
                      t('scan.hold')
                    }}</span>
                  </ElButton>
                  <!-- 取单 -->
                  <ElBadge :value="badgeCount" :hidden="badgeCount === 0">
                    <ElButton
                      class="w-25 scan-order-action-primary text-blue-primary h-[50px]"
                      type="primary"
                      plain
                      @click="handlePickOrderNew()"
                    >
                      <span
                        class="scan-order-action-primary text-blue-primary"
                        >{{ t('scan.take') }}</span
                      >
                    </ElButton>
                  </ElBadge>
                  <!-- 清空 -->
                  <ElButton
                    class="w-25 scan-order-action-error text-coral h-[50px]"
                    @click="handleSettleEmpty"
                    type="danger"
                    plain
                  >
                    {{ t('scan.empty') }}
                  </ElButton>
                </div>
                <div class="scan-action-box-settle-info bg-card">
                  <div class="flex items-center justify-between">
                    <span class="settle-info-lable text-light-gray"
                      >{{ t('scan.total-amount') }}:</span
                    >
                    <span class="settle-info-val text-gray-dark">
                      {{ currentSymbol }}
                      {{
                        calculateOrderList.subtotal_amount >= 0
                          ? thousandSeparator(
                              calculateOrderList.subtotal_amount,
                            )
                          : '--'
                      }}</span
                    >
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="settle-info-lable text-light-gray"
                      >{{ t('scan.tax') }}:</span
                    >
                    <span class="settle-info-val text-gray-dark">
                      {{ currentSymbol
                      }}{{
                        calculateOrderList.vat_amount >= 0
                          ? thousandSeparator(calculateOrderList.vat_amount)
                          : '--'
                      }}</span
                    >
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="settle-info-lable text-light-gray"
                      >{{ t('scan.discount') }}:</span
                    >
                    <span class="settle-info-val text-gray-dark">
                      <span
                        v-if="calculateOrderList.promotion_discount_amount >= 0"
                        >-</span
                      >
                      {{ currentSymbol
                      }}{{
                        calculateOrderList.promotion_discount_amount >= 0
                          ? thousandSeparator(
                              calculateOrderList.promotion_discount_amount,
                            )
                          : '--'
                      }}</span
                    >
                  </div>
                </div>
                <div class="scan-action-box-settle-payment">
                  <div class="flex items-center justify-between gap-5">
                    <span class="total-title text-orange-medium">
                      {{ t('scan.actual-amount') }}:</span
                    >
                    <span class="total-price text-red-primary">
                      {{ currentSymbol
                      }}{{
                        calculateOrderList.total_amount >= 0
                          ? thousandSeparator(calculateOrderList.total_amount)
                          : '--'
                      }}</span
                    >
                  </div>
                </div>
              </div>
            </section>
          </ElCol>
          <ElCol :span="6">
            <!-- 操作区 -->
            <div class="scan-action-box h-full">
              <div
                class="scan-action-box-customer bg-card flex-shrink-0 cursor-pointer"
              >
                <div
                  class="text-error flex items-center justify-end"
                  @click="clearCustomerInfo"
                >
                  <span>{{ t('common.esc') }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <ElButton
                    color="#F8E3C5"
                    class="w-25"
                    @click="handleSelectCustomer"
                  >
                    <span class="text-goldenrod">{{ t('scan.customer') }}</span>
                  </ElButton>
                  <span class="customer-name text-gray-dark">{{
                    customerInfo.name || ''
                  }}</span>
                </div>
                <div v-if="Object.keys(customerInfo).length > 0">
                  <div class="mt-3 flex items-center justify-between">
                    <span class="text-gray-mid"
                      >{{ t('scan.contact-telephone') }}:</span
                    >
                    <span class="customer-name text-gray-dark">{{
                      customerInfo.phone_number || '-'
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="customer-title text-gray-mid"
                      >{{ t('scan.points') }}:</span
                    >
                    <span class="customer-name text-gray-dark">{{
                      customerInfo.points || '-'
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="customer-title text-gray-mid"
                      >{{ t('scan.balance') }}:</span
                    >
                    <span class="customer-name text-gray-dark">{{
                      customerInfo.balance || '0'
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="customer-title text-gray-mid"
                      >{{ t('scan.salesman') }}:</span
                    >
                    <span class="customer-name text-gray-dark">{{
                      customerInfo.salesman_name || '0'
                    }}</span>
                  </div>
                </div>
              </div>
              <section class="scan-action-box-guider-settle flex-grow">
                <div
                  class="scan-action-box-guider bg-card flex flex-grow justify-between"
                >
                  <ElButton
                    class="w-25"
                    color="#D1EDC4"
                    @click="handleSelectGuider"
                  >
                    <span class="text-[#529B2E]">{{ t('scan.guider') }}</span>
                  </ElButton>
                  <div
                    v-if="Object.keys(guiderInfo).length > 0"
                    class="guider-val text-gray-dark flex gap-1"
                  >
                    <!-- <span>{{ guiderInfo.login_id || '-' }}</span> -->
                    <span>{{ guiderInfo.name || '-' }}</span>
                  </div>
                </div>
                <div
                  class="scan-action-box-settle bg-card flex items-center justify-center"
                >
                  <ElButton
                    class="h-15 settle-button w-full"
                    type="danger"
                    @click="handleSettlePay"
                  >
                    <span>
                      {{ t('scan.settlement') }}
                    </span>
                  </ElButton>
                </div>
              </section>
            </div>
          </ElCol>
        </ElRow>
      </div>
      <!-- 弹窗部分 -->
      <SelectCustomer
        @close-tkr="confirmClose"
        @select-customer-row:row="handleSelectCustomerRow"
      />
      <!-- 选择导购员 -->
      <SelectGuiderDrawer
        key="GuiderDrawer"
        :title="drawerDialogGuider.title"
        :show-dialog="drawerDialogGuider.visible"
        :inner-drawer-show="drawerDialog.innerDrawerShow"
        @close-tkr="confirmGuiderClose"
        @select-customer-row:row="handleSelectGuiderRow"
      />
      <!-- 扫码弹窗 -->
      <ScanDialog
        :customer-info="customerInfo"
        :guider-info="guiderInfo"
        :visible="scanDialogVisible"
        :goods-list="goodsList"
        @update:suspend="hanleIsSuspend"
        @update:visible="handleScanDialogVisible"
      />
      <!-- 结算抽屉 -->
      <ScanOrderSettle
        :title="drawerDialog.title"
        :goods-list="goodsList"
        :order-data="orderData"
        :row-selection="rowSelection"
        :show-dialog="drawerDialog.visible"
        @close-tkr="confirmClosePay"
        @handle-empty="handleSettleEmpty"
      />
    </section>
  </Page>
</template>
<style scoped lang="scss" src="./index.scss"></style>
