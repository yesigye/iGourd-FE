// 支付方式相关类型定义

export interface PaymentMethodItem {
  id: number;
  payment_method_mark: string;
  payment_method_name: string;
  sort: number;
  is_default: boolean;
  isDraggable?: boolean;
  scenes: PaymentScene[];
}

export interface PaymentScene {
  payment_scene_type: string;
  is_enabled: boolean;
}

export interface PaymentMethodMarkItem {
  mark: string;
  name: string;
  is_default: boolean;
  scenes: string[];
}

export interface PaymentMethodParams {
  merchant_id: number;
}

export interface PaymentMethodCreateParams {
  merchant_id: number;
  payment_method_mark: string;
  sort: number;
}

export interface PaymentMethodDeleteParams {
  merchant_id: number;
  payment_method_mark: string;
}

export interface PaymentMethodEditParams {
  merchant_id: number;
  payment_method_mark: string;
  payment_method_operate: Record<string, boolean>;
}

export interface PaymentMethodSortParams {
  merchant_id: number;
  payment_method_sort_map: Record<string, number>;
}

export type PaymentSceneType = 'PURCHASE' | 'RECHARGE' | 'RETAIL_SALES' | 'WHOLESALE_SALES' | 'RESTAURANT_SALES';

export interface PaymentMethodConfig {
  max_payment_methods: number;
  default_payment_methods: string[];
  available_scenes: PaymentSceneType[];
}