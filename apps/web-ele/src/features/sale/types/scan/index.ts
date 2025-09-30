import type { VNode } from 'vue';

export const WIPED_AMOUNT_INPUT_KEY = 'wipe';

export interface Column {
  prop: string;
  localKey?: string;
  key?: string;
  width?: string;
  fixed?: string;
  align?: string;
  isSelect?: boolean;
  disabled?: boolean;
  labelSuffix?: string;
  render?: (row: any) => number | string | VNode;
}
export type IdString = `${number}`;

export interface PrintTemplateOption {
  id: IdString;
  create_time: null | string;
  modify_time: null | string;
  time_zone: string;
  version: string;
  creator_id: string;
  remark: string;
  name: string;
  type: 'COLUMN';
  template_type: 'RECEIPT';
  column_option_code: string;
  default_value: string;
  option_group_type: OptionGroupType;
  component_type: string;
  /** 多语言key */
  column_key: string;
  is_selected: boolean;
  /** 要渲染的组件 */
  com: any;
}
/** 字段分组类型 */
export enum OptionGroupType {
  BasicInfo = 'basic information',
  CustomerInfo = 'customer information',
  PaymentInfo = 'payment information',
  ProductInfo = 'product information',
}

export type MerchantPaymentMethodConfigModelAddPayField =
  MerchantPaymentMethodConfigModel & {
    field: {
      data: string;
      isActive: boolean;
      params: string;
      type: string;
    };
  };
/** 付款结算方式 */
export enum PaymentWay {
  /** 赊账 */
  CREDIT = '4',
  /** 正常结算 */
  NORMAL = '0',
}

/** 支付输入框的类型 */
export type PaymentInputType = {
  [key in PaymentMethodEnum]: {
    activeItemAmount?: string;
    activeItemMark: MerchantPaymentMethodConfigModelAddPayField['payment_method_mark'];
    activeItemName: MerchantPaymentMethodConfigModelAddPayField['payment_method_name'];
    activeItemType: MerchantPaymentMethodConfigModelAddPayField['payment_method_type'];
  };
} & {
  /** 支付方式 */
  paymentWay: PaymentWay;
};

export type PaymentInputTypeKey =
  | keyof PaymentMethodEnum
  | typeof WIPED_AMOUNT_INPUT_KEY;
export enum PaymentMethodEnum {
  /** 余额 */
  BALANCE = 'BALANCE',
  /** 刷卡 */
  CARD = 'CARD',
  /** 现金 */
  CASH = 'CASH',
  /** 支票 */
  CHECK = 'CHECK',
  /** 三方支付 */
  THIRD_PARTY = 'THIRD_PARTY',
}
