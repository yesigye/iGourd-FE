import type { VxeGridPropTypes } from '#/adapter/vxe-table';
import { useCrud } from '#/hooks';
import { useI18n } from '@igourd/locales';
import {
  batchDeleteVendorApi,
  createOrUpdateVendorApi,
  getPurchasePageListApi,
} from '@@/purchase/apis';
import { ListDrawerForm } from '@@/purchase/components';
import type { PurchaseRow } from './types';

export function useList() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<any>[] = [
    {
      type: 'checkbox',
      width: 80,
    },
    {
      field: 'name',
      title: t('purchase.featureName'),
      minWidth: 170,
      sortable: true,
      align: 'left',
    },
    {
      cellRender: { name: 'CellImage' },
      field: 'profile_photo',
      title: t('purchase.profilePhoto'),
      width: 80,
      align: 'center',
    },
    {
      field: 'name',
      title: t('purchase.vendorName'),
      width: 155,
      sortable: true,
    },
    {
      field: 'contact_name',
      title: t('purchase.name'),
      width: 160,
      sortable: true,
    },
    {
      field: 'contact_telephone',
      title: t('purchase.contactTelephone'),
      width: 200,
      sortable: true,
    },
    {
      field: 'address',
      title: t('purchase.address'),
      width: 200,
      sortable: true,
    },
    {
      field: 'creator_name',
      title: t('purchase.creator'),
      width: 200,
      sortable: true,
      align: 'left',
    },
    {
      field: 'create_time',
      title: t('purchase.createTime'),
      width: 180,
      sortable: true,
      align: 'left',
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: t('purchase.operation'),
      sortable: true,
      minWidth: 180,
      fixed: 'right',
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
  return useCrud<PurchaseRow, any>({
    columns,
    searchFormSchema,
    batchOperate: true,
    connectedComponent: ListDrawerForm,
    service: {
      query: getPurchasePageListApi,
      drop: batchDeleteVendorApi,
      create: createOrUpdateVendorApi,
      update: createOrUpdateVendorApi,
    },
  });
}
