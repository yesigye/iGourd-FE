// 客户权益类型枚举
export enum EquityType {
  VIP_LEVEL = 'VIP_LEVEL', // VIP等级
  DISCOUNT = 'DISCOUNT', // 折扣
  POINT = 'POINT', // 积分
  CASHBACK = 'CASHBACK', // 返现
  GIFT = 'GIFT', // 礼品
  OTHER = 'OTHER', // 其他
}

// 查询参数
export interface CustomerEquityQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  equity_type?: EquityType;
  customer_id?: number;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
}

// 分页响应
export interface CustomerEquityPageModel {
  id: number;
  customer_name: string;
  equity_type: EquityType;
  equity_value: number;
  equity_unit: string;
  description: string;
  granted_date: string;
  expiry_date?: string;
  status: string;
  creator_name: string;
  create_time: string;
}

// 创建参数
export interface CustomerEquityCreateVO {
  customer_id: number;
  equity_type: EquityType;
  equity_value: number;
  equity_unit: string;
  description: string;
  granted_date: string;
  expiry_date?: string;
  merchant_id?: number;
}

// 修改参数
export interface CustomerEquityModifyVO {
  equity_id: number;
  customer_id?: number;
  equity_type?: EquityType;
  equity_value?: number;
  equity_unit?: string;
  description?: string;
  granted_date?: string;
  expiry_date?: string;
  merchant_id?: number;
}

// 删除参数
export interface CustomerEquityRemoveVO {
  equity_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface CustomerEquityDetailModel {
  id: number;
  customer_id: number;
  customer_name: string;
  equity_type: EquityType;
  equity_value: number;
  equity_unit: string;
  description: string;
  granted_date: string;
  expiry_date?: string;
  status: string;
  creator_name: string;
  create_time: string;
}

// 客户权益设置
export interface CustomerEquitySettingVO {
  default_vip_level: number;
  maximum_vip_level: number;
  vip_level_names: Record<number, string>;
  equity_rules: EquityRule[];
  merchant_id?: number;
}

// 权益规则
export interface EquityRule {
  equity_type: EquityType;
  conditions: EquityCondition[];
  rewards: EquityReward[];
}

// 权益条件
export interface EquityCondition {
  type: string; // 消费金额、消费次数等
  operator: string; // >=, <=, =, >
  value: number;
}

// 权益奖励
export interface EquityReward {
  type: string; // 折扣、积分、返现等
  value: number;
  unit: string; // %, 分, 元等
}