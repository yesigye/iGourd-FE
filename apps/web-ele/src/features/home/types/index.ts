// 首页数据类型
export interface HomeData {
  recent_orders: any[];
  recent_customers: any[];
  low_stock_products: any[];
  recent_activities: any[];
}

// 首页统计数据类型
export interface HomeStats {
  today_orders: number;
  today_revenue: number;
  total_customers: number;
  total_products: number;
  low_stock_count: number;
  pending_orders: number;
}
