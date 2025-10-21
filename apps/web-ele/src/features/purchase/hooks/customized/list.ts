import type { CustomizedDTO, CustomizedRow } from '@@/purchase/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  createOrUpdateCustomizedField,
  deleteDynamicColumn,
  getPurchaseCustomizedListApi,
} from '@@/purchase/apis';

// import { CustomizedDrawerForm } from '@@/purchase/components';
import addCustomized from '#/components/add-customized/add-customized.vue';
import { useCrud, withEntityParam } from '#/hooks';

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
      title: t('customized.name'),
      minWidth: 170,
      sortable: true,
      align: 'left',
      filters: [{ label: 'test', value: 'test' }],
    },
    {
      field: 'type',
      title: t('customized.type'),
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
      title: t('customized.options-type'),
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
      title: t('customized.compulsory'),
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
      title: t('customized.creator'),
      minWidth: 180,
      sortable: true,
      align: 'left',
    },
    {
      field: 'create_time',
      title: t('customized.creation-time'),
      sortable: true,
      align: 'left',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: t('purchase.operation'),
      minWidth: 180,
      sortable: false,
      dragSort: false,
      slots: { default: 'actions' },
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
    id:"purchase-customized-list",
    toolbarConfig: {
      export: true,
      zoom: true,
      custom: true,
    },
    searchFormSchema,
    batchOperate: true,
    connectedComponent: addCustomized,
    service: {
      query: withEntityParam({ entity: 'VENDOR' })(
        getPurchaseCustomizedListApi,
      ),
      drop: withEntityParam({ entity: 'VENDOR' })(deleteDynamicColumn),
      create: withEntityParam({ entity: 'VENDOR' })(
        createOrUpdateCustomizedField,
      ),
      update: withEntityParam({ entity: 'VENDOR' })(
        createOrUpdateCustomizedField,
      ),
    },
  });
}
