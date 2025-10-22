import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { useCrud } from '#/hooks';
import { formatNumber } from '#/utils';

import * as storePaymentApi from '../../apis/payment';

const PAYMENT_METHOD = [
  { name: 'store-payment-list.payment-method-no-payment', value: 'NO_PAYMENT' },
  { name: 'store-payment-list.payment-method-cash', value: 'CASH' },
  {
    name: 'store-payment-list.payment-method-offline-wechat',
    value: 'OFFLINE_WECHAT',
  },
  {
    name: 'store-payment-list.payment-method-offline-alipay',
    value: 'OFFLINE_ALIPAY',
  },
  {
    name: 'store-payment-list.payment-method-online-wechat',
    value: 'ONLINE_WECHAT',
  },
  {
    name: 'store-payment-list.payment-method-online-alipay',
    value: 'ONLINE_ALIPAY',
  },
  {
    name: 'store-payment-list.payment-method-online-banking',
    value: 'ONLINE_BANKING',
  },
  {
    name: 'store-payment-list.payment-method-offline-bank-transfer',
    value: 'OFFLINE_BANK_TRANSFER',
  },
];
const TYPE_CONFIG = [
  { name: 'store-payment-list.type-inner-trade', value: 'INNER_TRADE' },
  {
    name: 'store-payment-list.type-merchant-package-buy',
    value: 'MERCHANT_PACKAGE_BUY',
  },
  {
    name: 'store-payment-list.type-merchant-goods-buy',
    value: 'MERCHANT_GOODS_BUY',
  },
  { name: 'store-payment-list.type-other', value: 'OTHER' },
];
export function useStorePayment() {
  const { t } = useI18n();
  const {
    currentLoginUserApp: { owner_id },
    currencySymbol,
  } = useUserStore();
  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<any>[] = [
    {
      field: 'merchant_order_no',
      minWidth: 206,
      fixed: 'left',
      title: t('store-payment-list.merchant-order-no'),
    },
    {
      field: 'storename',
      width: 150,
      minWidth: 235,
      title: t('store-payment-list.storename'),
      formatter({ row }) {
        return row.merchant_model.full_name;
      },
    },
    {
      field: 'package_name',
      width: 120,
      minWidth: 235,
      title: t('store-payment-list.package-name'),
      formatter({ row }) {
        return row.merchant_package_model?.package_name;
      },
    },
    {
      field: 'total_day',
      minWidth: 150,
      title: t('store-payment-list.total-day'),
    },
    {
      field: 'discount_amount',
      minWidth: 150,
      title: t('store-payment-list.discount-amount'),
      formatter({ cellValue }) {
        return `${currencySymbol} ${formatNumber(cellValue)}`;
      },
    },
    {
      field: 'total_amount',
      minWidth: 150,
      title: t('store-payment-list.total-amount'),
      formatter({ cellValue }) {
        return `${currencySymbol} ${formatNumber(cellValue)}`;
      },
    },
    {
      field: 'type',
      minWidth: 240,
      title: t('store-payment-list.type'),
      formatter({ cellValue }) {
        const key = TYPE_CONFIG.find((i) => i.value === cellValue)?.name;
        if (key) {
          return t(key);
        }
        return '';
      },
    },
    {
      field: 'payment_method',
      minWidth: 220,
      title: t('store-payment-list.payment-method'),
      formatter({ cellValue }) {
        const key = PAYMENT_METHOD.find((i) => i.value === cellValue)?.name;
        if (key) {
          return t(key);
        }
        return '';
      },
    },
    {
      field: 'status',
      minWidth: 220,
      title: t('store-payment-list.status'),
      slots: {
        default: 'status',
      },
    },
    {
      title: t('store-payment-list.create-time'),
      field: 'create_time',
      minWidth: 200,
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: storePaymentApi.getPaymentMethodList,
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      params: {
        first_level_merchant_id: owner_id,
      },
      service,
      id: 'payment_1',
      columns: baseColumns,
      searchFormSchema: {
        keywords: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: t('common.search'),
          },
        },
      },
      batchOperate: true,
    });

  return {
    // 组件
    Grid,
    Drawer,

    // 方法
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
