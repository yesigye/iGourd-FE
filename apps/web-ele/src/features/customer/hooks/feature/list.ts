import type { CustomerFeaturePageModel } from '@@/customer/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getCustomerFeaturePageListApi,
  deleteCustomerFeatureApi,
} from '@@/customer/apis';
import { CustomerFeatureDrawer } from '@@/customer/components';

import { useCrud } from '#/hooks';

export function useCustomerFeature() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<CustomerFeaturePageModel>[] = [
    {
      field: 'feature_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('customer.featureName'),
      sortable: true,
    },
    {
      field: 'feature_code',
      width: 150,
      align: 'left',
      title: t('customer.featureCode'),
      sortable: true,
    },
    {
      field: 'feature_type',
      width: 120,
      align: 'center',
      title: t('customer.featureType'),
      sortable: true,
    },
    {
      field: 'is_required',
      width: 100,
      align: 'center',
      title: t('customer.isRequired'),
      sortable: true,
    },
    {
      field: 'is_searchable',
      width: 120,
      align: 'center',
      title: t('customer.isSearchable'),
      sortable: true,
    },
    {
      field: 'sort_order',
      width: 100,
      align: 'center',
      title: t('customer.sortOrder'),
      sortable: true,
    },
    {
      field: 'status',
      width: 100,
      align: 'center',
      title: t('customer.status'),
      sortable: true,
    },
    {
      field: 'description',
      width: 200,
      align: 'left',
      title: t('customer.description'),
      sortable: true,
    },
    {
      field: 'creator_name',
      width: 120,
      align: 'left',
      title: t('customer.creatorName'),
      sortable: true,
    },
    {
      field: 'create_time',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('customer.createTime'),
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: async ({ page_num, page_size }: { page_num: number; page_size: number }) => {
      const response = await getCustomerFeaturePageListApi({ page_num, page_size });
      return {
        list: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除客户特征
    remove: async (data: { feature_id_list: number[] }) => {
      return await deleteCustomerFeatureApi(data);
    },
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
            placeholder: t('customer.searchPlaceholder'),
          },
        },
        feature_type: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: t('customer.featureType'),
            options: [
              { label: t('customer.featureType.text'), value: 'TEXT' },
              { label: t('customer.featureType.number'), value: 'NUMBER' },
              { label: t('customer.featureType.date'), value: 'DATE' },
              { label: t('customer.featureType.select'), value: 'SELECT' },
              {
                label: t('customer.featureType.multiSelect'),
                value: 'MULTI_SELECT',
              },
              { label: t('customer.featureType.boolean'), value: 'BOOLEAN' },
              { label: t('customer.featureType.other'), value: 'OTHER' },
            ],
          },
        },
      },
      batchOperate: true, // 支持批量删除
      connectedComponent: CustomerFeatureDrawer,
    });


  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
