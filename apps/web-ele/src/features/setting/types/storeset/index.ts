// 店铺设置状态枚举
export enum StoresetStatus {
  ACTIVE = 'ACTIVE', // 启用
  INACTIVE = 'INACTIVE', // 禁用
}

// 查询参数
export interface SettingStoresetQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  status?: StoresetStatus;
  merchant_id?: number;
}

// 分页响应
export interface SettingStoresetPageModel {
  id: number;
  setting_name: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  status: StoresetStatus;
  description: string;
  group_name: string;
  sort_order: number;
  creator_name: string;
  create_time: string;
}

// 创建参数
export interface SettingStoresetCreateVO {
  setting_name: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description: string;
  group_name: string;
  sort_order: number;
  merchant_id?: number;
}

// 修改参数
export interface SettingStoresetModifyVO {
  storeset_id: number;
  setting_name?: string;
  setting_key?: string;
  setting_value?: string;
  setting_type?: string;
  description?: string;
  group_name?: string;
  sort_order?: number;
  merchant_id?: number;
}

// 删除参数
export interface SettingStoresetRemoveVO {
  storeset_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface SettingStoresetDetailModel {
  id: number;
  setting_name: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  status: StoresetStatus;
  description: string;
  group_name: string;
  sort_order: number;
  creator_name: string;
  create_time: string;
}

// 店铺基本信息
export interface StoreBasicInfo {
  package_name: string;
  merchant_business_type: string;
  package_start_time: string;
  package_expiration_time: string;
  create_time: string;
  store_name: string;
  store_code: string;
  store_type: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  logo_url: string;
  banner_url: string;
  business_hours: string;
  timezone: string;
  currency: string;
  language: string;
  tax_rate: number;
  shipping_fee: number;
  free_shipping_threshold: number;
  return_policy: string;
  refund_policy: string;
  privacy_policy: string;
  terms_of_service: string;
}
