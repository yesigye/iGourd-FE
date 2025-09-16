import type {
  TaxQueryPageVO,
  TaxPageModel,
  TaxCreateVO,
  TaxModifyVO,
  TaxRemoveVO,
  TaxDetailModel,
} from '@/apis/accounting/type';

// 税务类型枚举
export enum TaxType {
  VAT = 'VAT', // 增值税
  INCOME_TAX = 'INCOME_TAX', // 所得税
  BUSINESS_TAX = 'BUSINESS_TAX', // 营业税
  CUSTOMS_DUTY = 'CUSTOMS_DUTY', // 关税
}

// 计算类型枚举
export enum CalculationType {
  PERCENTAGE = 'PERCENTAGE', // 百分比
  FIXED_AMOUNT = 'FIXED_AMOUNT', // 固定金额
}

// 查询参数
export interface TaxQueryParams {
  page_num: number;
  page_size: number;
  keyword: string;
  name: string;
  merchant_id?: number;
}

// 搜索参数
export interface TaxSearchParams {
  keyword?: string;
  name?: string;
}

// 税务表单数据
export interface TaxForm {
  name: string;
  tax_type: TaxType;
  calculation_type: CalculationType;
  percentage?: number;
  tax_amount?: number;
  merchant_id?: number;
}

// 重新导出原有类型
export type {
  TaxQueryPageVO,
  TaxPageModel,
  TaxCreateVO,
  TaxModifyVO,
  TaxRemoveVO,
  TaxDetailModel,
};
