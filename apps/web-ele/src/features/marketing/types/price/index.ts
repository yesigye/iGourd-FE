// 价格行数据类型
export interface PriceRow {
  id: number;
  product_name: string;
  product_code: string;
  price_type: 'retail' | 'wholesale' | 'vip';
  price: number;
  cost: number;
  margin: number;
  start_time: string;
  end_time: string;
  status: 'active' | 'inactive';
  create_time: string;
  update_time: string;
}

// 价格表单数据类型
export interface PriceDTO {
  id?: number;
  product_id: number;
  product_name: string;
  product_code: string;
  price_type: 'retail' | 'wholesale' | 'vip';
  price: number;
  cost: number;
  margin: number;
  start_time: string;
  end_time: string;
  status: 'active' | 'inactive';
}

// 价格查询参数类型
export interface PriceQueryParams {
  product_name?: string;
  product_code?: string;
  price_type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  page: number;
  page_size: number;
}
