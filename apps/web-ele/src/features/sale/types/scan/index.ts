// 扫码销售行数据类型
export interface ScanSaleRow {
  id: number;
  scan_no: string;
  product_name: string;
  product_code: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  scan_time: string;
  status: 'pending' | 'completed' | 'cancelled';
  create_time: string;
  update_time: string;
}

// 扫码销售表单数据类型
export interface ScanSaleDTO {
  id?: number;
  scan_no: string;
  product_id: number;
  product_name: string;
  product_code: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  scan_time: string;
  status: 'pending' | 'completed' | 'cancelled';
}

// 扫码销售查询参数类型
export interface ScanSaleQueryParams {
  scan_no?: string;
  product_name?: string;
  product_code?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  page: number;
  page_size: number;
}
