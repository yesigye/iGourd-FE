// 库存损耗相关类型定义

export interface SpoilageItem {
  id: number;
  stock_consumption_no: string;
  consumption_date: string;
  total_spoilage_quantity: number;
  warehouse_name: string;
  consumption_reason: 'EXPIRED' | 'DAMAGED' | 'LOST' | 'OTHER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  creator_name: string;
  create_time: string;
  merchant_id: number;
  stock_consumption_item_detail_model_list?: SpoilageItemDetail[];
}

export interface SpoilageItemDetail {
  id: number;
  product_id: number;
  product_name: string;
  product_code: string;
  consumption_quantity: number;
  product_cost_price: number;
  total_price?: number;
  current_quantity?: number;
  stock_quantity: number;
}

export interface SpoilageParams {
  page_num: number;
  page_size: number;
  merchant_id: number;
  keywords?: string;
  consumption_date?: string;
  consumption_reason?: string;
  stock_consumption_no?: string;
  status?: string;
}

export interface SpoilageResponse {
  list: SpoilageItem[];
  total: number;
  page_num: number;
  page_size: number;
}

export interface SpoilageDetailParams {
  stock_consumption_id: number;
  merchant_id: number;
}

export interface SpoilageDetailResponse {
  id: number;
  stock_consumption_no: string;
  consumption_date: string;
  warehouse_name: string;
  consumption_reason: string;
  status: string;
  creator_name: string;
  create_time: string;
  remark?: string;
  stock_consumption_item_list: SpoilageItemDetail[];
}

export interface SpoilageFormData {
  id?: number;
  consumption_date: string;
  consumption_reason: string;
  warehouse_id: number;
  remark?: string;
  stock_consumption_item_list: {
    product_id: number;
    consumption_quantity: number;
  }[];
  merchant_id: number;
}

export interface SpoilageStatus {
  PENDING: string;
  APPROVED: string;
  REJECTED: string;
}

export interface SpoilageReason {
  EXPIRED: string;
  DAMAGED: string;
  LOST: string;
  OTHER: string;
}

export interface AuditParams {
  id: number;
  merchant_id: number;
  review_status: 'APPROVED' | 'REJECTED';
  review_opinion?: string;
}
