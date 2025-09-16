// 客户报表行数据类型
export interface CustomerReportRow {
  id: number;
  customer_name: string;
  customer_code: string;
  total_orders: number;
  total_amount: number;
  avg_order_amount: number;
  last_order_date: string;
  create_time: string;
}

// 客户报表查询参数类型
export interface CustomerReportQueryParams {
  customer_name?: string;
  customer_code?: string;
  start_date?: string;
  end_date?: string;
  page: number;
  page_size: number;
}

// 客户统计数据类型
export interface CustomerStats {
  total_customers: number;
  active_customers: number;
  new_customers: number;
  total_orders: number;
  total_amount: number;
}
