// SKU列表相关类型定义

export interface SkuListItem {
  id: number;
  major_name: string;
  sku_barcode: string;
  profile_photo?: string;
  status: 'ON_SALE' | 'OFF_SALE';
  is_basic: boolean;
  selling_price?: number;
  cost_price?: number;
  stock_quantity?: number;
  product_code?: string;
  spec_info?: string;
  creator_name: string;
  create_time: string;
  merchant_id?: number;
}

export interface SkuListParams {
  page_num: number;
  page_size: number;
  merchant_id: number;
  keywords?: string;
  status?: string;
  product_code?: string;
  sku_barcode?: string;
}

export interface SkuListResponse {
  list: SkuListItem[];
  total: number;
  page_num: number;
  page_size: number;
}

export interface DeleteCheckResult {
  remove_check_enum: string | null;
  message?: string;
}

export interface SkuStatus {
  ON_SALE: string;
  OFF_SALE: string;
}

export interface SkuFormData {
  id?: number;
  major_name: string;
  sku_barcode: string;
  profile_photo?: string;
  status: 'ON_SALE' | 'OFF_SALE';
  selling_price?: number;
  cost_price?: number;
  product_code?: string;
  spec_info?: string;
  merchant_id: number;
}
