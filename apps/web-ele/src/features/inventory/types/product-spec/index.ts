// 商品规格相关类型定义

export interface ProductSpecItem {
  id: number;
  product_spec_name: string;
  product_spec_code: string;
  source_type: 'SYSTEM' | 'CUSTOM';
  status: 'OPEN' | 'CLOSED';
  creator_name: string;
  create_time: string;
  merchant_id?: number;
}

export interface ProductSpecValueItem {
  id: number;
  product_spec_id: number;
  product_spec_name: string;
  spec_value: string;
  spec_value_code: string;
  source_type: 'SYSTEM' | 'CUSTOM';
  status: 'OPEN' | 'CLOSED';
  creator_name: string;
  create_time: string;
  merchant_id?: number;
}

export interface ProductSpecParams {
  page_num: number;
  page_size: number;
  merchant_id: number;
  keywords?: string;
  product_spec_name?: string;
}

export interface ProductSpecValueParams {
  page_num: number;
  page_size: number;
  merchant_id: number;
  product_spec_id: number;
  keywords?: string;
  keyword?: string;
}

export interface ProductSpecResponse {
  list: ProductSpecItem[];
  total: number;
  page_num: number;
  page_size: number;
}

export interface ProductSpecValueResponse {
  list: ProductSpecValueItem[];
  total: number;
  page_num: number;
  page_size: number;
}

export interface ProductSpecTreeItem {
  id: string | number;
  label: string;
  isRoot: boolean;
  children?: ProductSpecTreeItem[];
}

export interface SpecStatus {
  OPEN: string;
  CLOSED: string;
}

export interface SourceType {
  SYSTEM: string;
  CUSTOM: string;
}
