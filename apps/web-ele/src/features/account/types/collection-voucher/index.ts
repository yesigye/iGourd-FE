import type {
  ReceiptOrderQueryPageVO,
  ReceiptOrderPageModel,
  ReceiptOrderDetailModel,
  ReceiptOrderRemoveVO,
  ReceiptOrderCreateVO,
  ReceiptOrderModifyVO,
  MerchantPaymentMethodConfigModel,
  PaymentMethodConfigQueryVO,
  ReceiptOrderReviewVO,
  ListPageOrderModel,
  AccountPageModel,
} from '@/apis/accounting/type';

import { DrawerType } from '@/utils';

// 收款单抽屉类型
export type CollectionVoucherDrawerType = {
  id?: string;
  type: DrawerType;
  businessType?: string;
};

// 订单状态枚举
export enum OrderInfoStatusEnum {
  CANCEL = 'CANCEL',
  PENDING = 'PENDING',
  PAID = 'PAID',
  NO_REPAID = 'NO_REPAID',
  PARTIAL_REPAID = 'PARTIAL_REPAID',
  REPAID = 'REPAID',
}

// 收款方向枚举
export enum ReceiptDirection {
  NEGATIVE_ORDER = 'NEGATIVE_ORDER', // 红单
  POSITIVE_ORDER = 'POSITIVE_ORDER', // 蓝单
}

// 业务类型枚举
export enum BusinessTypeEnum {
  SALES_ORDER = 'SALES_ORDER', // 销售订单
  SALES_ORDER_RETURNED = 'SALES_ORDER_RETURNED', // 销售退单
  PURCHASE_ORDER = 'PURCHASE_ORDER', // 采购订单
  GOODS_RECEIPT_NOTE = 'GOODS_RECEIPT_NOTE', // 收货单
  PURCHASE_ORDER_REFUND = 'PURCHASE_ORDER_REFUND', // 采购退单
  STOCK_TRANSFER = 'STOCK_TRANSFER', // 库存调拨
  PHYSICAL_STOCK_TAKE = 'PHYSICAL_STOCK_TAKE', // 库存盘点
  INVENTORY_WRITE_OFF = 'INVENTORY_WRITE_OFF', // 库存报损
  ACCOUNTING_NOTE = 'ACCOUNTING_NOTE', // 记账笔记
  CUSTOMER_RECHARGER = 'CUSTOMER_RECHARGER', // 客户充值
  CURRENCY_EXCHANGE = 'CURRENCY_EXCHANGE', // 货币兑换
  PREPAYMENT = 'PREPAYMENT', // 预付款项
  AR_CREDIT_SALE = 'AR_CREDIT_SALE', // 客户赊销
}

// 科目类型枚举
export enum LedgerTypeEnum {
  REVENUE = 'REVENUE', // 预收款
  RECEIVABLE = 'RECEIVABLE', // 应收款
}

// 审核状态枚举
export enum ReviewStatusEnum {
  PENDING = 'PENDING', // 等待中
  APPROVED = 'APPROVED', // 审核通过
  REJECTED = 'REJECTED', // 审核拒绝
}

// 收款单类型枚举
export enum ReceiptOrderTypeEnum {
  SALES_ORDER = 'SALES_ORDER', // 销售订单
  SALES_ORDER_RETURNED = 'SALES_ORDER_RETURNED', // 销售退单
  CUSTOMER_RECHARGER = 'CUSTOMER_RECHARGER', // 客户充值
  CUSTOMER_REPAYMENT = 'CUSTOMER_REPAYMENT', // 客户还款
  ACCOUNTING_NOTE = 'ACCOUNTING_NOTE', // 记账笔记
}

// 表格视图支付方案
export type TableViewPaySchema = {
  collected_account: string;
  collected_method: string;
  collected_amount: string;
  service_fee?: string;
  collected_method_raw: MerchantPaymentMethodConfigModel;
  collected_account_raw: AccountPageModel;
};

// 表格视图数据
export type TableViewData = {
  [key: string]: {
    paySchema: TableViewPaySchema[];
    data: ListPageOrderModel;
  };
};

// 收款单表单数据
export type CollectionVoucherForm = {
  receipt_order_no?: string;
  customer_id: number;
  payer_name: string;
  receipt_time: string;
  receivable_balance: string;
  last_debt: string;
  formilySelectSourceOrder: TableViewData;
  remark?: string;
  attachment_url?: {
    name: string;
    url: string;
    _fromHistoryRecord?: boolean;
  }[];
};

// 查询参数
export interface CollectionVoucherQueryParams {
  page_num: number;
  page_size: number;
  keywords: string;
  merchant_id?: number;
  receipt_start_time?: string;
  receipt_end_time?: string;
  review_start_time?: string;
  review_end_time?: string;
  id_list?: number[];
  customer_id_list?: number[];
  reviewer_id_list?: number[];
  review_status_list?: string[];
}

// 搜索参数
export interface CollectionVoucherSearchParams {
  keywords?: string;
  receipt_start_time?: any;
  review_start_time?: any;
  id_list?: number[];
  customer_id_list?: number[];
  reviewer_id_list?: number[];
  review_status_list?: string[];
}

// 重新导出原有类型
export type {
  ReceiptOrderQueryPageVO,
  ReceiptOrderPageModel,
  ReceiptOrderDetailModel,
  ReceiptOrderRemoveVO,
  ReceiptOrderCreateVO,
  ReceiptOrderModifyVO,
  MerchantPaymentMethodConfigModel,
  PaymentMethodConfigQueryVO,
  ReceiptOrderReviewVO,
};
