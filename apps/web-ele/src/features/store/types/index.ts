// 店铺信息数据类型
export interface StoreInfo {
  id: number;
  name: string;
  code: string;
  description: string;
  logo: string;
  address: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  status: 'active' | 'inactive';
  create_time: string;
  update_time: string;
}

// 店铺统计数据类型
export interface StoreStats {
  total_orders: number;
  total_customers: number;
  total_products: number;
  total_revenue: number;
  monthly_orders: number;
  monthly_revenue: number;
}

export * from './create';
export * from './device';
// Store Types
export * from './list';
export * from './payment';
