import type { Column } from '@@/sale/types';

/*
 * @Author: caixin caixin185@163.com
 * @Date: 2025-01-15 14:52:34
 * @LastEditors: caixin-yIzEy
 * @LastEditTime: 2025-02-12 12:04:42
 * @Description: file content
 */
import { h } from 'vue';

import Decimal from 'decimal.js';

import {
  Amount,
  Price,
  ProductMajor,
  StockWithSelect,
  UnitSelect,
} from '../render';
// import { isDef } from '@/service/validation.service';

export const allColumns: Column[] = [
  {
    prop: 'major_name',
    localKey: 'product',
    key: 'sales',
    width: '160',
    fixed: 'left',
    align: 'left',
    isSelect: true,
    disabled: false,
    render: ({ row, value }) => {
      return h(ProductMajor, { detailInfo: { ...row, major_name: value } });
    },
  },
  {
    prop: 'selling_price',
    localKey: 'price',
    key: 'sales',
    width: '180',
    align: 'left',
    isSelect: true,
    disabled: false,
    render: ({ row, value }) => {
      return h(Price, {
        detailInfo: { ...row, selling_price: row.custom_price || value },
      });
    },
  },
  {
    prop: 'sale_warehouse_name',
    width: '160',
    align: 'left',
    localKey: 'stock',
    key: 'sales',
    isSelect: true,
    disabled: true,
    render: ({ row }) => {
      return h(StockWithSelect, {
        detailInfo: { ...row },
        warehouseOptions: row.warehouse_list || [],
        onChange: (value, warehouseName) => {
          row.sale_warehouse_id = value;
          row.sale_warehouse_name = warehouseName;
        },
      });
    },
  },
  {
    prop: 'stock_total_quantity',
    width: '180',
    align: 'left',
    localKey: 'quantity',
    key: 'sales',
    isSelect: true,
    disabled: true,
  },
  {
    prop: 'sub_product_stock_search_models',
    localKey: 'unit',
    width: '150',
    render({ row }) {
      return h(UnitSelect, {
        detailInfo: row,
        onUnitChange: (data) => {
          // 将仓库信息添加到事件数据中
          const eventData = {
            ...data,
          };

          // 触发单位变更事件
          window.dispatchEvent(
            new CustomEvent('unit-change', { detail: eventData }),
          );
        },
      });
    },
  },
  {
    prop: 'vat_amount',
    localKey: 'taxRate',
    key: 'sales',
    width: '160',
    align: 'left',
    isSelect: true,
    disabled: false,
  },
  {
    prop: 'total_amount',
    localKey: 'totalAmount',
    key: 'sales',
    width: '160',
    fixed: 'right',
    align: 'left',
    isSelect: true,
    disabled: false,
    render: ({ row }) => {
      return h(Amount, { detailInfo: { ...row } });
    },
    // render: ({ row }) => {
    //   const totalAmount = (row.selling_price || 0) * (row.quantity || 0);
    //   const title = h('div', { class: 'title' }, thousandSeparator(totalAmount));
    //   // const subTitle = h('div', { class: 'sub-title' }, 'VAT: 0');
    //   return h('div', null, [title]);
    // }
  },
  // TODO: 金额计算
  // render: ({ row }) => {
  //   return h(Amount, { detailInfo: { ...row } });
  // }
];
export const allColumnsSelect: Column[] = [
  {
    prop: 'major_name',
    localKey: 'product',
    key: 'sales',
    width: '160',
    fixed: 'left',
    align: 'left',
    isSelect: true,
    disabled: false,
    render: ({ row, value }) => {
      return h(ProductMajor, { detailInfo: { ...row, major_name: value } });
    },
  },
  {
    prop: 'selling_price',
    localKey: 'price',
    key: 'sales',
    width: '180',
    align: 'left',
    isSelect: true,
    disabled: false,
    render: ({ row, value }) => {
      return h(Price, {
        detailInfo: { ...row, selling_price: row.custom_price || value },
      });
    },
  },
  {
    prop: 'sale_warehouse_name',
    width: '160',
    align: 'left',
    localKey: 'stock',
    key: 'sales',
    isSelect: true,
    disabled: true,
    render: ({ row }) => {
      return h(StockWithSelect, {
        detailInfo: { ...row },
        warehouseOptions: row.warehouse_list || [],
        onChange: (value, warehouseName) => {
          row.sale_warehouse_id = value;
          row.sale_warehouse_name = warehouseName;
        },
      });
    },
  },
  {
    prop: 'sale_warehouse_product_stock_quantity',
    width: '180',
    align: 'left',
    localKey: 'quantity',
    key: 'sales',
    isSelect: true,
    disabled: true,
  },
  {
    prop: 'sub_product_stock_search_models',
    localKey: 'unit',
    width: '150',
    render({ row }) {
      return h(UnitSelect, {
        detailInfo: row,
        onUnitChange: (data) => {
          // 将仓库信息添加到事件数据中
          const eventData = {
            ...data,
          };

          // 触发单位变更事件
          window.dispatchEvent(
            new CustomEvent('unit-change', { detail: eventData }),
          );
        },
      });
    },
  },
  {
    prop: 'total_amount',
    localKey: 'totalAmount',
    key: 'sales',
    width: '160',
    fixed: 'right',
    align: 'left',
    isSelect: true,
    disabled: false,
    render: ({ row }) => {
      return (
        <div>
          {Decimal(
            row.sale_warehouse_product_stock_quantity * row.custom_price,
          )}
        </div>
      );
    },
    // render: ({ row }) => {
    //   const totalAmount = (row.selling_price || 0) * (row.quantity || 0);
    //   const title = h('div', { class: 'title' }, thousandSeparator(totalAmount));
    //   // const subTitle = h('div', { class: 'sub-title' }, 'VAT: 0');
    //   return h('div', null, [title]);
    // }
  },
  // TODO: 金额计算
  // render: ({ row }) => {
  //   return h(Amount, { detailInfo: { ...row } });
  // }
];
