import type {
  listPageFinanceFlowPayload,
  listPageFinanceFlowResponse,
  FinanceFlowPlusQueryPageVO,
} from '@/apis/accounting/type';

// 列类型枚举
export enum ColumnType {
  ALL = 'ALL', // 全部
  REVENUE = 'REVENUE', // 收入
  EXPENDITURE = 'EXPENDITURE', // 支出
}

// 余额方向枚举
export enum BalanceDirection {
  DEBIT = 'DEBIT', // 借方
  CREDIT = 'CREDIT', // 贷方
}

// 来源类型选项
export const sourceTypeOptions = [
  {
    label: 'accounting_note_create',
    value: 'ACCOUNTING_NOTE_CREATE',
  },
  {
    label: 'accounting_note_modify',
    value: 'ACCOUNTING_NOTE_MODIFY',
  },
  {
    label: 'customer_recharge_without_vip',
    value: 'CUSTOMER_RECHARGE_WITHOUT_VIP',
  },
  {
    label: 'customer_recharge_with_vip',
    value: 'CUSTOMER_RECHARGE_WITH_VIP',
  },
  {
    label: 'manually_create',
    value: 'MANUALLY_CREATE',
  },
  {
    label: 'purchase_bill_goods_payment',
    value: 'PURCHASE_BILL_GOODS_PAYMENT',
  },
  {
    label: 'purchase_order_payment',
    value: 'PURCHASE_ORDER_PAYMENT',
  },
  {
    label: 'purchase_order_returned',
    value: 'PURCHASE_ORDER_RETURNED',
  },
  {
    label: 'sales_offline_order_sync',
    value: 'SALES_OFFLINE_ORDER_SYNC',
  },
  {
    label: 'sales_order_payment',
    value: 'SALES_ORDER_PAYMENT',
  },
  {
    label: 'sales_order_refund',
    value: 'SALES_ORDER_REFUND',
  },
  {
    label: 'receipt_order_review',
    value: 'RECEIPT_ORDER_REVIEW',
  },
];

// 查询参数
export interface FinanceFlowQueryParams {
  page_num: number;
  page_size: number;
  balance_direction?: string;
  keywords: string;
  flow_no: string;
  finance_category_name: string;
  timeRange: any[];
  source_type?: string;
  trading_no: string;
  flow_no_list?: string[];
  trading_no_list?: string[];
  finance_category_id_list?: number[];
  source_type_list?: string[];
}

// 搜索参数
export interface FinanceFlowSearchParams {
  keywords?: string;
  timeRange?: any[];
  flow_no_list?: string[];
  trading_no_list?: string[];
  finance_category_id_list?: number[];
  source_type_list?: string[];
}

// 重新导出原有类型
export type {
  listPageFinanceFlowPayload,
  listPageFinanceFlowResponse,
  FinanceFlowPlusQueryPageVO,
};
