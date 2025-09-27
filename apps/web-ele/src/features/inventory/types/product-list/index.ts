// 商品列表相关类型定义

export interface ProductListItem {
  id: number;
  major_name: string;
  product_code: string;
  product_barcode?: string;
  profile_photo?: string;
  product_unit_names?: string;
  major_unit_name?: string;
  minor_name?: string;
  status: 'OFF_SALE' | 'ON_SALE';
  product_group_name?: string;
  product_label_list?: ProductLabel[];
  creator_name: string;
  create_time: string;
  selling_price?: number;
  cost_price?: number;
  stock_total_quantity?: number;
  merchant_id?: number;
}

export interface ProductLabel {
  id: number;
  name: string;
  color?: string;
}

export interface ProductListParams {
  page_num: number;
  page_size: number;
  keywords?: string;
  name?: string;
  status?: string;
  barcode?: string;
  code?: string;
  product_barcode?: string;
  product_code?: string;
  minor_name?: string;
  major_name?: string;
}

export interface ProductListResponse {
  list: ProductListItem[];
  total: number;
  page_num: number;
  page_size: number;
}

export interface ProductStatus {
  id: number;
  label: string;
  value: 'OFF_SALE' | 'ON_SALE';
}

export interface DeleteCheckResult {
  remove_check_enum: null | string;
  message?: string;
}

export interface ExportParams {
  ids: number[];
  tableHeaders: Map<string, string>;
  tableKey: string;
  fileName: string;
  conditionParams: any;
}
