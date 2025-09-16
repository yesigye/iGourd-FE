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
}

// 折扣查询参数类型
export interface DiscountQueryParams {
  keywords?: string;
  type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  page: number;
  page_size: number;
}
