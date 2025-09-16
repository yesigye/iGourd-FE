// 单位管理相关类型定义

export interface UnitItem {
  id: number;
  unit_name: string;
  unit_code: string;
  unit_symbol: string;
  is_basic_unit: boolean;
  conversion_ratio: number;
  basic_unit_id?: number;
  basic_unit_name?: string;
  status: 'ACTIVE' | 'FROZEN' | 'INIT';
  source_type: 'SYSTEM' | 'CUSTOM';
  creator_name: string;
  create_time: string;
  merchant_id: number;
  remark?: string;
  sort_order?: number;
}

export interface UnitParams {
  page_num: number;
  page_size: number;
  merchant_id: number;
  keywords?: string;
  status?: string;
  source_type?: string;
  is_basic_unit?: boolean;
}

export interface UnitResponse {
  list: UnitItem[];
  total: number;
  page_num: number;
  page_size: number;
}

export interface UnitFormData {
  id?: number;
  unit_name: string;
  unit_code: string;
  unit_symbol: string;
  is_basic_unit: boolean;
  conversion_ratio?: number;
  basic_unit_id?: number;
  status: 'ACTIVE' | 'FROZEN';
  remark?: string;
  sort_order?: number;
  merchant_id: number;
}

export interface UnitStatus {
  ACTIVE: string;
  FROZEN: string;
  INIT: string;
}

export interface UnitSourceType {
  SYSTEM: string;
  CUSTOM: string;
}

export interface UnitUsageCheck {
  isUsed: boolean;
  usageCount: number;
  usageDetails?: {
    product_count: number;
    sku_count: number;
    transfer_count: number;
  };
}

export interface UnitConversion {
  from_unit_id: number;
  to_unit_id: number;
  conversion_ratio: number;
}

export interface UnitHierarchy {
  basic_unit: UnitItem;
  derived_units: UnitItem[];
}
