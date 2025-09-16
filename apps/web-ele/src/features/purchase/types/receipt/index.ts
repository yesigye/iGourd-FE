// 收货单状态枚举
export enum ReceiptStatus {
  DRAFT = 'DRAFT', // 草稿
  PENDING = 'PENDING', // 待审核
  APPROVED = 'APPROVED', // 已审核
  RECEIVED = 'RECEIVED', // 已收货
  CANCELLED = 'CANCELLED', // 已取消
}

// 查询参数
export interface PurchaseReceiptQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  status?: ReceiptStatus;
  supplier_id?: number;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
}

// 分页响应
export interface PurchaseReceiptPageModel {
  id: number;
  receipt_no: string;
  supplier_name: string;
  status: ReceiptStatus;
  total_amount: number;
  receipt_date: string;
  remark?: string;
  creator_name: string;
  create_time: string;
}

// 创建参数
export interface PurchaseReceiptCreateVO {
  supplier_id: number;
  receipt_date: string;
  remark?: string;
  products: PurchaseReceiptProductVO[];
  merchant_id?: number;
}

// 修改参数
export interface PurchaseReceiptModifyVO {
  receipt_id: number;
  supplier_id?: number;
  receipt_date?: string;
  remark?: string;
  products?: PurchaseReceiptProductVO[];
  merchant_id?: number;
}

// 删除参数
export interface PurchaseReceiptRemoveVO {
  receipt_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface PurchaseReceiptDetailModel {
  id: number;
  receipt_no: string;
  supplier_id: number;
  supplier_name: string;
  status: ReceiptStatus;
  total_amount: number;
  receipt_date: string;
  remark?: string;
  creator_name: string;
  create_time: string;
  products: PurchaseReceiptProductModel[];
}

// 收货产品模型
export interface PurchaseReceiptProductModel {
  id: number;
  product_id: number;
  product_name: string;
  product_code: string;
  sku_code: string;
  ordered_quantity: number;
  received_quantity: number;
  unit_price: number;
  total_price: number;
  unit_name: string;
  remark?: string;
}

// 收货产品创建参数
export interface PurchaseReceiptProductVO {
  product_id: number;
  ordered_quantity: number;
  received_quantity: number;
  unit_price: number;
  remark?: string;
}
