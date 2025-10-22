import type { PurchaseListDTO, PurchaseListRow } from '@@/purchase/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  createPurchaseVendorApi,
  deletePurchaseRecordApi,
  getPurchaseListApi,
  updatePurchaseRecordApi,
} from '@@/purchase/apis';
import { PurchaseListDrawer } from '@@/purchase/components';

import { useCrud } from '#/hooks';

export function usePurchaseList() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<PurchaseListRow>[] = [
    {
      type: 'checkbox',
      minWidth: 80,
      fixed: 'left',
    },
    {
      field: 'profile_photo',
      title: t('purchase.profile-photo'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'name',
      title: t('purchase.vendor-name'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'contact_name',
      title: t('purchase.name'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'contact_telephone',
      title: t('purchase.contact-telephone'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'address',
      title: t('purchase.address'),
      minWidth: 100,
      align: 'right',
    },
    {
      field: 'creator_name',
      title: t('purchase.creator'),
      minWidth: 100,
      align: 'right',
    },
    {
      field: 'create_time',
      title: t('purchase.create-time'),
      minWidth: 160,
      align: 'right',
    },
    {
      field: 'operation',
      title: t('common.operations'),
      minWidth: 120,
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

  return useCrud<PurchaseListRow, PurchaseListDTO>({
    columns,
    id:"purchase-list",
    searchFormSchema,
    batchOperate: true,
    connectedComponent: PurchaseListDrawer,
    service: {
      query: getPurchaseListApi,
      drop: deletePurchaseRecordApi,
      create: createPurchaseVendorApi,
      update: updatePurchaseRecordApi,
    },
  });
}
