export interface RootObject {
  actual_amount: number;
  attachment_url: string;
  business_type: string;
  currency_code: string;
  exchange_rate: number;
  merchant_id: number;
  payer_name: string;
  payment_direction: string;
  payment_order_item_list: PaymentOrderItem[];
  payment_order_no: string;
  payment_time: string;
  remark: string;
  total_amount: number;
  type: string;
  vendor_id: number;
}

export interface PaymentOrderItem {
  account_id: number;
  account_ledger_id: number;
  amount: number;
  business_id: number;
  business_type: string;
  merchant_id: number;
  payment_method_mark: string;
  payment_method_type: string;
  payment_order_id: number;
  remark: string;
  type: string;
}
export interface paymentOrderDetails {
  merchant_id: number;
  payment_order_id: number;
}
export interface paymentOrderModifyV0 {
  actual_amount: number;
  attachment_url: string;
  business_type: string;
  currency_code: string;
  exchange_rate: number;
  id: number;
  merchant_id: number;
  payer_name: string;
  payment_direction: string;
  payment_order_item_list: {
    account_id: number;
    account_ledger_id: number;
    amount: number;
    business_id: number;
    business_type: string;
    id: number;
    merchant_id: number;
    payment_method_mark: string;
    payment_method_type: string;
    payment_order_id: number;
    remark: string;
    type: string;
  }[];
  payment_time: string;
  remark: string;
  total_amount: number;
}
export interface paymentOrderPageListV0 {
  business_type: string;
  id_list: number[];
  keywords: string;
  merchant_id: number;
  page_num: number;
  page_size: number;
  payment_direction: string;
  payment_end_time: string;
  payment_order_no: string;
  payment_start_time: string;
  review_end_time: string;
  review_start_time: string;
  review_status: string;
  review_status_list: string[];
  reviewer_id: number;
  reviewer_id_list: number[];
  type: string;
  vendor_id: number;
  vendor_id_list: number[];
}
export interface paymentOrderRemoveV0 {
  merchant_id: number;
  payment_order_ids: number[];
}
export interface paymentOrderReviewStatusModifyV0 {
  id: number;
  merchant_id: number;
  review_opinion: string;
  review_status: string;
}
