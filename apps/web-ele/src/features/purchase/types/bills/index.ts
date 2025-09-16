// 采购单行数据类型
export interface PurchaseBillRow {
  id: number;
  bill_no: string;
  supplier_name: string;
  supplier_code: string;
  total_amount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed';
  create_time: string;
  update_time: string;
}

// 采购单表单数据类型
export interface PurchaseBillDTO {
  id?: number;
  bill_no: string;
  supplier_id: number;
  supplier_name: string;
  supplier_code: string;
  total_amount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed';
  items: PurchaseBillItemDTO[];
}

// 采购单明细数据类型
export interface PurchaseBillItemDTO {
  id?: number;
  product_id: number;
  product_name: string;
  product_code: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// 采购单查询参数类型
export interface PurchaseBillQueryParams {
  bill_no?: string;
  supplier_name?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  page: number;
  page_size: number;
}
