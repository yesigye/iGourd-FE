import type {
  CurrencyQueryPageVO,
  PaginatedCurrencyInfo,
  CurrencyCreateVO,
  CurrencyModifyVO,
  CurrencyRemoveVO,
  CurrencyDetailModel,
} from '@/apis/accounting/type';

// 查询参数
export interface CurrencyQueryParams {
  page_num: number;
  page_size: number;
  keywords: string;
  merchant_id?: number;
}

// 搜索参数
export interface CurrencySearchParams {
  keywords?: string;
}

// 货币表单数据
export interface CurrencyForm {
  name: string;
  code: string;
  exchange_rate: number;
  symbol: string;
  decimal_places?: number;
  is_default?: boolean;
  merchant_id?: number;
}

// 重新导出原有类型
export type {
  CurrencyQueryPageVO,
  PaginatedCurrencyInfo,
  CurrencyCreateVO,
  CurrencyModifyVO,
  CurrencyRemoveVO,
  CurrencyDetailModel,
};
