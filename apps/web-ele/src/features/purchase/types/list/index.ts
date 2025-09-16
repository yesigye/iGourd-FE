// 采购列表行数据类型
export interface PurchaseListRow {
  id: number;
  purchase_no: string;
  supplier_name: string;
  product_name: string;
  product_code: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  purchase_date: string;
  status: 'pending' | 'completed' | 'cancelled';
  create_time: string;
  update_time: string;
}

// 采购列表表单数据类型
export interface PurchaseListDTO {
  id?: number;
  purchase_no: string;
  supplier_id: number;
  supplier_name: string;
  product_id: number;
  product_name: string;
  product_code: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  purchase_date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

// 采购列表查询参数类型
export interface PurchaseListQueryParams {
  purchase_no?: string;
  supplier_name?: string;
  product_name?: string;
  product_code?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  page: number;
  page_size: number;
}
