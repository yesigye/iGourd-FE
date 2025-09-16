// 退货单行数据类型
export interface ReturnedOrderRow {
  id: number;
  returned_no: string;
  order_no: string;
  customer_name: string;
  customer_code: string;
  total_amount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed';
  create_time: string;
  update_time: string;
}

// 退货单表单数据类型
export interface ReturnedOrderDTO {
  id?: number;
  returned_no: string;
  order_id: number;
  order_no: string;
  customer_id: number;
  customer_name: string;
  customer_code: string;
  total_amount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed';
  items: ReturnedOrderItemDTO[];
}

// 退货单明细数据类型
export interface ReturnedOrderItemDTO {
  id?: number;
  product_id: number;
  product_name: string;
  product_code: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// 退货单查询参数类型
export interface ReturnedOrderQueryParams {
  returned_no?: string;
  order_no?: string;
  customer_name?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  page: number;
  page_size: number;
}
