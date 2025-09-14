import { Component } from 'vue';

export interface ProductColumnConfig {
  prop: string;
  label: string;
  width?: number | string;
  minWidth?: number | string;
  align?: 'left' | 'center' | 'right';
  fixed?: boolean | 'left' | 'right';
  sortable?: boolean;
  formatter?: (row: any, column: any, cellValue: any) => any;
  renderComponent?: Component;
  editable?: boolean;
  required?: boolean;
  validator?: (value: any) => boolean | string;
  disabled?: boolean;
  hidden?: boolean;
  customStyle?: Record<string, any>;
  customClass?: string;
  placeholder?: string;
  type?: 'input' | 'select' | 'date' | 'number' | 'custom';
  options?: Array<{ label: string; value: any }>;
  isSelect?: boolean;
  filterable?: boolean;
  filterMethod?: (value: string) => void;
  defaultValue?: any;
  precision?: number;
  showOverflowTooltip?: boolean;
}

export interface ProductTableProps {
  tableData: any[];
  columns: ProductColumnConfig[];
  loading?: boolean;
  height?: string | number;
  maxHeight?: string | number;
  stripe?: boolean;
  border?: boolean;
  size?: 'large' | 'default' | 'small';
  fit?: boolean;
  showHeader?: boolean;
  highlightCurrentRow?: boolean;
  rowKey?: string | ((row: any) => string);
  emptyText?: string;
  showSummary?: boolean;
  sumText?: string;
  summaryMethod?: (param: { columns: any; data: any }) => any[];
  rowClassName?: string | ((row: any, index: number) => string);
  rowStyle?: Record<string, any> | ((row: any, index: number) => Record<string, any>);
  cellClassName?: string | ((row: any, column: any, index: number) => string);
  cellStyle?: Record<string, any> | ((row: any, column: any, index: number) => Record<string, any>);
  headerRowClassName?: string | ((row: any, index: number) => string);
  headerRowStyle?: Record<string, any> | ((row: any, index: number) => Record<string, any>);
  headerCellClassName?: string | ((row: any, column: any, index: number) => string);
  headerCellStyle?: Record<string, any> | ((row: any, column: any, index: number) => Record<string, any>);
  expandRowKeys?: any[];
  defaultExpandAll?: boolean;
  defaultSort?: { prop: string; order: 'ascending' | 'descending' };
  tooltipEffect?: 'dark' | 'light';
  showAction?: boolean;
  actionWidth?: string | number;
  actionFixed?: boolean | 'left' | 'right';
  actionAlign?: 'left' | 'center' | 'right';
  actionLabel?: string;
  canAdd?: boolean;
  canDelete?: boolean;
  addButtonPosition?: 'top' | 'bottom' | 'row';
  addButtonText?: string;
  showIndex?: boolean;
  indexWidth?: string | number;
  indexLabel?: string;
  indexFixed?: boolean | 'left' | 'right';
  indexAlign?: 'left' | 'center' | 'right';
  currencySymbol?: string;
  currencyCode?: string;
}

export interface ProductItem {
  [key: string]: any;
  product_id?: string | null;
  product_code?: string;
  major_name?: string;
  product_name?: string;
  product_barcode?: string;
  product_spec_kvmessage?: string;
  product_unit_code?: string;
  product_unit_name?: string;
  product_unit_id?: string;
  major_unit_name?: string;
  basic_unit_radio?: number | null;
  cost_price?: number | null;
  quantity?: number | null;
  enter_quantity?: number | string | null;
  actual_quantity?: number | null;
  profile_photo?: string;
  sub_product_stock_search_models?: any[];
  discount_amount?: number | null;
  discount_percentage?: number | null;
  other_tax_amount?: number | null;
  subtotal_amount?: number | null;
  total_amount?: number | null;
  vat_amount?: number | null;
  remark?: string;
  display_product?: any;
}

export interface CalculationOptions {
  vatConfiguration?: 'NOT_APPLICATION' | 'VAT_INCLUSIVE' | 'VAT_EXCLUSIVE';
  calculateTotals?: boolean;
}
