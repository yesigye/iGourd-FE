// 模板状态枚举
export enum TemplateStatus {
  ACTIVE = 'ACTIVE', // 启用
  INACTIVE = 'INACTIVE', // 禁用
  DRAFT = 'DRAFT', // 草稿
}

// 模板类型枚举
export enum TemplateType {
  RECEIPT = 'RECEIPT', // 小票模板
  BARCODE_LABEL = 'BARCODE_LABEL', // 条码标签
  SCAN_LABEL = 'SCAN_LABEL', // 扫描标签
  SCAN_RECEIPT = 'SCAN_RECEIPT', // 扫描小票
  SCAN_TAG = 'SCAN_TAG', // 扫描标签
}

// 查询参数
export interface SettingTemplateQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  status?: TemplateStatus;
  template_type?: TemplateType;
  merchant_id?: number;
}

// 分页响应
export interface SettingTemplatePageModel {
  id: number;
  template_name: string;
  template_type: TemplateType;
  status: TemplateStatus;
  description: string;
  content: string;
  preview_url: string;
  is_default: boolean;
  sort_order: number;
  creator_name: string;
  create_time: string;
}

// 创建参数
export interface SettingTemplateCreateVO {
  template_name: string;
  template_type: TemplateType;
  description: string;
  content: string;
  is_default: boolean;
  sort_order: number;
  merchant_id?: number;
}

// 修改参数
export interface SettingTemplateModifyVO {
  template_id: number;
  template_name?: string;
  template_type?: TemplateType;
  description?: string;
  content?: string;
  is_default?: boolean;
  sort_order?: number;
  merchant_id?: number;
}

// 删除参数
export interface SettingTemplateRemoveVO {
  template_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface SettingTemplateDetailModel {
  id: number;
  template_name: string;
  template_type: TemplateType;
  status: TemplateStatus;
  description: string;
  content: string;
  preview_url: string;
  is_default: boolean;
  sort_order: number;
  creator_name: string;
  create_time: string;
}

// 模板预览
export interface TemplatePreview {
  template_id: number;
  preview_url: string;
  preview_content: string;
}

// 模板配置
export interface TemplateConfig {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  font_size: number;
  font_family: string;
  line_height: number;
  alignment: string;
  color: string;
  background_color: string;
}
