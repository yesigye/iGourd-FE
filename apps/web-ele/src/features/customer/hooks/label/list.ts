import type { CustomerLabelPageModel } from '@@/customer/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  createCustomerLabelApi,
  deleteCustomerLabelApi,
  getCustomerLabelCustomerPageListApi,
} from '@@/customer/apis';
import { CustomerLabelDrawer } from '@@/customer/components';

import { useCrud } from '#/hooks';

export function useCustomerLabel(id) {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<CustomerLabelPageModel>[] = [
    {
      field: 'label',
      minWidth: 200,
      align: 'center',
      fixed: 'left',
      title: t('label.curtomer-label'),
      sortable: true,
    },
    {
      field: 'creator_name',
      minWidth: 150,
      align: 'center',
      title: t('label.customer'),
      sortable: true,
    },
    {
      field: 'contact-name',
      minWidth: 150,
      align: 'center',
      title: t('label.contact-name'),
      sortable: true,
    },
    {
      field: 'contact-telephone',
      minWidth: 150,
      align: 'center',
      title: t('label.contact-telephone'),
      sortable: true,
    },
    {
      field: 'balance',
      minWidth: 150,
      align: 'center',
      title: t('label.balance'),
      sortable: true,
    },
    {
      field: 'customer-balance',
      minWidth: 150,
      align: 'center',
      title: t('label.customer-balance'),
      sortable: true,
    },
    {
      field: 'points',
      minWidth: 150,
      align: 'center',
      title: t('label.points'),
      sortable: true,
    },
    {
      field: 'operation',
      title: t('common.operations'),
      sortable: true,
      minWidth: 180,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: {
      id: number;
      page_num: number;
      page_size: number;
    }) => {
      return id.value
        ? await getCustomerLabelCustomerPageListApi({
            id: id.value,
            page_num: params.page_num,
            page_size: params.page_size,
          })
        : [];
    },
    // 创建客户标签
    create: createCustomerLabelApi,

    // 删除客户标签
    remove: async (data: { label_id_list: number[] }) => {
      return await deleteCustomerLabelApi(data);
    },
  };

  // 使用 CRUD Hook
  const {
    Grid,
    gridApi,
    canBatchOperate,
    Drawer,
    handleEdit,
    handleBatchDelete,
  } = useCrud({
    service,
    id: 'label',
    columns: baseColumns,
    batchOperate: true, // 支持批量删除
    connectedComponent: CustomerLabelDrawer,
    searchFormAppendTo: '#label',
    separator: false,
    proxyConfig: {
      autoLoad: false,
    },
    toolbarConfig: {
      print: true,
      export: true,
    },
    searchFormSchema: {
      keywords: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: t('common.keywords'),
        },
      },
    },
  });

  return {
    Grid,
    gridApi,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
