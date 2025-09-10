export interface CustomerInfo {
  id: string;
  name: string;
  salesman_name: string;
  contact_name: string;
  phone_number: string;
  balance: number;
  points: number;
  debt_amount: number;
  vip_code: string;
  vip_level: string;
  vip_points_multiple: number;
  vip_discount_percentage: number;
  vip_rights_expiration_date: string;
  vip_other_rights: string;
  vip_begin_time: string;
  label_id_list: string[];
  address: string;
  last_order_date: string;
  remark: string;
  creator_name: string;
  create_time: string;
}

export interface CustomerInfoPageQueryParams {
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface CustomerLabelPageModel {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface BackendListResponse<T> {
  data: T[];
  total: number;
  page_num: number;
  page_size: number;
}

export interface BackendResponseRaw<T> {
  code: string;
  message: string;
  data: T;
}
