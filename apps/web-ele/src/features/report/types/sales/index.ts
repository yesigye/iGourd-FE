// 销售报表行数据类型
export interface SalesReportRow {
  id: number;
  date: string;
  order_count: number;
  total_amount: number;
  avg_order_amount: number;
  product_count: number;
  create_time: string;
}

// 销售报表查询参数类型
export interface SalesReportQueryParams {
  start_date?: string;
  end_date?: string;
  page: number;
  page_size: number;
}

// 销售统计数据类型
export interface SalesStats {
  total_orders: number;
  total_amount: number;
  avg_order_amount: number;
  total_products: number;
}
