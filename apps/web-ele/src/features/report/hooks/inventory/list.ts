import type { InventoryReportRow } from '@@/report/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getInventoryReportApi } from '@@/report/apis';
import dayjs from 'dayjs';

import { useCrud } from '#/hooks';

export function useInventoryReport() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<InventoryReportRow>[] = [
    {
      field: 'warehouse_name',
      title: t('inventory.warehouse'),
      minWidth: 150,

      align: 'center',
    },
    {
      field: 'product_minor_name',
      title: t('inventory.product-name'),
      minWidth: 150,

      align: 'center',
    },
    {
      field: 'product_code',
      title: t('inventory.product-code'),
      minWidth: 150,

      align: 'center',
    },
    {
      field: 'product_group_name',
      title: t('inventory.category'),
      width: 120,
      align: 'center',
    },
    {
      field: 'product_unit_name',
      title: t('inventory.unit'),
      width: 120,
      align: 'center',
    },
    {
      field: 'increased_quantity_desc',
      title: t('inventory.qty-increased'),
      width: 120,
      align: 'center',
    },
    {
      field: 'last_update_time',
      title: t('inventory.qty-increased-details'),
      width: 160,

      align: 'center',
      children: [
        {
          field: 'receipted_quantity_desc',
          title: t('inventory.purchase'),
          width: 160,

          align: 'center',
        },
        {
          field: 'increased_quantity_desc',
          title: t('inventory.add-inventory'),
          width: 160,

          align: 'center',
        },
        {
          field: 'increased_edit_inventory_quantity_desc',
          title: t('inventory.edit-inventory'),
          width: 160,

          align: 'center',
        },
        {
          field: 'increased_stock_take_quantity',
          title: t('inventory.physical-stock-take'),
          width: 160,

          align: 'center',
        },
        {
          field: 'reduced_sale_quantity_desc',
          title: t('inventory.sales-refund'),
          width: 160,

          align: 'center',
        },
      ],
    },
    {
      field: 'reduced_quantity_desc',
      title: t('inventory.qty-reduced'),
      minWidth: 150,

      align: 'center',
    },
    {
      field: 'product_code',
      title: t('inventory.qty-reduced-details'),
      minWidth: 150,

      align: 'center',
      children: [
        {
          field: 'reduced_sale_quantity_desc',
          title: t('inventory.sales'),
          minWidth: 150,
          align: 'center',
        },
        {
          field: 'purchase_returned_quantity_desc',
          title: t('inventory.purchase-refunded'),
          minWidth: 150,

          align: 'center',
        },
        {
          field: 'reduced_stock_take_quantity_desc',
          title: t('inventory.physical-stock-take'),
          minWidth: 150,
          align: 'center',
        },
        {
          field: 'stock_consumption_quantity_desc',
          title: t('inventory.consumption'),
          minWidth: 150,

          align: 'center',
        },
        {
          field: 'increased_edit_inventory_quantity_desc',
          title: t('inventory.edit-inventory'),
          minWidth: 150,

          align: 'center',
        },
      ],
    },
    {
      field: 'stock_quantity',
      title: t('inventory.remain-qty'),
      minWidth: 150,

      align: 'center',
    },
    {
      field: 'stock_value_amount_cost',
      title: t('inventory.total-value-of-products-by-cost'),
      width: 120,
      align: 'center',
    },
    {
      field: 'stock_value_amount',
      title: t('inventory.total-value-of-products-by-selling'),
      width: 120,
      align: 'center',
    },
    {
      field: 'creator_name',
      title: t('common.creator'),
      width: 120,
      align: 'center',
    },
    {
      field: 'create_time',
      title: t('common.creation-time'),
      width: 160,

      align: 'center',
    },
  ];

  const searchFormSchema = {
    product_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.product-name')}}",
        clearable: true,
      },
    },
    product_code: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.product-code')}}",
        clearable: true,
      },
    },
    warehouse_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.warehouse')}}",
        clearable: true,
      },
    },
    stock_status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.stock-status')}}",
        clearable: true,
        options: [
          { label: t('inventory.normal'), value: 'normal' },
          { label: t('inventory.low'), value: 'low' },
          { label: t('inventory.out'), value: 'out' },
        ],
      },
    },
  };

  return useCrud<InventoryReportRow, any>({
    columns,
    searchFormSchema,
    batchOperate: false,
    service: {
      query: async (params: {
        end_date?: string;
        page_num: number;
        page_size: number;
        start_date?: string;
        tabKey: string;
        time_range: string;
      }) => {
        // 开始时间默认是当前时间-一个月
        params.end_date =
          params.end_date || `${dayjs().format('YYYY-MM-DD')} 23:59:59`;
        params.start_date =
          params.start_date ||
          `${dayjs().subtract(1, 'months').format('YYYY-MM-DD')} 00:00:00`;
        params.tabKey = 'months';
        params.time_range = 'MONTH';
        const response = await getInventoryReportApi(params);
        return {
          list: response?.list || [],
          total: response?.data?.total || 0,
        };
      },
    },
  });
}
