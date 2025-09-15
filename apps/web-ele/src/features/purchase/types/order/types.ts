export type ID = string | number;

export type PurchaseOrderItem = {
  product_id: ID | null;
  major_name?: string;
  product_spec_kvmessage?: string;
  product_unit_code?: string;
  product_unit_name?: string;
  quantity: number | null;
  cost_price: number | null;
  remark?: string;
  subtotal_amount: number | null;
  total_amount: number | null;
  vat_amount: number | null;
  sub_product_stock_search_models?: any[];
  display_product?: Record<string, any>;
  [key: string]: any;
};

export type PurchaseOrderForm = {
  purchase_order_no: string;
  vendor_id: ID | null;
  warehouse_id: ID | null;
  purchase_date: string;
  currency_code: string;
  exchange_rate: number | null;
  display_currency?: string;
  display_exchange_rate?: string;
  discount_amount: number;
  discount_percentage: number;
  other_tax_amount: number;
  vat_amount: number;
  vat_configuration:
    | 'NOT_APPLICATION'
    | 'VAT_INCLUSIVE'
    | 'VAT_EXCLUSIVE'
    | string;
  subtotal_amount: number;
  total_amount: number;
  deposit_amount: number | null;
  attachment_url: string;
  attachment_name: string;
  remark: string;
  purchase_order_item_list: PurchaseOrderItem[];
};

export type Vendor = {
  id: ID;
  name: string;
  contact_name?: string;
  contact_telephone?: string;
  currency_code?: string;
  exchange_rate?: number;
  [key: string]: any;
};

export type CurrencyPick = {
  code: string;
  currencyData?: { symbol?: string };
};

export interface CurrencyQueryPageVO {
  // 货币编码
  code?: string;
  // 关键字
  keywords?: string;
  // 关联商户ID
  merchant_id?: number;
  // 当前页码
  page_num?: number;
  // 每页条数
  page_size?: number;
}

export interface CurrencyQueryVO {
  // 货币编码
  code?: string;
  // 关联商户ID
  merchant_id?: number;
}
