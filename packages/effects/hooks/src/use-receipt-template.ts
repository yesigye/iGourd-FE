import type { Ref } from 'vue';

import { computed, ref } from 'vue';

import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { isDef, isFunction, thousandSeparator } from '@igourd/utils';

interface PropsType {
  title?: string;
  printTemplate?: Ref<any>;
  orderDetail?: Ref<any>;
  fieldColumns?: any[];
  languageBefore?: string;
  callbackSchema?: Record<string, (info: any) => any>;
  callbackBefore?: Record<string, (info: any) => any>;
  callbackAfter?: Record<string, (info: any) => any>;
}

type AnyObject = Record<string, any>;

export const useReceiptTemplate = (props?: Partial<PropsType>) => {
  const orderInfo = ref<AnyObject>({}); // 默认
  const printTemp = ref<AnyObject>({}); // 默认
  const blockProps = ref<AnyObject>({});

  const userStore = useUserStore();
  const { currencySymbol } = userStore;

  const defaultCallbackBefore = {
    quantity: renderQuantUnit,
    total_quantity: renderQuantUnit,
    refund_total_amount: renderRefundTotalAmount,
  };
  const defaultCallbackAfter = {};

  const defaultCallbackSchema = {
    selling_price: thousandSeparator,
    subtotal_amount: thousandSeparator,
    promotion_discount_amount: thousandSeparator,
    vat_amount: thousandSeparator,
    total_amount: thousandSeparator,
    round_down_amount: thousandSeparator,
    total_paid_amount: thousandSeparator,
    cash_change_amount: thousandSeparator,
    refund_total_amount: thousandSeparator,
  };

  const mergeProps = computed(() => {
    return {
      ...props,
      ...blockProps.value,
    };
  });

  const { orderDetail = ref({}), printTemplate = ref({}) } =
    mergeProps.value || {};

  const {
    callbackSchema = defaultCallbackSchema,
    callbackBefore = defaultCallbackBefore,
    callbackAfter = defaultCallbackAfter,
    fieldColumns = [],
    languageBefore = 'RECEIPT',
  } = mergeProps.value || {};
  const { t } = useI18n();

  // 获取打印数据
  const receiptInfo = computed(() => ({
    ...orderDetail.value,
    ...orderInfo.value,
    cashier_account:
      orderDetail.value?.pos_user_name || orderInfo.value?.pos_user_name || '-',
  }));

  // 获取打印模板
  const printTempInfo = computed(() => ({
    ...printTemplate.value,
    ...printTemp.value,
  }));

  // 获取打印权限
  const columnOptionRoles = computed(() => {
    return [
      ...(printTempInfo.value?.column_option_list || []),
      ...fieldColumns,
      // eslint-disable-next-line unicorn/no-array-reduce
    ].reduce((acc, item, _index) => {
      if (item.is_selected) {
        acc[item.column_option_code] = item.column_option_code;
      }
      return acc;
    }, {});
  });

  function renderPriceUnit() {
    // return 'Ұ-ұ-￥-\u04B1';
    // return '￥';
    return currencySymbol.value;
  }

  function renderQuantUnit() {
    return 'x';
  }

  function renderRefundTotalAmount() {
    return '-';
  }

  // 计算总数量
  function calcTotalQuantity(productList: any) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return productList?.reduce((acc, item) => (acc += item.quantity), 0);
  }
  // 获取最终打印数据
  const receiptRoles = computed(() => {
    const { title } = mergeProps.value;
    const roles = columnOptionRoles.value;
    const productTitle = checkReceiptRoles([
      roles.product_name,
      roles.quantity,
      roles.selling_price,
      roles.subtotal_amount,
    ]);

    const productList = receiptInfo.value?.order_item_model_list || [];
    const customerInfo = {
      store_name: receiptInfo.value?.merchant_name || '',
      customer_name: receiptInfo.value?.customer_detail_model?.name,
      payment_balance_amount: receiptInfo.value?.customer_detail_model?.balance,
    };

    const total_quantity = calcTotalQuantity(productList);
    return {
      title: t(title ?? 'title'),
      subTitle: setReceiptValues([roles.serial_no], receiptInfo.value),
      topList: setReceiptValues(
        [roles.order_no, roles.order_returned_no, roles.order_serial_no],
        receiptInfo.value,
      ),
      centerList: setReceiptValues(
        [roles.create_time, roles.salesman_name, roles.cashier_account],
        receiptInfo.value,
      ),
      productInfo: {
        titleList: productTitle.map((item: any) => {
          if (!['selling_price', 'subtotal_amount'].includes(item.key))
            return item;
          return { ...item, after: `(${renderPriceUnit()})` };
        }),
        productList: setProductList(productTitle, productList),
      },
      bottomList: setReceiptValues(
        [
          roles.total_quantity,
          roles.promotion_discount_amount,
          roles.vat_amount,
          roles.total_amount,
          roles.round_down_amount,
          roles.total_paid_amount,
          roles.cash_change_amount,
          roles.refund_total_amount,
        ],
        { ...receiptInfo.value, total_quantity },
      ),
      footerList: setReceiptValues(
        [roles.customer_name, roles.payment_balance_amount, roles.store_name],
        customerInfo,
      ),
      barcode: receiptInfo.value[roles.order_no || roles.order_returned_no],
    };
  });

  // 检查打印项是否存在且翻译字段
  function checkReceiptRoles(list: any[]) {
    return list
      .filter((item) => isDef(item))
      .map((item) => ({
        key: item,
        label: t(`printTemp.${languageBefore}.${item}`) ?? item,
      }));
  }

  // 获取对应打印项的值
  function getCallbackValue(item: any, info: any) {
    const val = info[item.key];
    const result = isDef(val) ? val : '-';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const value = isFunction(callbackSchema[item.key])
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        callbackSchema[item.key](result)
      : result;
    const params: AnyObject = { result: value };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const beforeCallback = callbackBefore[item.key];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const afterCallback = callbackAfter[item.key];
    if (isFunction(beforeCallback)) {
      params.before = beforeCallback(value);
    }
    if (isFunction(afterCallback)) {
      params.after = afterCallback(value);
    }
    params.value = `${params.before || ''}${value}${params.after || ''}`;
    return params;
  }

  // 设置打印项的值
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  function setReceiptValues(list, info) {
    return checkReceiptRoles(list).map((item) => {
      const schameValue = getCallbackValue(item, info);
      return { ...item, ...schameValue };
    });
  }

  // 设置打印中间商品的值
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  function setProductList(titleList, productList) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line unicorn/no-array-reduce
    const goodsList = productList.reduce((origin, item) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line unicorn/no-array-reduce
      const productValues = titleList.reduce((acc, cur) => {
        const schameValue = getCallbackValue(cur, item);
        acc.push({ ...cur, ...schameValue });
        return acc;
      }, []);
      origin.push(productValues);
      return origin;
    }, []);
    return goodsList;
  }

  // 设置订单详情
  async function setOrderDetail(order: any) {
    orderInfo.value = order;
  }

  async function setBlockProps(options: any) {
    blockProps.value = options || {};
  }

  // 设置打印模板
  function setPrintTemp(temp: any) {
    printTemp.value = temp;
  }

  return {
    receiptRoles,
    setPrintTemp,
    setOrderDetail,
    setBlockProps,
    checkReceiptRoles,
    setReceiptValues,
  };
};
