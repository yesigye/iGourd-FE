// 库存报表行数据类型
export interface InventoryReportRow {
  id: number;
  product_name: string;
  product_code: string;
  warehouse_name: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  stock_status: 'normal' | 'low' | 'out';
  last_update_time: string;
}

// 库存报表查询参数类型
export interface InventoryReportQueryParams {
  product_name?: string;
  product_code?: string;
  warehouse_name?: string;
  stock_status?: string;
  page: number;
  page_size: number;
}

// 库存统计数据类型
export interface InventoryStats {
  total_products: number;
  total_stock_value: number;
  low_stock_products: number;
  out_of_stock_products: number;
}
