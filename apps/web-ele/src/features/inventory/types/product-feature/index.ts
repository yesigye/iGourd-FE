// 商品自定义属性相关类型定义

// 属性类型枚举
export enum FeatureType {
  SELECT = 'SELECT',
  INPUT = 'INPUT'
}

// 自定义属性查询参数
export interface ProductFeatureParams {
  page_num: number;
  page_size: number;
  merchant_id?: string;
  type?: FeatureType;
  entity?: string;
  is_compulsory?: boolean;
  is_fixed_option?: boolean;
  name?: string;
  keywords?: string;
}

// 自定义属性项
export interface ProductFeatureItem {
  id: string;
  name: string;
  type: FeatureType;
  is_fixed_option: boolean;
  is_compulsory: boolean;
  creator_name: string;
  create_time: string;
  merchant_id?: string;
  entity?: string;
}

// 自定义属性列表响应
export interface ProductFeatureListResponse {
  list: ProductFeatureItem[];
  total: number;
  page_num: number;
  page_size: number;
}

// 删除参数
export interface DeleteFeatureParams {
  dynamic_column_id_list: string[];
  merchant_id: string;
}
