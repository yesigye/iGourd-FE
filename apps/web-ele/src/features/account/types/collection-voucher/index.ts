import type {
  AccountPageModel,
  ListPageOrderModel,
  MerchantPaymentMethodConfigModel,
  PaymentMethodConfigQueryVO,
  ReceiptOrderCreateVO,
  ReceiptOrderDetailModel,
  ReceiptOrderModifyVO,
  ReceiptOrderPageModel,
  ReceiptOrderQueryPageVO,
  ReceiptOrderRemoveVO,
  ReceiptOrderReviewVO,
} from '@/apis/accounting/type';

// 收款单抽屉类型
export type CollectionVoucherDrawerType = {
  businessType?: string;
  id?: string;
  type: '';
};

// 订单状态枚举
export enum OrderInfoStatusEnum {
  CANCEL = 'CANCEL',
  NO_REPAID = 'NO_REPAID',
  PAID = 'PAID',
  PARTIAL_REPAID = 'PARTIAL_REPAID',
  PENDING = 'PENDING',
  REPAID = 'REPAID',
}

// 收款方向枚举
export enum ReceiptDirection {
  NEGATIVE_ORDER = 'NEGATIVE_ORDER', // 红单
  POSITIVE_ORDER = 'POSITIVE_ORDER', // 蓝单
}

// 业务类型枚举
export enum BusinessTypeEnum {
  ACCOUNTING_NOTE = 'ACCOUNTING_NOTE', // 记账笔记
  AR_CREDIT_SALE = 'AR_CREDIT_SALE', // 客户赊销
  CURRENCY_EXCHANGE = 'CURRENCY_EXCHANGE', // 货币兑换
  CUSTOMER_RECHARGER = 'CUSTOMER_RECHARGER', // 客户充值
  GOODS_RECEIPT_NOTE = 'GOODS_RECEIPT_NOTE', // 收货单
  INVENTORY_WRITE_OFF = 'INVENTORY_WRITE_OFF', // 库存报损
  PHYSICAL_STOCK_TAKE = 'PHYSICAL_STOCK_TAKE', // 库存盘点
  PREPAYMENT = 'PREPAYMENT', // 预付款项
  PURCHASE_ORDER = 'PURCHASE_ORDER', // 采购订单
  PURCHASE_ORDER_REFUND = 'PURCHASE_ORDER_REFUND', // 采购退单
  SALES_ORDER = 'SALES_ORDER', // 销售订单
  SALES_ORDER_RETURNED = 'SALES_ORDER_RETURNED', // 销售退单
  STOCK_TRANSFER = 'STOCK_TRANSFER', // 库存调拨
}

// 科目类型枚举
export enum LedgerTypeEnum {
  RECEIVABLE = 'RECEIVABLE', // 应收款
  REVENUE = 'REVENUE', // 预收款
}

// 审核状态枚举
export enum ReviewStatusEnum {
  APPROVED = 'APPROVED', // 审核通过
  PENDING = 'PENDING', // 等待中
  REJECTED = 'REJECTED', // 审核拒绝
}

// 收款单类型枚举
export enum ReceiptOrderTypeEnum {
  ACCOUNTING_NOTE = 'ACCOUNTING_NOTE', // 记账笔记
  CUSTOMER_RECHARGER = 'CUSTOMER_RECHARGER', // 客户充值
  CUSTOMER_REPAYMENT = 'CUSTOMER_REPAYMENT', // 客户还款
  SALES_ORDER = 'SALES_ORDER', // 销售订单
  SALES_ORDER_RETURNED = 'SALES_ORDER_RETURNED', // 销售退单
}

// 表格视图支付方案
export type TableViewPaySchema = {
  collected_account: string;
  collected_account_raw: AccountPageModel;
  collected_amount: string;
  collected_method: string;
  collected_method_raw: MerchantPaymentMethodConfigModel;
  service_fee?: string;
};

// 表格视图数据
export type TableViewData = {
  [key: string]: {
    data: ListPageOrderModel;
    paySchema: TableViewPaySchema[];
  };
};

// 收款单表单数据
export type CollectionVoucherForm = {
  attachment_url?: {
    _fromHistoryRecord?: boolean;
    name: string;
    url: string;
  }[];
  customer_id: number;
  formilySelectSourceOrder: TableViewData;
  last_debt: string;
  payer_name: string;
  receipt_order_no?: string;
  receipt_time: string;
  receivable_balance: string;
  remark?: string;
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
  MerchantPaymentMethodConfigModel,
  PaymentMethodConfigQueryVO,
  ReceiptOrderCreateVO,
  ReceiptOrderDetailModel,
  ReceiptOrderModifyVO,
  ReceiptOrderPageModel,
  ReceiptOrderQueryPageVO,
  ReceiptOrderRemoveVO,
  ReceiptOrderReviewVO,
};
