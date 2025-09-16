// 商品标签相关类型定义

export interface ProductLabelItem {
  id: number;
  name: string;
  product_number: number;
  creator_name: string;
  create_time: string;
  merchant_id?: number;
}

export interface ProductLabelParams {
  page_num: number;
  page_size: number;
  merchant_id: number;
  keywords?: string;
  name?: string;
}

export interface ProductLabelResponse {
  list: ProductLabelItem[];
  total: number;
  page_num: number;
  page_size: number;
}

export interface ProductLabelProductItem {
  id: number;
  product_name: string;
  product_code: string;
  product_label_id: number;
  merchant_id: number;
}

export interface ProductLabelProductResponse {
  list: ProductLabelProductItem[];
  total: number;
  page_num: number;
  page_size: number;
}
