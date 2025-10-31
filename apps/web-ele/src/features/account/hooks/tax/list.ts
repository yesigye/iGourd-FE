import { ref } from 'vue';
import type { TaxPageModel } from '@@/account/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { deleteTaxApi, getTaxPageListApi } from '@@/account/apis';
import { TaxDrawer } from '@@/account/components';
import { useLanguage } from '#/hooks';
import { useCrud } from '#/hooks';
import { getEnumLabel } from '#/utils/global';

export function useTax() {
  const { t } = useI18n();
  const taxType = ref([]);
  const taxationType = ref([]);
  const calculationType = ref([]);
  const loadTaxType = async (field: { props: { name: string } }) => {
    const enumData = await useLanguage('basics.accounting.tax-type-enum');
    taxType.value = enumData;
  };
  const loadTaxationType = async (field: { props: { name: string } }) => {
    const enumData = await useLanguage(
      'basics.accounting.taxation-office-tax-type-enum',
    );
    taxationType.value = enumData;
  };
  const loadCalculationType = async (field: { props: { name: string } }) => {
    const enumData = await useLanguage(
      'basics.accounting.tax-calculation-type-enum',
    );
    calculationType.value = enumData;
  };
  loadTaxType();
  loadCalculationType();
  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<TaxPageModel>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'name',
      minWidth: 200,
      align: 'left',
      fixed: 'left',
      title: t('tax.tax-name'),
      sortable: true,
    },
    {
      field: 'tax_type',
      minWidth: 160,
      align: 'left',
      title: t('tax.tax-type'),
      sortable: true,
      formatter({ cellValue }) {
        return getEnumLabel(taxType.value, cellValue);
      },
    },
    {
      field: 'calculation_type',
      minWidth: 160,
      align: 'left',
      title: t('tax.calculation-type'),
      sortable: true,
      formatter({ cellValue }) {
        return getEnumLabel(calculationType.value, cellValue);
      },
    },
    {
      field: 'percentage',
      minWidth: 160,
      align: 'left',
      title: t('tax.percentage'),
      sortable: true,
    },
    {
      field: 'tax_amount',
      minWidth: 160,
      align: 'left',
      title: t('tax.tax-amount'),
      sortable: true,
      formatter: 'formatMoney',
    },
    {
      field: 'creator_name',
      minWidth: 200,
      align: 'left',
      title: t('tax.creator-name'),
      sortable: true,
    },
    {
      field: 'create_time',
      minWidth: 180,
      align: 'left',
      title: t('tax.create-time'),
      sortable: true,
    },
    {
      field: 'operation',
      title: t('common.operation'),
      sortable: true,
      minWidth: 160,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getTaxPageListApi,

    // 删除税务
    remove: async (data: { tax_id_list: number[] }) => {
      return await deleteTaxApi(data);
    },
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      id: 'tax',
      columns: baseColumns,
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
      batchOperate: true, // 支持批量删除
      connectedComponent: TaxDrawer,
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
