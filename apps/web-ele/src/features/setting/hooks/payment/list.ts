import type { SettingPaymentPageModel } from '@@/setting/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  deleteSettingPaymentApi,
  getSettingPaymentPageListApi,
} from '@@/setting/apis';
import { PaymentDrawer } from '@@/setting/components';

import { useCrud } from '#/hooks';

export function useSettingPayment() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<SettingPaymentPageModel>[] = [
    {
      field: 'payment_method_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('setting.paymentMethodName'),
      sortable: true,
    },
    {
      field: 'payment_type',
      width: 120,
      align: 'center',
      title: t('setting.paymentType'),
      sortable: true,
    },
    {
      field: 'status',
      width: 100,
      align: 'center',
      title: t('setting.status'),
      sortable: true,
    },
    {
      field: 'scenes',
      width: 150,
      align: 'center',
      title: t('setting.scenes'),
      sortable: true,
    },
    {
      field: 'fee_rate',
      width: 100,
      align: 'right',
      title: t('setting.feeRate'),
      sortable: true,
    },
    {
      field: 'min_amount',
      width: 120,
      align: 'right',
      title: t('setting.minAmount'),
      sortable: true,
    },
    {
      field: 'max_amount',
      width: 120,
      align: 'right',
      title: t('setting.maxAmount'),
      sortable: true,
    },
    {
      field: 'daily_limit',
      width: 120,
      align: 'right',
      title: t('setting.dailyLimit'),
      sortable: true,
    },
    {
      field: 'monthly_limit',
      width: 120,
      align: 'right',
      title: t('setting.monthlyLimit'),
    },
    {
      field: 'sort_order',
      width: 100,
      align: 'center',
      title: t('setting.sortOrder'),
      sortable: true,
    },
    {
      field: 'creator_name',
      width: 120,
      align: 'left',
      title: t('setting.creatorName'),
      sortable: true,
    },
    {
      field: 'create_time',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('setting.createTime'),
      sortable: true,
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getSettingPaymentPageListApi,

    // 删除支付设置
    remove: deleteSettingPaymentApi,
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
            placeholder: t('setting.searchPlaceholder'),
          },
        },
        status: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: t('setting.status'),
            options: [
              { label: t('setting.status.active'), value: 'ACTIVE' },
              { label: t('setting.status.inactive'), value: 'INACTIVE' },
              { label: t('setting.status.testing'), value: 'TESTING' },
              { label: t('setting.status.error'), value: 'ERROR' },
            ],
          },
        },
        payment_type: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: t('setting.paymentType'),
            options: [
              { label: t('setting.paymentType.alipay'), value: 'ALIPAY' },
              { label: t('setting.paymentType.wechat'), value: 'WECHAT' },
              { label: t('setting.paymentType.unionpay'), value: 'UNIONPAY' },
              { label: t('setting.paymentType.cash'), value: 'CASH' },
              { label: t('setting.paymentType.card'), value: 'CARD' },
              { label: t('setting.paymentType.other'), value: 'OTHER' },
            ],
          },
        },
      },
      batchOperate: true, // 支持批量删除
      connectedComponent: PaymentDrawer,
    });
  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
