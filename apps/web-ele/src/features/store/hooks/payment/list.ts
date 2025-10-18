import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { useCrud } from '#/hooks';
import { formatNumber } from '#/utils';

import * as storePaymentApi from '../../apis/payment';

const PAYMENT_METHOD = [
  { name: 'storePaymentList.payment_method_NO_PAYMENT', value: 'NO_PAYMENT' },
  { name: 'storePaymentList.payment_method_CASH', value: 'CASH' },
  {
    name: 'storePaymentList.payment_method_OFFLINE_WECHAT',
    value: 'OFFLINE_WECHAT',
  },
  {
    name: 'storePaymentList.payment_method_OFFLINE_ALIPAY',
    value: 'OFFLINE_ALIPAY',
  },
  {
    name: 'storePaymentList.payment_method_ONLINE_WECHAT',
    value: 'ONLINE_WECHAT',
  },
  {
    name: 'storePaymentList.payment_method_ONLINE_ALIPAY',
    value: 'ONLINE_ALIPAY',
  },
  {
    name: 'storePaymentList.payment_method_ONLINE_BANKING',
    value: 'ONLINE_BANKING',
  },
  {
    name: 'storePaymentList.payment_method_OFFLINE_BANK_TRANSFER',
    value: 'OFFLINE_BANK_TRANSFER',
  },
];
const TYPE_CONFIG = [
  { name: 'storePaymentList.type_INNER_TRADE', value: 'INNER_TRADE' },
  {
    name: 'storePaymentList.type_MERCHANT_PACKAGE_BUY',
    value: 'MERCHANT_PACKAGE_BUY',
  },
  {
    name: 'storePaymentList.type_MERCHANT_GOODS_BUY',
    value: 'MERCHANT_GOODS_BUY',
  },
  { name: 'storePaymentList.type_OTHER', value: 'OTHER' },
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
      title: t('storePaymentList.merchant_order_no'),
    },
    {
      field: 'storename',
      width: 150,
      minWidth: 235,
      title: t('storePaymentList.storename'),
      formatter({ row }) {
        return row.merchant_model.full_name;
      },
    },
    {
      field: 'package_name',
      width: 120,
      minWidth: 235,
      title: t('storePaymentList.package_name'),
      formatter({ row }) {
        return row.merchant_package_model?.package_name;
      },
    },
    {
      field: 'total_day',
      minWidth: 150,
      title: t('storePaymentList.total_day'),
    },
    {
      field: 'discount_amount',
      minWidth: 150,
      title: t('storePaymentList.discount_amount'),
      formatter({ cellValue }) {
        return `${currencySymbol} ${formatNumber(cellValue)}`;
      },
    },
    {
      field: 'total_amount',
      minWidth: 150,
      title: t('storePaymentList.total_amount'),
      formatter({ cellValue }) {
        return `${currencySymbol} ${formatNumber(cellValue)}`;
      },
    },
    {
      field: 'type',
      minWidth: 240,
      title: t('storePaymentList.type'),
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
      title: t('storePaymentList.payment_method'),
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
      title: t('storePaymentList.status'),
      slots: {
        default: 'status',
      },
    },
    {
      title: t('storePaymentList.create_time'),
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
