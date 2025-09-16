// 库存变更日志相关类型定义

// 库存变更类型枚举
export enum ChangeType {
  POINT_EXCHANGE = 'POINT_EXCHANGE',
  STOCK_UNPACK = 'STOCK_UNPACK',
  GOODS_RECEIPT = 'GOODS_RECEIPT',
  CANCEL_PHYSICAL_STOCK_TAKE = 'CANCEL_PHYSICAL_STOCK_TAKE',
  CANCEL_STOCK_CONSUMPTION = 'CANCEL_STOCK_CONSUMPTION',
  EDIT_STOCK = 'EDIT_STOCK',
  STOCK_TRANSFER_OUT = 'STOCK_TRANSFER_OUT',
  SALES_DISPATCH = 'SALES_DISPATCH',
  STOCK_TRANSFER_OUT_CANCEL = 'STOCK_TRANSFER_OUT_CANCEL',
  SALES_RETURNED = 'SALES_RETURNED',
  STOCK_PACK = 'STOCK_PACK',
  PHYSICAL_STOCK_TAKE = 'PHYSICAL_STOCK_TAKE',
  STOCK_TRANSFER_IN = 'STOCK_TRANSFER_IN',
  PURCHASE_RETURNED = 'PURCHASE_RETURNED',
  STOCK_CONSUMPTION = 'STOCK_CONSUMPTION',
  STOCK_TRANSFER_IN_CANCEL = 'STOCK_TRANSFER_IN_CANCEL',
  INITIAL_STOCK = 'INITIAL_STOCK',
  DELETE_STOCK = 'DELETE_STOCK'
}

// 库存变更日志查询参数
export interface InventoryChangeLogParams {
  change_type?: string;
  create_time?: string;
  keywords?: string;
  merchant_id?: string;
  location_name?: string;
  page_num: number;
  page_size: number;
  product_code?: string;
  product_name?: string;
  receipt_no?: string;
  remark?: string;
  warehouse_name?: string;
  stock_type?: string;
}

// 库存变更日志项
export interface InventoryChangeLogItem {
  id: string;
  change_type: ChangeType;
  receipt_no: string;
  product_name: string;
  product_code: string;
  warehouse_name: string;
  location_name?: string;
  change_quantity: number;
  origin_quantity: number;
  final_quantity: number;
  product_unit_name: string;
  creator_name: string;
  create_time: string;
  remark?: string;
  stock_type?: string;
}

// 库存变更日志列表响应
export interface InventoryChangeLogListResponse {
  list: InventoryChangeLogItem[];
  total: number;
  page_num: number;
  page_size: number;
}

// 变更类型选项
export interface ChangeTypeOption {
  id: string;
  label: string;
  value: ChangeType;
}

// 表格列配置
export interface TableColumn {
  prop: string;
  localKey: string;
  width: string;
  align: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  isSelect: boolean;
  disabled: boolean;
  key: string;
}
