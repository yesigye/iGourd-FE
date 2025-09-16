// 销售录入状态枚举
export enum SaleEnterStatus {
  DRAFT = 'DRAFT', // 草稿
  CONFIRMED = 'CONFIRMED', // 已确认
  PROCESSING = 'PROCESSING', // 处理中
  COMPLETED = 'COMPLETED', // 已完成
  CANCELLED = 'CANCELLED', // 已取消
}

// 查询参数
export interface SaleEnterQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  status?: SaleEnterStatus;
  staff_id?: number;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
}

// 分页响应
export interface SaleEnterPageModel {
  id: number;
  enter_no: string;
  staff_name: string;
  customer_name: string;
  total_amount: number;
  paid_amount: number;
  status: SaleEnterStatus;
  enter_date: string;
  remark?: string;
  creator_name: string;
  create_time: string;
}

// 创建参数
export interface SaleEnterCreateVO {
  staff_id: number;
  customer_id?: number;
  total_amount: number;
  paid_amount: number;
  enter_date: string;
  remark?: string;
  products: SaleEnterProductVO[];
  merchant_id?: number;
}

// 修改参数
export interface SaleEnterModifyVO {
  enter_id: number;
  staff_id?: number;
  customer_id?: number;
  total_amount?: number;
  paid_amount?: number;
  enter_date?: string;
  remark?: string;
  products?: SaleEnterProductVO[];
  merchant_id?: number;
}

// 删除参数
export interface SaleEnterRemoveVO {
  enter_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface SaleEnterDetailModel {
  id: number;
  enter_no: string;
  staff_id: number;
  staff_name: string;
  customer_id?: number;
  customer_name?: string;
  total_amount: number;
  paid_amount: number;
  status: SaleEnterStatus;
  enter_date: string;
  remark?: string;
  products: SaleEnterProductModel[];
  creator_name: string;
  create_time: string;
}

// 销售录入产品模型
export interface SaleEnterProductModel {
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

// 销售录入产品创建参数
export interface SaleEnterProductVO {
  product_id: number;
  quantity: number;
  unit_price: number;
  remark?: string;
}
