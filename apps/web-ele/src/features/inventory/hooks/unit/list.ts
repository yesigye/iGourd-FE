import type { UnitItem, UnitParams } from '../../types/unit';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { deleteUnit, getUnitList } from '@@/inventory/apis';
import { UnitDrawer } from '@@/inventory/components';

import { useCrud } from '#/hooks';

export function useInventoryUnitList() {
  const { t } = useI18n();

  const columns: VxeGridPropTypes.Column<UnitItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
      selectable: (row) => row.source_type !== 'SYSTEM',
    },
    {
      field: 'unit_name',
      title: t('inventory.unitName'),
      minWidth: 150,
      fixed: 'left',
    },
    {
      field: 'unit_code',
      title: t('inventory.unitCode'),
      minWidth: 120,
    },
    {
      field: 'unit_symbol',
      title: t('inventory.unitSymbol'),
      minWidth: 100,
    },
    {
      field: 'is_basic_unit',
      title: t('inventory.isBasicUnit'),
      minWidth: 120,
      align: 'center',
      slots: { default: 'isBasicUnit' },
    },
    {
      field: 'conversion_ratio',
      title: t('inventory.conversionRatio'),
      minWidth: 120,
      formatter: ({ cellValue }) => (cellValue ? cellValue.toString() : '-'),
    },
    {
      field: 'basic_unit_name',
      title: t('inventory.basicUnitName'),
      minWidth: 150,
    },
    {
      field: 'status',
      title: t('inventory.status'),
      minWidth: 120,
      align: 'center',
      slots: { default: 'status' },
    },
    {
      field: 'source_type',
      title: t('inventory.sourceType'),
      minWidth: 120,
      formatter: ({ cellValue }) => {
        const typeMap = {
          SYSTEM: t('inventory.system'),
          CUSTOM: t('inventory.custom'),
        };
        return typeMap[cellValue] || cellValue;
      },
    },
    {
      field: 'creator_name',
      title: t('inventory.creator'),
      minWidth: 150,
    },
    {
      field: 'create_time',
      title: t('inventory.creationTime'),
      minWidth: 180,
      sortable: true,
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: t('inventory.action'),
      minWidth: 85,
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
        placeholder: "{{t('inventory.unitSearchPlaceholder')}}",
        clearable: true,
      },
    },
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.status')}}",
        clearable: true,
        options: [
          { label: t('inventory.active'), value: 'ACTIVE' },
          { label: t('inventory.frozen'), value: 'FROZEN' },
          { label: t('inventory.init'), value: 'INIT' },
        ],
      },
    },
    source_type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.sourceType')}}",
        clearable: true,
        options: [
          { label: t('inventory.system'), value: 'SYSTEM' },
          { label: t('inventory.custom'), value: 'CUSTOM' },
        ],
      },
    },
    is_basic_unit: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.isBasicUnit')}}",
        clearable: true,
        options: [
          { label: t('inventory.yes'), value: true },
          { label: t('inventory.no'), value: false },
        ],
      },
    },
  };

  return useCrud<UnitItem, UnitParams>({
    columns,
    searchFormSchema,
    batchOperate: true,
    service: {
      query: getUnitList,
      remove: deleteUnit,
    },
    connectedComponent: UnitDrawer,
  });
}
