// 销售设置状态枚举
export enum SalesetStatus {
  ACTIVE = 'ACTIVE', // 启用
  INACTIVE = 'INACTIVE', // 禁用
}

// 查询参数
export interface SettingSalesetQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  status?: SalesetStatus;
  merchant_id?: number;
}

// 分页响应
export interface SettingSalesetPageModel {
  id: number;
  setting_name: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  status: SalesetStatus;
  description: string;
  group_name: string;
  sort_order: number;
  creator_name: string;
  create_time: string;
}

// 创建参数
export interface SettingSalesetCreateVO {
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
export interface SettingSalesetModifyVO {
  saleset_id: number;
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
export interface SettingSalesetRemoveVO {
  saleset_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface SettingSalesetDetailModel {
  id: number;
  setting_name: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  status: SalesetStatus;
  description: string;
  group_name: string;
  sort_order: number;
  creator_name: string;
  create_time: string;
}

// 销售设置组
export interface SalesetGroup {
  group_name: string;
  group_title: string;
  settings: SettingSalesetDetailModel[];
}

// 产品设置
export interface ProductSettings {
  use_product_specification_settings: boolean;
  product_specification_prompt: string;
}

// 销售设置
export interface SalesSettings {
  is_less_zero_prohibited: boolean;
  when_prohibited_to_sell_it: string;
  is_price_modify_support: boolean;
  temporary_change_price_prompt: string;
  is_discount_support: boolean;
  discount_support_prompt: string;
  is_coupon_support: boolean;
  coupon_support_prompt: string;
  is_member_price_support: boolean;
  member_price_support_prompt: string;
  is_bulk_price_support: boolean;
  bulk_price_support_prompt: string;
  is_promotion_support: boolean;
  promotion_support_prompt: string;
}

// 收银设置
export interface CashierSettings {
  is_auto_print_receipt: boolean;
  auto_print_receipt_prompt: string;
  is_auto_print_label: boolean;
  auto_print_label_prompt: string;
  is_auto_calculate_tax: boolean;
  auto_calculate_tax_prompt: string;
  is_auto_round_amount: boolean;
  auto_round_amount_prompt: string;
  is_auto_save_customer: boolean;
  auto_save_customer_prompt: string;
  is_auto_save_transaction: boolean;
  auto_save_transaction_prompt: string;
}

// 库存设置
export interface InventorySettings {
  is_auto_deduct_inventory: boolean;
  auto_deduct_inventory_prompt: string;
  is_auto_update_cost: boolean;
  auto_update_cost_prompt: string;
  is_auto_update_price: boolean;
  auto_update_price_prompt: string;
  is_auto_update_spec: boolean;
  auto_update_spec_prompt: string;
  is_auto_update_category: boolean;
  auto_update_category_prompt: string;
  is_auto_update_brand: boolean;
  auto_update_brand_prompt: string;
}
