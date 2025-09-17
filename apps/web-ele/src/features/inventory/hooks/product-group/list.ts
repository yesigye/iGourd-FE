import type {
  FirstGroupItem,
  FirstGroupParams,
  SecondGroupItem,
  SecondGroupParams,
} from '../../types/product-group';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { useCrud } from '#/hooks';

import { inventoryProductGroupApi } from '../../apis/product-group';

export function useInventoryProductGroupList() {
  const { t } = useI18n();

  // 左侧表格列配置（一级分组）
  const leftColumns: VxeGridPropTypes.Column<FirstGroupItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'major_name',
      title: t('inventory.parentProductGroup'),
      minWidth: 350,
      fixed: 'left',
    },
    {
      field: 'operation',
      title: t('inventory.action'),
      minWidth: 135,
      fixed: 'right',
      slots: { default: 'leftOperation' },
    },
  ];

  // 右侧表格列配置（二级分组）
  const rightColumns: VxeGridPropTypes.Column<SecondGroupItem>[] = [
    {
      field: 'major_name',
      title: t('inventory.productTwoGroup'),
      minWidth: 200,
      fixed: 'left',
    },
    {
      field: 'parent_group_name',
      title: t('inventory.parentProductGroup'),
      minWidth: 200,
    },
    {
      field: 'product_number',
      title: t('inventory.productNumber'),
      minWidth: 160,
    },
    {
      field: 'creator_name',
      title: t('inventory.creator'),
      minWidth: 180,
    },
    {
      field: 'create_time',
      title: t('inventory.create_time'),
      minWidth: 180,
      sortable: true,
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: t('inventory.action'),
      minWidth: 100,
      fixed: 'right',
      slots: { default: 'rightOperation' },
    },
  ];

  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.searchKeywords')}}",
        clearable: true,
      },
    },
  };

  // 左侧表格 Hook
  const leftCrud = useCrud<FirstGroupItem, FirstGroupParams>({
    columns: leftColumns,
    searchFormSchema,
    batchOperate: false,
    service: {
      query: inventoryProductGroupApi.getFirstGroupList,
    },
  });

  // 右侧表格 Hook
  const rightCrud = useCrud<SecondGroupItem, SecondGroupParams>({
    columns: rightColumns,
    searchFormSchema: {},
    batchOperate: false,
    service: {
      query: inventoryProductGroupApi.getSecondGroupList,
    },
  });

  return rightCrud;
}
