// 订单状态枚举
export enum OrderStatus {
  DRAFT = 'DRAFT', // 草稿
  PENDING = 'PENDING', // 待审核
  APPROVED = 'APPROVED', // 已审核
  RECEIVED = 'RECEIVED', // 已收货
  SETTLED = 'SETTLED', // 已结算
  CANCELLED = 'CANCELLED', // 已取消
}

// 订单类型枚举
export enum OrderType {
  PURCHASE = 'PURCHASE', // 采购
  RETURN = 'RETURN', // 退货
}

// 查询参数
export interface PurchaseOrderQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  status?: OrderStatus;
  order_type?: OrderType;
  supplier_id?: number;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
}

// 分页响应
export interface PurchaseOrderPageModel {
  id: number;
  order_no: string;
  supplier_name: string;
  order_type: OrderType;
  status: OrderStatus;
  total_amount: number;
  paid_amount: number;
  order_date: string;
  delivery_date?: string;
  remark?: string;
  creator_name: string;
  create_time: string;
}

// 创建参数
export interface PurchaseOrderCreateVO {
  supplier_id: number;
  order_type: OrderType;
  order_date: string;
  delivery_date?: string;
  remark?: string;
  products: PurchaseOrderProductVO[];
  merchant_id?: number;
}

// 修改参数
export interface PurchaseOrderModifyVO {
  order_id: number;
  supplier_id?: number;
  order_date?: string;
  delivery_date?: string;
  remark?: string;
  products?: PurchaseOrderProductVO[];
  merchant_id?: number;
}

// 删除参数
export interface PurchaseOrderRemoveVO {
  order_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface PurchaseOrderDetailModel {
  id: number;
  order_no: string;
  supplier_id: number;
  supplier_name: string;
  order_type: OrderType;
  status: OrderStatus;
  total_amount: number;
  paid_amount: number;
  order_date: string;
  delivery_date?: string;
  remark?: string;
  creator_name: string;
  create_time: string;
  products: PurchaseOrderProductModel[];
}

// 订单产品模型
export interface PurchaseOrderProductModel {
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

// 订单产品创建参数
export interface PurchaseOrderProductVO {
  product_id: number;
  quantity: number;
  unit_price: number;
  remark?: string;
}
