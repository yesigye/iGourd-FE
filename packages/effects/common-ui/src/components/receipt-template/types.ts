import type { Component } from 'vue';

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
  suffix?: any;
  prefix?: any;
}
/** 字段分组类型 */
export enum OptionGroupType {
  BasicInfo = 'basic information',
  CustomerInfo = 'customer information',
  PaymentInfo = 'payment information',
  ProductInfo = 'product information',
}
export type IdString = `${number}`;
export type TemplateType =
  | 'BARCODE_LABEL'
  | 'PRELIMINARY_BILL_RECEIPT'
  | 'PRICE_TAG'
  | 'RECEIPT'
  | 'REFUND_RECEIPT';

interface LabelOrValueItem {
  key?: string;
  label?: string;
  before?: number | string;
  value?: number | string;
  result?: number | string;
  after?: number | string;
}
export interface TemplateOptions {
  title: string;
  subTitle: LabelOrValueItem[];
  topList: LabelOrValueItem[];
  centerList: LabelOrValueItem[];
  productInfo: {
    productList: Array<LabelOrValueItem[]>;
    titleList: Array<LabelOrValueItem>;
  };
  bottomList: LabelOrValueItem[];
  footerList: LabelOrValueItem[];
  barcode: string;
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
export type PrintTemplateApiType = {
  column_option_code?: ColumnOptionCode[];
  component_type?: string;
  id: IdString;
  imageUrl?: string;
  style: Record<string, string> /** 目前只用到textAlign  */ & {
    textAlign: string;
  };
};
// 添加类型定义
export interface TreeNode {
  id: number;
  label: string;
  children?: TreeNode[];
  com?: string;
}

export type TableJsonTemplate = {
  column_option_code: string[];
  com: Component;
  component_type: string;
  id: string;
  label: string;
  option: any;
  style: {
    textAlign: string;
  };
};

export type PropsType = {
  fontSize?: number;
  getCustomTemplateOptionList: (params?: any) => Promise<any[]>;
  imageUrl?: string;
  isBarcode?: boolean;
  optionContent?: any[];
  printId: string;
  printInfo?: any[];
  roles: Partial<TemplateOptions>;
  templateType?: TemplateType;
  title?: string;
};
