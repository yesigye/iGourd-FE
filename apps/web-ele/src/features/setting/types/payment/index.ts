// 支付方式状态枚举
export enum PaymentStatus {
  ACTIVE = 'ACTIVE', // 启用
  INACTIVE = 'INACTIVE', // 禁用
  TESTING = 'TESTING', // 测试中
  ERROR = 'ERROR', // 错误
}

// 支付方式类型枚举
export enum PaymentType {
  ALIPAY = 'ALIPAY', // 支付宝
  WECHAT = 'WECHAT', // 微信支付
  UNIONPAY = 'UNIONPAY', // 银联
  CASH = 'CASH', // 现金
  CARD = 'CARD', // 刷卡
  OTHER = 'OTHER', // 其他
}

// 支付场景枚举
export enum PaymentScene {
  POS = 'POS', // 收银台
  ONLINE = 'ONLINE', // 线上
  MOBILE = 'MOBILE', // 移动端
  ALL = 'ALL', // 全部
}

// 查询参数
export interface SettingPaymentQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  status?: PaymentStatus;
  payment_type?: PaymentType;
  scene?: PaymentScene;
  merchant_id?: number;
}

// 分页响应
export interface SettingPaymentPageModel {
  id: number;
  payment_method_name: string;
  payment_type: PaymentType;
  status: PaymentStatus;
  scenes: PaymentScene[];
  icon_url: string;
  sort_order: number;
  fee_rate: number;
  min_amount: number;
  max_amount: number;
  daily_limit: number;
  monthly_limit: number;
  config: Record<string, any>;
  remark?: string;
  creator_name: string;
  create_time: string;
}

// 创建参数
export interface SettingPaymentCreateVO {
  payment_method_name: string;
  payment_type: PaymentType;
  scenes: PaymentScene[];
  icon_url: string;
  fee_rate: number;
  min_amount: number;
  max_amount: number;
  daily_limit: number;
  monthly_limit: number;
  config: Record<string, any>;
  remark?: string;
  merchant_id?: number;
}

// 修改参数
export interface SettingPaymentModifyVO {
  payment_id: number;
  payment_method_name?: string;
  payment_type?: PaymentType;
  scenes?: PaymentScene[];
  icon_url?: string;
  fee_rate?: number;
  min_amount?: number;
  max_amount?: number;
  daily_limit?: number;
  monthly_limit?: number;
  config?: Record<string, any>;
  remark?: string;
  merchant_id?: number;
}

// 删除参数
export interface SettingPaymentRemoveVO {
  payment_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface SettingPaymentDetailModel {
  id: number;
  payment_method_name: string;
  payment_type: PaymentType;
  status: PaymentStatus;
  scenes: PaymentScene[];
  icon_url: string;
  sort_order: number;
  fee_rate: number;
  min_amount: number;
  max_amount: number;
  daily_limit: number;
  monthly_limit: number;
  config: Record<string, any>;
  remark?: string;
  creator_name: string;
  create_time: string;
}
