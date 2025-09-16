// 库存调拨相关类型定义

export interface TransferItem {
  id: number;
  stock_transfer_no: string;
  transfer_date: string;
  transfer_type: 'TRANSFER_SAME_STORE' | 'TRANSFER_DIFFERENT_STORE' | 'TRANSFER_IN_ONLY' | 'TRANSFER_OUT_ONLY';
  total_transfer_quantity: number;
  source_warehouse_name: string;
  destination_warehouse_name: string;
  source_merchant_id: number;
  destination_merchant_id: number;
  status: 'CREATED' | 'OUTBOUND' | 'INBOUND' | 'REFUSED_OUTBOUND' | 'REFUSED_INBOUND';
  review_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  destination_status: 'CREATED' | 'OUTBOUND' | 'INBOUND' | 'REFUSED_OUTBOUND' | 'REFUSED_INBOUND';
  destination_review_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  receipt_percentage?: number;
  creator_name: string;
  create_time: string;
  merchant_id: number;
  stock_transfer_item_model_list?: TransferItemDetail[];
  pre_status?: string;
  pre_destination_status?: string;
}

export interface TransferItemDetail {
  id: number;
  product_id: number;
  product_name: string;
  product_code: string;
  transfer_quantity: number;
  transfer_in_quantity: number;
  basic_unit_radio: number;
  major_unit_name: string;
  product_cost_price: number;
  total_price?: number;
  current_quantity?: number;
  stock_quantity: number;
  main_transfer_quantity?: string;
}

export interface TransferParams {
  page_num: number;
  page_size: number;
  merchant_id: number;
  keywords?: string;
  destination_warehouse_id?: string;
  source_warehouse_id?: string;
  stock_transfer_no?: string;
  transfer_date?: string;
  transfer_type?: string;
  status?: string;
  review_status?: string;
}

export interface TransferResponse {
  list: TransferItem[];
  total: number;
  page_num: number;
  page_size: number;
}

export interface TransferDetailParams {
  stock_transfer_id: number;
  merchant_id: number;
}

export interface TransferDetailResponse {
  id: number;
  stock_transfer_no: string;
  transfer_date: string;
  transfer_type: string;
  source_warehouse_name: string;
  destination_warehouse_name: string;
  source_merchant_id: number;
  destination_merchant_id: number;
  source_merchant_name?: string;
  destination_merchant_name?: string;
  status: string;
  review_status: string;
  destination_status: string;
  destination_review_status: string;
  creator_name: string;
  create_time: string;
  remark?: string;
  stock_transfer_item_model_list: TransferItemDetail[];
}

export interface TransferFormData {
  id?: number;
  transfer_date: string;
  transfer_type: string;
  source_warehouse_id: number;
  destination_warehouse_id: number;
  source_merchant_id?: number;
  destination_merchant_id?: number;
  remark?: string;
  stock_transfer_item_list: {
    product_id: number;
    transfer_quantity: number;
  }[];
  merchant_id: number;
}

export interface TransferStatus {
  CREATED: string;
  OUTBOUND: string;
  INBOUND: string;
  REFUSED_OUTBOUND: string;
  REFUSED_INBOUND: string;
}

export interface TransferType {
  TRANSFER_SAME_STORE: string;
  TRANSFER_DIFFERENT_STORE: string;
  TRANSFER_IN_ONLY: string;
  TRANSFER_OUT_ONLY: string;
}

export interface ReviewStatus {
  PENDING: string;
  APPROVED: string;
  REJECTED: string;
}

export interface TransferStatusOption {
  value: string;
  label: string;
  key: string;
  disabled?: boolean;
}

export interface AuditParams {
  id: number;
  merchant_id: number;
  review_status: 'APPROVED' | 'REJECTED';
  review_opinion?: string;
  handler_type: string;
}
