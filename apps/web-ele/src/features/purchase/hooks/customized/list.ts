import type { CustomizedDTO, CustomizedRow } from '@@/purchase/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  createOrUpdateCustomizedField,
  deleteDynamicColumn,
  getPurchaseCustomizedListApi,
} from '@@/purchase/apis';
import { CustomizedDrawerForm } from '@@/purchase/components';

import { useCrud } from '#/hooks';

export function useCustomized() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<CustomizedRow>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'name',
      title: t('purchase.featureName'),
      minWidth: 170,
      sortable: true,
      align: 'left',
      filters: [{ label: 'test', value: 'test' }],
    },
    {
      field: 'type',
      title: t('purchase.featureType'),
      minWidth: 120,
      sortable: true,
      align: 'left',
      formatter: ({ cellValue }) => {
        if (cellValue === 'SELECT') return t('purchase.select');
        return t('purchase.input');
      },
    },
    {
      field: 'is_fixed_option',
      title: t('purchase.selectionType'),
      minWidth: 200,
      sortable: true,
      align: 'left',
      formatter: ({ cellValue }) => {
        if (cellValue) return t('purchase.fixed');
        return t('purchase.userCreated');
      },
    },
    {
      field: 'is_compulsory',
      title: t('purchase.compulsory'),
      minWidth: 150,
      sortable: true,
      align: 'left',
      formatter: ({ cellValue }) => {
        if (cellValue) return t('purchase.yes');
        return t('purchase.no');
      },
    },
    {
      field: 'creator_name',
      title: t('purchase.creator'),
      minWidth: 180,
      sortable: true,
      align: 'left',
    },
    {
      field: 'create_time',
      title: t('purchase.creationTime'),
      sortable: true,
      align: 'left',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: t('purchase.operation'),
      sortable: true,
      minWidth: 180,
      slots: { default: 'operation' },
    },
  ];
  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('common.keywords')}}",
        clearable: true,
      },
    },
  };
  return useCrud<CustomizedRow, CustomizedDTO>({
    columns,
    toolbarConfig: {
      export: true,
      zoom: true,
      custom: true,
    },
    searchFormSchema,
    batchOperate: true,
    connectedComponent: CustomizedDrawerForm,
    service: {
      query: (params) => {
        return getPurchaseCustomizedListApi({
          ...params,
          entry: ['ddd'],
        });
      },
      drop: deleteDynamicColumn,
      create: createOrUpdateCustomizedField,
      update: createOrUpdateCustomizedField,
    },
  });
}
