export interface TemplateTypeListItem {
  label: string;
  title: string;
  type: string;
  key: string;
  labelKey: string;
}
export interface TemplateTypeItem {
  list: TemplateTypeListItem[];
  title: string;
  type: string;
  key: string;
}
export enum PrintTemplateBusinessTypeEnum {
  /** 条码标签 */
  BARCODE_LABEL = 'BARCODE_LABEL',
  /** 日结小票 */
  DAILY_SETTLEMENT_RECEIPT = 'DAILY_SETTLEMENT_RECEIPT',
  /** 预结单小票 */
  PRELIMINARY_BILL_RECEIPT = 'PRELIMINARY_BILL_RECEIPT',
  /** 价格标签 */
  PRICE_TAG = 'PRICE_TAG',
  /** 销售订单小票 */
  RECEIPT = 'RECEIPT',
  /** 充值小票&赊账订单小票 */
  RECHARGE_RECEIPT = 'RECHARGE_RECEIPT',
  /** 退单小票 */
  REFUND_RECEIPT = 'REFUND_RECEIPT',
  /** 还款订单小票 */
  REPAYMENT_RECEIPT = 'REPAYMENT_RECEIPT',
}
export interface PrintTemplateOptionContent {
  id: string;
  style: {
    border?: 'dashed' | 'solid';
    borderCount?: number;
    textAlign?: 'center' | 'left' | 'right';
  };
  component_type?: 'PrintDivider' | 'PrintRichTextEditor';
  column_option_code?: string[];
  option?: {
    value?: string;
  };
}
export interface PrintTemplate {
  /** 业务类型 */
  business_type:
    | 'BARCODE_LABEL'
    | 'DAILY_SETTLEMENT_RECEIPT'
    | 'PRELIMINARY_BILL_RECEIPT'
    | 'PRICE_TAG'
    | 'RECEIPT'
    | 'RECHARGE_RECEIPT'
    | 'REFUND_RECEIPT'
    | 'REPAYMENT_RECEIPT';
  /** 列选项列表 */
  column_option_list: PrintTemplateColumnOption[];
  /** 创建时间 */
  create_time: string;
  /** 创建者ID */
  creator_id: string;
  /** 创建者姓名 */
  creator_name: null | string;
  /** 模板ID */
  id: string;
  /** 是否为默认模板 */
  is_default: boolean;
  /** 商户ID */
  merchant_id: string;
  /** 修改时间 */
  modify_time: string;
  /** 模板名称 */
  name: string;
  /** 选项内容（JSON字符串） */
  option_content: string;
  /** 打印模板选项ID */
  print_template_option_id: string;
  /** 头像/预览图 */
  profile_photo: string;
  /** 备注 */
  remark: string;
  /** 规格选项名称 */
  spec_option_name: string;
  /** 状态 */
  status: 'CLOSE' | 'OPEN';
  /** 时区 */
  time_zone: string;
  /** 标题名称 */
  title_name: string;
  /** 类型 */
  type:
    | 'BARCODE_LABEL'
    | 'DAILY_SETTLEMENT_RECEIPT'
    | 'PRELIMINARY_BILL_RECEIPT'
    | 'PRICE_TAG'
    | 'RECEIPT'
    | 'RECHARGE_RECEIPT'
    | 'REFUND_RECEIPT'
    | 'REPAYMENT_RECEIPT';
  /** 版本 */
  version: string;
}
export type IdString = `${number}`;

/** 字段分组类型 */
export enum OptionGroupType {
  BasicInfo = 'basic information',
  CustomerInfo = 'customer information',
  PaymentInfo = 'payment information',
  ProductInfo = 'product information',
}
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
export type ColumnOptionCode = {
  column_option_code: string;
  i18nKey: string;
  id: IdString;
  name: string;
  prefix: string;
  storeInfo: any;
  suffix: string;
};
export interface PrintTemplateColumnOption {
  component_type: string;
  id: string;
  option: Record<string, unknown>;
  style: Record<string, unknown>;
}
