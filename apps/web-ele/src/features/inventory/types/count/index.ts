// 库存盘点相关类型定义

// 盘点状态枚举
export enum CountStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

// 库存盘点查询参数
export interface InventoryCountParams {
  page_num: number;
  page_size: number;
  merchant_id?: string;
  physical_stock_take_date?: string;
  physical_stock_take_no?: string;
  keywords?: string;
}

// 库存盘点项
export interface InventoryCountItem {
  id: string;
  physical_stock_take_no: string;
  physical_stock_take_date: string;
  warehouse_name: string;
  origin_total_quantity: number;
  physical_total_quantity: number;
  total_variance_quantity: number;
  total_variance_selling_price: number;
  total_variance_cost: number;
  review_status: CountStatus;
  creator_name: string;
  create_time: string;
  merchant_id?: string;
}

// 库存盘点列表响应
export interface InventoryCountListResponse {
  list: InventoryCountItem[];
  total: number;
  page_num: number;
  page_size: number;
}

// 库存盘点详情
export interface InventoryCountDetail {
  id: string;
  physical_stock_take_no: string;
  physical_stock_take_date: string;
  warehouse_name: string;
  origin_total_quantity: number;
  physical_total_quantity: number;
  total_variance_quantity: number;
  total_variance_selling_price: number;
  total_variance_cost: number;
  review_status: CountStatus;
  creator_name: string;
  create_time: string;
  physical_stock_take_item_list: InventoryCountItemDetail[];
}

// 库存盘点商品详情
export interface InventoryCountItemDetail {
  id: string;
  product_name: string;
  product_code: string;
  origin_quantity: number;
  physical_quantity: number;
  total_variance_quantity: number;
  selling_price: number;
  cost_price: number;
  total_variance_selling_price: number;
  total_variance_cost: number;
  unit_name: string;
}

// 状态信息
export interface StatusInfo {
  icon: string;
  color: string;
}

// 盘点操作参数
export interface CountOperationParams {
  id: string;
  review_status: CountStatus;
  merchant_id: string;
  total_variance_quantity: number;
  review_opinion?: string;
}

// 删除盘点参数
export interface DeleteCountParams {
  physical_stock_take_ids: string[];
  merchant_id: string;
}
export interface CountItem {
  id: string;
}
