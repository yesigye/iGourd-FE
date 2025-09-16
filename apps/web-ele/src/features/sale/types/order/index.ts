// 销售订单行数据类型
export interface SaleOrderRow {
  id: number;
  order_no: string;
  customer_name: string;
  customer_code: string;
  total_amount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  create_time: string;
  update_time: string;
}

// 销售订单表单数据类型
export interface SaleOrderDTO {
  id?: number;
  order_no: string;
  customer_id: number;
  customer_name: string;
  customer_code: string;
  total_amount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  items: SaleOrderItemDTO[];
}

// 销售订单明细数据类型
export interface SaleOrderItemDTO {
  id?: number;
  product_id: number;
  product_name: string;
  product_code: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// 销售订单查询参数类型
export interface SaleOrderQueryParams {
  order_no?: string;
  customer_name?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  page: number;
  page_size: number;
}
