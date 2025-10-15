// 退款订单状态枚举
export enum RefundOrderStatus {
  CANCELLED = 'CANCELLED', // 已取消
  COMPLETED = 'COMPLETED', // 已完成
  PENDING = 'PENDING', // 待处理
  PROCESSING = 'PROCESSING', // 处理中
  REJECTED = 'REJECTED', // 已拒绝
}

// 退款方式枚举
export enum RefundMethod {
  CARD = 'CARD', // 刷卡退款
  CASH = 'CASH', // 现金退款
  CREDIT = 'CREDIT', // 信用退款
  TRANSFER = 'TRANSFER', // 转账退款
}

// 查询参数
export interface SaleRefundOrderQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  status?: RefundOrderStatus;
  refund_method?: RefundMethod;
  customer_id?: number;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
}

// 分页响应
export interface SaleRefundOrderPageModel {
  id: number;
  refund_order_no: string;
  original_order_no: string;
  customer_name: string;
  staff_name: string;
  refund_amount: number;
  refund_method: RefundMethod;
  status: RefundOrderStatus;
  refund_reason: string;
  refund_date: string;
  remark?: string;
  creator_name: string;
  create_time: string;
}

// 创建参数
export interface SaleRefundOrderCreateVO {
  original_order_id: number;
  customer_id: number;
  staff_id: number;
  refund_amount: number;
  refund_method: RefundMethod;
  refund_reason: string;
  refund_date: string;
  remark?: string;
  products: RefundOrderProductVO[];
  merchant_id?: number;
}

// 修改参数
export interface SaleRefundOrderModifyVO {
  refund_order_id: number;
  customer_id?: number;
  staff_id?: number;
  refund_amount?: number;
  refund_method?: RefundMethod;
  refund_reason?: string;
  refund_date?: string;
  remark?: string;
  products?: RefundOrderProductVO[];
  merchant_id?: number;
}

// 删除参数
export interface SaleRefundOrderRemoveVO {
  refund_order_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface SaleRefundOrderDetailModel {
  id: number;
  refund_order_no: string;
  original_order_id: number;
  original_order_no: string;
  customer_id: number;
  customer_name: string;
  staff_id: number;
  staff_name: string;
  refund_amount: number;
  refund_method: RefundMethod;
  status: RefundOrderStatus;
  refund_reason: string;
  refund_date: string;
  remark?: string;
  products: RefundOrderProductModel[];
  creator_name: string;
  create_time: string;
}

// 退款订单产品模型
export interface RefundOrderProductModel {
  id: number;
  product_id: number;
  product_name: string;
  product_code: string;
  sku_code: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  unit_name: string;
  remark?: string;
}

// 退款订单产品创建参数
export interface RefundOrderProductVO {
  product_id: number;
  quantity: number;
  unit_price: number;
  remark?: string;
}
export interface RefundOrderDetail {
  code: string;
  current_debit_amount: number;
  current_credit_amount: number;
}
