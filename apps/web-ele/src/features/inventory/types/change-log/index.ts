// 库存变更日志相关类型定义

export type ChangeType = 
  | 'PURCHASE'           // 采购入库
  | 'SALE'              // 销售出库
  | 'RETURN'            // 退货入库
  | 'ADJUSTMENT'        // 库存调整
  | 'TRANSFER_IN'       // 调拨入库
  | 'TRANSFER_OUT'      // 调拨出库
  | 'SPOILAGE'          // 损耗出库
  | 'COUNT'             // 盘点调整
  | 'OTHER';            // 其他

export type StockType = 'STOCK' | 'VIRTUAL' | 'ALL';

export interface ChangeLogItem {
  id: number;
  change_type: ChangeType;
  stock_type: StockType;
  receipt_no: string;
  product_name: string;
  product_code: string;
  product_sku_code?: string;
  product_barcode?: string;
  product_unit_name: string;
  warehouse_name: string;
  location_name?: string;
  origin_quantity: number;
  final_quantity: number;
  change_quantity: number; // 计算字段：final_quantity - origin_quantity
  remark?: string;
  creator_name: string;
  create_time: string;
  merchant_id: number;
  product_id: number;
  warehouse_id: number;
  location_id?: number;
}

export interface ChangeLogParams {
  page_num: number;
  page_size: number;
  merchant_id: number;
  change_type?: ChangeType;
  stock_type?: StockType;
  keywords?: string;
  product_name?: string;
  product_code?: string;
  receipt_no?: string;
  warehouse_name?: string;
  location_name?: string;
  creator_name?: string;
  start_time?: string;
  end_time?: string;
  remark?: string;
}

export interface ChangeLogResponse {
  list: ChangeLogItem[];
  total: number;
  page_num: number;
  page_size: number;
}

export interface ChangeLogStatistics {
  total_changes: number;
  total_quantity_changed: number;
  change_type_counts: { [key in ChangeType]: number };
  warehouse_counts: { [warehouse_name: string]: number };
  daily_changes: { [date: string]: number };
}

export interface ChangeLogFilter {
  change_types: ChangeType[];
  stock_types: StockType[];
  warehouses: string[];
  date_range: [string, string] | null;
  keywords: string;
}

export interface ChangeLogExportParams extends ChangeLogParams {
  export_format: 'excel' | 'csv';
  include_details: boolean;
}
