// 退货单状态枚举
export enum ReturnedStatus {
  DRAFT = 'DRAFT', // 草稿
  PENDING = 'PENDING', // 待审核
  APPROVED = 'APPROVED', // 已审核
  RETURNED = 'RETURNED', // 已退货
  CANCELLED = 'CANCELLED', // 已取消
}

// 退货类型枚举
export enum ReturnedType {
  QUALITY_ISSUE = 'QUALITY_ISSUE', // 质量问题
  DAMAGED = 'DAMAGED', // 损坏
  WRONG_ITEM = 'WRONG_ITEM', // 发错货
  EXCESS_STOCK = 'EXCESS_STOCK', // 库存过多
  OTHER = 'OTHER', // 其他
}

// 查询参数
export interface PurchaseReturnedQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  status?: ReturnedStatus;
  returned_type?: ReturnedType;
  supplier_id?: number;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
}

// 分页响应
export interface PurchaseReturnedPageModel {
  id: number;
  returned_no: string;
  supplier_name: string;
  returned_type: ReturnedType;
  status: ReturnedStatus;
  total_amount: number;
  returned_date: string;
  reason: string;
  remark?: string;
  creator_name: string;
  create_time: string;
}

// 创建参数
export interface PurchaseReturnedCreateVO {
  supplier_id: number;
  returned_type: ReturnedType;
  returned_date: string;
  reason: string;
  remark?: string;
  products: PurchaseReturnedProductVO[];
  merchant_id?: number;
}

// 修改参数
export interface PurchaseReturnedModifyVO {
  returned_id: number;
  supplier_id?: number;
  returned_type?: ReturnedType;
  returned_date?: string;
  reason?: string;
  remark?: string;
  products?: PurchaseReturnedProductVO[];
  merchant_id?: number;
}

// 删除参数
export interface PurchaseReturnedRemoveVO {
  returned_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface PurchaseReturnedDetailModel {
  id: number;
  returned_no: string;
  supplier_id: number;
  supplier_name: string;
  returned_type: ReturnedType;
  status: ReturnedStatus;
  total_amount: number;
  returned_date: string;
  reason: string;
  remark?: string;
  creator_name: string;
  create_time: string;
  products: PurchaseReturnedProductModel[];
}

// 退货产品模型
export interface PurchaseReturnedProductModel {
  id: number;
  product_id: number;
  product_name: string;
  product_code: string;
  sku_code: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  unit_name: string;
  returned_reason: string;
  remark?: string;
}

// 退货产品创建参数
export interface PurchaseReturnedProductVO {
  product_id: number;
  quantity: number;
  unit_price: number;
  returned_reason: string;
  remark?: string;
}
