import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { PaymentDrawer } from '@@/store/components';

import { useCrud } from '#/hooks';

import * as storePaymentApi from '../../apis/payment';

export function useStorePaymentList() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<any>[] = [
    {
      field: 'payment_method_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('store.paymentMethodName'),
    },
    {
      field: 'payment_method_mark',
      width: 150,
      align: 'left',
      title: t('store.paymentMethodMark'),
    },
    {
      field: 'payment_type',
      width: 120,
      align: 'center',
      title: t('store.paymentType'),
    },
    {
      field: 'status',
      width: 100,
      align: 'center',
      title: t('store.status'),
    },
    {
      field: 'sort_order',
      width: 100,
      align: 'center',
      title: t('store.sortOrder'),
    },
    {
      field: 'is_default',
      width: 100,
      align: 'center',
      title: t('store.isDefault'),
    },
    {
      field: 'remark',
      width: 200,
      align: 'left',
      title: t('store.remark'),
    },
    {
      field: 'create_time',
      width: 180,
      align: 'center',
      title: t('store.createTime'),
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: storePaymentApi.getPaymentMethodList,
    // 删除支付方式
    remove: storePaymentApi.deletePaymentMethod,
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      columns: baseColumns,
      searchFormSchema: {
        keywords: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: t('store.searchPlaceholder'),
          },
        },
      },
      batchOperate: true,
      connectedComponent: PaymentDrawer,
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
