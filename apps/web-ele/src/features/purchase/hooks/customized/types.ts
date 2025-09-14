export interface PurchaseCustomizedInfo {
  id: number;
  name: string;
  type: string;
  is_fixed_option: boolean;
  is_compulsory: boolean;
  creator_name: string;
  create_time: string;
}
// 定义表单数据类型
export interface PurchaseCustomizedFormData {
  entity: string;
  name: string;
  is_compulsory: boolean;
  is_fixed_option: boolean | null;
  type: string;
  options: string;
  max_length: string;
  remark: string;
  merchant_id: string;
  selectionOptions: Array<{ name: string }>;
}
