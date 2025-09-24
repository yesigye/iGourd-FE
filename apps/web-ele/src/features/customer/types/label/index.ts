// 标签类型枚举
export enum LabelType {
  CATEGORY = 'CATEGORY', // 分类标签
  STATUS = 'STATUS', // 状态标签
  LEVEL = 'LEVEL', // 等级标签
  BEHAVIOR = 'BEHAVIOR', // 行为标签
  PREFERENCE = 'PREFERENCE', // 偏好标签
  OTHER = 'OTHER', // 其他
}

// 标签颜色枚举
export enum LabelColor {
  RED = 'RED',
  ORANGE = 'ORANGE',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  PURPLE = 'PURPLE',
  PINK = 'PINK',
  GRAY = 'GRAY',
}

// 查询参数
export interface CustomerLabelQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  label_type?: LabelType;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
}

// 分页响应
export interface CustomerLabelPageModel {
  id: number;
  label_name: string;
  label_code: string;
  label_type: LabelType;
  color: LabelColor;
  sort_order: number;
  customer_count: number;
  status: string;
  description?: string;
  creator_name: string;
  create_time: string;
}

// 创建参数
export interface CustomerLabelCreateVO {
  label_name: string;
  label_code: string;
  label_type: LabelType;
  color: LabelColor;
  sort_order: number;
  description?: string;
  merchant_id?: number;
}

// 修改参数
export interface CustomerLabelModifyVO {
  label_id: number;
  label_name?: string;
  label_code?: string;
  label_type?: LabelType;
  color?: LabelColor;
  sort_order?: number;
  description?: string;
  merchant_id?: number;
}

// 删除参数
export interface CustomerLabelRemoveVO {
  label_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface CustomerLabelDetailModel {
  id: number;
  label_name: string;
  label_code: string;
  label_type: LabelType;
  color: LabelColor;
  sort_order: number;
  customer_count: number;
  status: string;
  description?: string;
  creator_name: string;
  create_time: string;
}
export interface CustomerLabelInfoModel {
  list: CustomerLabelDetailModel[];
  page_num: number;
  page_size: number;
  total: number;
};
