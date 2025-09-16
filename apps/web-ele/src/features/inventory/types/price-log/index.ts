// 价格变更日志相关类型定义

export type PriceType = 'COST_PRICE' | 'SELLING_PRICE';

export interface PriceLogItem {
  id: number;
  price_type: PriceType;
  product_name: string;
  product_code: string;
  product_sku_code?: string;
  product_barcode?: string;
  origin_price: number;
  final_price: number;
  change_amount: number; // 计算字段：final_price - origin_price
  remark?: string;
  creator_name: string;
  create_time: string;
  merchant_id: number;
  product_id: number;
}

export interface PriceLogParams {
  page_num: number;
  page_size: number;
  merchant_id: number;
  price_type?: PriceType;
  keywords?: string;
  product_name?: string;
  product_code?: string;
  start_time?: string;
  end_time?: string;
}

export interface PriceLogResponse {
  list: PriceLogItem[];
  total: number;
  page_num: number;
  page_size: number;
}

export interface PriceLogStatistics {
  total_changes: number;
  total_price_changed: number;
  price_type_counts: { [key in PriceType]: number };
  daily_changes: { [date: string]: number };
  average_change_amount: number;
  max_increase: number;
  max_decrease: number;
}

export interface PriceLogFilter {
  price_types: PriceType[];
  date_range: [string, string] | null;
  keywords: string;
}

export interface PriceLogExportParams extends PriceLogParams {
  export_format: 'excel' | 'csv';
  include_details: boolean;
}
