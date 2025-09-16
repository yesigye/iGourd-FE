// 系统设置相关类型定义

export interface SystemConfigurationParams {
  id?: number;
  merchant_id: number;
  hold_order_ttl_mins: string | number;
  is_less_zero_prohibited: boolean;
  is_auto_remove_invalid_orders: boolean;
  daily_settlement_time: string;
  is_price_modify_support: boolean;
  use_product_specification_settings: boolean;
  revenue_auto_approve_amount_limit: number;
  expenditure_auto_approve_amount_limit: number;
}

export interface SystemConfigurationResponse {
  id: number;
  merchant_id: number;
  hold_order_ttl_mins: string | number;
  is_less_zero_prohibited: boolean;
  is_auto_remove_invalid_orders: boolean;
  daily_settlement_time: string;
  is_price_modify_support: boolean;
  use_product_specification_settings: boolean;
  revenue_auto_approve_amount_limit: number;
  expenditure_auto_approve_amount_limit: number;
  create_time: string;
  update_time: string;
}

export interface QuickTagItem {
  id: number;
  merchant_id: number;
  tag_name: string;
  tag_color: string;
  create_time: string;
  update_time: string;
}

export interface QuickTagParams {
  merchant_id: number;
  tag_name: string;
  tag_color?: string;
}

export interface QuickTagUpdateParams {
  id: number;
  merchant_id: number;
  tag_name: string;
  tag_color?: string;
}

export interface QuickTagDeleteParams {
  id: number;
  merchant_id: number;
}

export interface SystemSettings {
  product_settings: {
    use_product_specification_settings: boolean;
  };
  sales_settings: {
    is_less_zero_prohibited: boolean;
    is_price_modify_support: boolean;
    is_auto_remove_invalid_orders: boolean;
  };
  order_settings: {
    hold_order_ttl_mins: number;
    quick_tags: QuickTagItem[];
  };
  time_settings: {
    daily_settlement_time: string;
  };
  approval_settings: {
    revenue_auto_approve_amount_limit: number;
    expenditure_auto_approve_amount_limit: number;
  };
}
