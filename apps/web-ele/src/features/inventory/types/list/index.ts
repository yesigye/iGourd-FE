// 库存行数据类型
export interface InventoryRow {
  id: number;
  product_name: string;
  product_code: string;
  warehouse_name: string;
  warehouse_code: string;
  quantity: number;
  available_quantity: number;
  reserved_quantity: number;
  unit: string;
  last_update_time: string;
}

// 库存更新数据类型
export interface InventoryUpdateDTO {
  id: number;
  quantity: number;
  available_quantity: number;
  reserved_quantity: number;
}

// 库存查询参数类型
export interface InventoryQueryParams {
  product_name?: string;
  product_code?: string;
  warehouse_name?: string;
  warehouse_code?: string;
  page: number;
  page_size: number;
}
