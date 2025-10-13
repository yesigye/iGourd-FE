import { WritableComputedRef } from 'vue';

export type EmitAddSpecType = {
  type: 'specValue' | 'spec';
  action: 'add' | 'edit';
  data: SpecTypeByForm;
};

export type SpecTypeByForm = {
  merchant_id: string;
  product_spec_code: '';
  product_spec_id: '';
  product_spec_name: string;
  product_spec_value: '';
  status: 'OPEN';
};

export interface InputSyncProps {
  newVal: any;
  rowType: string;
  /**
   * 开启批量编辑            批量编辑项bulkEditOptions中的值
   * show: bulkEditEnabled  --> bulkEditSelection -> tableData
   * 所有的选项
   * bulkEditOptions
   *
   * bulkEditSelection  bulkEditOptions 对应多个规格项
   * */
  row: any;
  oldVal?: any;

  batchEditType?: 'all' | string;
}

export type ReactiveData = {
  tableData: SpecTableData[];
  bulkEditSelection: WritableComputedRef<`spec_${string}`>;
  specRows: WritableComputedRef<SpecRow[]>;
  bulkEditEnabled: WritableComputedRef<boolean>;
};

export type SpecRow = {
  allSelected: boolean;
  is_update_config: boolean;
  selectedValues: SpecRowItem[];
  specId: string;
  specName: string;
};

export type SpecRowItem = {
  id: string;
  is_update_config: boolean;
  product_spec_code: string;
  product_spec_id: string;
  product_spec_value: string;
};

export type SpecTableData = {
  basic_unit_id: string;
  basic_unit_radio: string;
  cost_price: number;
  initial_stock_quantity: number;
  initial_stock_warehouse_id: null | string;
  initial_stock_warehouse_location_id: number;
  is_basic: number;
  is_update_config: boolean;
  major_name: string;
  merchant_id: string;
  package_barcode: string;
  product_info_spec_list: Array<any>; // 这里可以根据实际数据结构进一步定义
  product_profile_id: string;
  product_unit_id: string;
  product_unit_name: string;
  profile_photo: string;
  remark: string;
  sellingPrice: string;
  selling_price: string;
  skuKey: string;
  sku_barcode: string;
  sku_group_code: string;
  spec_code: string;
  status: string;
  unit: string;
  // 自定义规格
  尺码?: string;
  颜色?: string;
} & Record<string, string>;

// 新增类型定义
export interface TranslationFunction {
  (key: string): string;
}

export interface UnitItem {
  id: string;
  name: string;
  merchant_id: string;
  status: string;
  [key: string]: any;
}

export interface UnitTableRow {
  secondary_unit_id: string;
  secondary_unit_name: string;
  basic_unit_radio: string;
  basic_unit_name: string;
  package_barcode: string;
  is_update_config: boolean;
  [key: string]: any;
}

export interface SkuTableRow {
  status: 'ON_SALE' | 'OFF_SALE';
  profile_photo: string;
  sku_barcode: string;
  spec_code: string;
  product_info_spec_list: Array<any>;
  cost_price: number;
  selling_price: number;
  initial_stock_quantity: number;
  initial_stock_warehouse_id: string | null;
  remark: string;
  is_update_config: boolean;
  [key: string]: any;
}

export interface UnitsTableRenderProps {
  row: UnitTableRow;
  $index: number;
  unitList?: UnitItem[];
  handleUnitSelect?: (row: UnitTableRow, value: string) => void;
  mode?: 'view' | 'edit' | 'add';
  units?: UnitTableRow[];
  handleAddUnit?: () => void;
  quickAddUnit?: (name: string) => void;
  handleUnitSearch?: (query: string) => void;
  handleUnitChange?: (row: UnitTableRow, prop: string, value: any, index: number) => void;
  handleDeleteUnit?: (row: UnitTableRow, index: number) => void;
  t?: TranslationFunction;
  showUnit?: boolean;
  multiUnits?: boolean;
}

export interface SkuTableRenderProps {
  row: SkuTableRow;
  $index: number;
  mode?: 'view' | 'edit' | 'add';
  handleStatusChange?: (row: SkuTableRow, value: string) => void;
  handleSkuChange?: (row: SkuTableRow, prop: string, value: any, index: number) => void;
  handleWarehouseChange?: (row: SkuTableRow, value: string) => void;
  warehouseList?: Array<{ id: string; name: string; [key: string]: any }>;
  t?: TranslationFunction;
  specRows?: SpecRow[];
  tableData?: SkuTableRow[];
  bulkEditEnabled?: boolean;
  bulkEditSelection?: string;
  handleBulkEdit?: (type: string, value: any) => void;
}

export interface TableColumn {
  type?: string;
  fixed?: 'left' | 'right';
  label?: string;
  prop?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  render?: (props: UnitsTableRenderProps | SkuTableRenderProps) => any;
}
// 价格字段类型
export type PriceField = 'selling_price' | 'cost_price' | 'profit_rate';

// 行数据接口
export interface RowData {
  selling_price: string | number;
  cost_price: string | number;
  profit_rate: string | number;
  [key: string]: any; // 允许其他字段
}

// 计算结果接口
export interface CalculationResult {
  key: string;
  value: string | number;
}

// 场景计算器接口
export interface ScenarioCalculator {
  selling_price(): string | number | CalculationResult;
  profit_rate(): string | number | CalculationResult;
  cost_price(): string | number | CalculationResult;
}

// 策略接口
export interface CalculationStrategy {
  threeFields: () => void;
  twoFields: () => void;
}

// 策略映射类型
export type CalculationStrategies = Record<PriceField, CalculationStrategy>;

// 常量类型
export interface RequiredFieldCount {
  readonly THREE_FIELDS: 3;
  readonly TWO_FIELDS: 2;
}
