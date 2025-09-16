import type {
  CurrencyExchangeQueryPageVO,
  CurrencyExchangePageModel,
  CurrencyExchangeCreateVO,
  CurrencyExchangeModifyVO,
  CurrencyExchangeRemoveVO,
  CurrencyExchangeDetailModel,
} from '@/apis/accounting/type';

// 查询参数
export interface CurrencyExchangeQueryParams {
  page_num: number;
  page_size: number;
  keyword: string;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
}

// 搜索参数
export interface CurrencyExchangeSearchParams {
  keyword?: string;
  dateRange?: any[];
}

// 货币兑换表单数据
export interface CurrencyExchangeForm {
  sell_currency_id: number;
  buy_currency_id: number;
  sell_amount: number;
  buy_amount: number;
  exchange_rate: number;
  remark?: string;
  merchant_id?: number;
}

// 重新导出原有类型
export type {
  CurrencyExchangeQueryPageVO,
  CurrencyExchangePageModel,
  CurrencyExchangeCreateVO,
  CurrencyExchangeModifyVO,
  CurrencyExchangeRemoveVO,
  CurrencyExchangeDetailModel,
};
