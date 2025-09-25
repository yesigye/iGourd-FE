// 直接使用 Formily 的 ISchema 类型
import type { ISchema } from '@igourd/common-ui';

export type Id = number | string;

export type VATMode = 'NOT_APPLICATION' | 'VAT_EXCLUSIVE' | 'VAT_INCLUSIVE';

export interface Product {
  id: Id;
  name?: string;
  major_name?: string;
  product_code?: string;
  product_unit_code?: string;
  product_unit_name?: string;
  major_unit_name?: string;
  minor_name?: string;
  image_url?: string;
  profile_photo?: string;
  default_sku_id?: Id;
  barcodes?: string[];
  basic_unit_radio?: null | number; // 1:ratio
  pricing?: {
    cost_price?: null | number;
    selling_price?: null | number;
  };
  tax?: {
    other_tax_rate?: null | number;
    vat_rate?: null | number; // 0~1
  };
  // legacy fields compatibility
  [k: string]: any;
}

export interface Sku {
  id: Id;
  name?: string;
  barcode?: string;
  stock_total_quantity?: null | number;
  stock_total_quantity_message?: string;
  // legacy fields compatibility
  [k: string]: any;
}

export interface LineItem {
  // identifiers
  product_id?: Id | null;
  sku_id?: Id | null;
  product_code?: string;
  product_name?: string;
  major_name?: string;
  display_major_name?: string;

  // unit & quantity
  unit_code?: 'major' | 'minor'; // current display unit
  basic_unit_radio?: null | number; // 1:ratio
  quantity_base?: null | number; // normalized to base (minor) unit
  display_quantity?: null | number; // UI-bound quantity

  // prices & tax
  unit_price?: null | number;
  discount_amount?: null | number;
  discount_percentage?: null | number;
  vat_rate?: null | number;
  other_tax_rate?: null | number;

  // amounts
  subtotal_amount?: null | number;
  vat_amount?: null | number;
  total_amount?: null | number;

  // stock
  stock_available?: null | number;
  sale_warehouse_product_stock_quantity?: null | number;
  sale_warehouse_product_stock_quantity_message?: string;

  // legacy compatibility (kept & updated by bridges when present)
  enter_quantity?: null | number;
  transfer_quantity?: null | number;
  physical_quantity?: null | number;
  returned_quantity?: null | number;
  stock_add_quantity?: null | number;
  stock_warning_quantity?: null | number;

  // misc
  product_unit_name?: string;
  product_unit_code?: string;
  major_unit_name?: string;
  profile_photo?: string;
  remark?: string;

  // raw
  [k: string]: any;
}

export type ProductTableEvent =
  | { barcode: string; type: 'SCAN_PRODUCT' }
  | { index: number; skuId: Id; type: 'SKU_CHANGE' }
  | { index: number; type: 'PRICE_CHANGE'; value: null | number }
  | { index: number; type: 'QTY_CHANGE_COMMIT'; value: null | number }
  | { index: number; type: 'QTY_CHANGE_LOCAL'; value: null | number }
  | { index: number; type: 'UNIT_CHANGE'; unit: 'major' | 'minor' };

export interface Ctx {
  mode: string;
  warehouseId?: Id;
  vatMode?: VATMode;
  currencySymbol?: string;
  capabilities: string[]; // ['unit','vat','discount','stock','barcode','remark','image']
  services: {
    fetchProductByBarcode?: (
      barcode: string,
      ctx: Ctx,
    ) => Promise<null | Product | Product[]>;
    fetchStockBySku?: (
      skuId: Id,
      ctx: Ctx,
    ) => Promise<null | { available: number }>;
    listSkusByProduct?: (productId: Id, ctx: Ctx) => Promise<null | Sku[]>;
    searchProducts?: (
      wearhouseId: Id,
      ctx: Ctx,
    ) => Promise<null | { available: number }>;
  };
  flags?: {
    isReceiptMode?: boolean;
    purchaseOrderSelected?: boolean;
  };
  i18n?: {
    t?: (key: string) => string;
  };
}

export type ColumnDescriptor = ISchema;

export type ColumnMap = Record<string, ColumnDescriptor>;

export interface QuantityBridge {
  legacyKeys?: string[];

  readDisplay(line: LineItem, ctx: Ctx): null | number;
  writeDisplayLocal(
    line: LineItem,
    displayVal: null | number,
    ctx: Ctx,
  ): LineItem;
  writeDisplayCommit?(
    line: LineItem,
    displayVal: null | number,
    ctx: Ctx,
  ): LineItem | Promise<LineItem>;

  onUnitChange?(line: LineItem, unit: 'major' | 'minor', ctx: Ctx): LineItem;
  getUnitOptions?(
    line: LineItem,
    ctx: Ctx,
  ): Array<{ code: string; factor: number; label: string; raw?: any }>;
  onUnitSelect?(
    line: LineItem,
    option: { code: string; factor: number; label: string; raw?: any },
    ctx: Ctx,
  ): LineItem;
  canChangeUnit?(line: LineItem, ctx: Ctx): boolean;
  disabled?(line: LineItem, ctx: Ctx): boolean;
  getTotalAmount(value: number, line: LineItem, ctx: Ctx): string;
}

export interface ModePlugin {
  id: string;
  columns(ctx: Ctx): ColumnDescriptor[];
  handleEvent(
    evt: ProductTableEvent,
    data: LineItem[],
    ctx: Ctx,
  ): LineItem[] | Promise<LineItem[]>;
  quantityBridge?: Partial<QuantityBridge>;
  rowSpanBy?(ctx: Ctx): Array<keyof LineItem>;
  mergeColumnsForRowSpan?(): Array<{
    byField: keyof LineItem;
    columnKey: string;
  }>; // e.g. [{columnKey:'stock_warning_quantity', byField:'product_barcode'}]
  validate?(data: LineItem[], ctx: Ctx): string[];
}
