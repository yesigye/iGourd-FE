// 积分类型枚举
export enum IntegralType {
  EARN = 'EARN', // 获得积分
  SPEND = 'SPEND', // 消费积分
  EXPIRE = 'EXPIRE', // 积分过期
  ADJUST = 'ADJUST', // 积分调整
  REFUND = 'REFUND', // 积分退还
}

// 积分状态枚举
export enum IntegralStatus {
  ACTIVE = 'ACTIVE', // 有效
  EXPIRED = 'EXPIRED', // 已过期
  USED = 'USED', // 已使用
  CANCELLED = 'CANCELLED', // 已取消
}

// 查询参数
export interface CustomerIntegralQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  integral_type?: IntegralType;
  status?: IntegralStatus;
  customer_id?: number;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
}

// 分页响应
export interface CustomerIntegralPageModel {
  id: number;
  customer_name: string;
  integral_type: IntegralType;
  points: number;
  status: IntegralStatus;
  description: string;
  earn_date: string;
  expire_date?: string;
  creator_name: string;
  create_time: string;
}

// 创建参数
export interface CustomerIntegralCreateVO {
  customer_id: number;
  integral_type: IntegralType;
  points: number;
  description: string;
  earn_date: string;
  expire_date?: string;
  merchant_id?: number;
}

// 修改参数
export interface CustomerIntegralModifyVO {
  integral_id: number;
  customer_id?: number;
  integral_type?: IntegralType;
  points?: number;
  description?: string;
  earn_date?: string;
  expire_date?: string;
  merchant_id?: number;
}

// 删除参数
export interface CustomerIntegralRemoveVO {
  integral_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface CustomerIntegralDetailModel {
  id: number;
  customer_id: number;
  customer_name: string;
  integral_type: IntegralType;
  points: number;
  status: IntegralStatus;
  description: string;
  earn_date: string;
  expire_date?: string;
  creator_name: string;
  create_time: string;
}

// 积分设置
export interface CustomerIntegralSettingVO {
  initial_points: number;
  exchange_rate: number;
  expire_days: number;
  is_enabled: boolean;
  merchant_id?: number;
}
