// 客户特征类型枚举
export enum FeatureType {
  TEXT = 'TEXT', // 文本
  NUMBER = 'NUMBER', // 数字
  DATE = 'DATE', // 日期
  SELECT = 'SELECT', // 选择
  MULTI_SELECT = 'MULTI_SELECT', // 多选
  BOOLEAN = 'BOOLEAN', // 布尔值
  OTHER = 'OTHER', // 其他
}

// 查询参数
export interface CustomerFeatureQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  feature_type?: FeatureType;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
}

// 分页响应
export interface CustomerFeaturePageModel {
  id: number;
  feature_name: string;
  feature_code: string;
  feature_type: FeatureType;
  is_required: boolean;
  is_searchable: boolean;
  sort_order: number;
  status: string;
  description?: string;
  creator_name: string;
  create_time: string;
}

// 创建参数
export interface CustomerFeatureCreateVO {
  feature_name: string;
  feature_code: string;
  feature_type: FeatureType;
  is_required: boolean;
  is_searchable: boolean;
  sort_order: number;
  description?: string;
  options?: FeatureOption[];
  merchant_id?: number;
}

// 修改参数
export interface CustomerFeatureModifyVO {
  feature_id: number;
  feature_name?: string;
  feature_code?: string;
  feature_type?: FeatureType;
  is_required?: boolean;
  is_searchable?: boolean;
  sort_order?: number;
  description?: string;
  options?: FeatureOption[];
  merchant_id?: number;
}

// 删除参数
export interface CustomerFeatureRemoveVO {
  feature_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface CustomerFeatureDetailModel {
  id: number;
  feature_name: string;
  feature_code: string;
  feature_type: FeatureType;
  is_required: boolean;
  is_searchable: boolean;
  sort_order: number;
  status: string;
  description?: string;
  options?: FeatureOption[];
  creator_name: string;
  create_time: string;
}

// 特征选项
export interface FeatureOption {
  id?: number;
  option_label: string;
  option_value: string;
  sort_order: number;
}
