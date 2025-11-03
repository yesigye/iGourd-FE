// 折扣行数据类型
export interface DiscountRow {
  id: number;
  name: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_amount: number;
  max_amount: number;
  start_time: string;
  end_time: string;
  status: 'active' | 'inactive';
  enabled: 1 | 0; // Added this for toggling enabled status in the UI
  create_time: string;
  update_time: string;
}

// 折扣表单数据类型
export interface DiscountDTO {
  id?: number;
  name: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_amount: number;
  max_amount: number;
  start_time: string;
  end_time: string;
  status: 'active' | 'inactive';
  enabled: 1 | 0; // Added this to manage the creation or update of the enabled status
}

// 折扣查询参数类型
export interface DiscountQueryParams {
  keywords?: string;
  type?: string;
  status?: string;
  enabled?: 1 | 0; // Added this if filtering based on `enabled` state
  start_date?: string;
  end_date?: string;
  page: number;
  page_size: number;
}
