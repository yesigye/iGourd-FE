// 财务分类抽屉数据
export type FinanceCategoryDrawer = {
  id?: string;
  type: '';
};

// 列类型枚举
export enum ColumnType {
  ALL = 'ALL',
  EXPENSE = 'EXPENSE',
  REVENUE = 'REVENUE',
}

// 查询参数
export interface ClassificationQueryParams {
  page_num: number;
  page_size: number;
  type: ColumnType;
  keywords: string;
  id_list?: number[];
  create_id_list?: number[];
  merchant_id?: number;
}

// 搜索参数
export interface ClassificationSearchParams {
  keywords?: string;
  tabKey?: ColumnType;
  name?: number[];
  create_id_list?: number[];
}

// 标签页选项
export const tabOptions = [
  { label: 'account.all', value: ColumnType.ALL },
  { label: 'account.revenue', value: ColumnType.REVENUE },
  { label: 'account.expense', value: ColumnType.EXPENSE },
];

// 重新导出原有类型

export {
  type DeleteFinanceCategoryPayload,
  type DetailFinanceCategoryPayload,
  type FinanceCategoryDetailModel,
  type FinanceCategoryListPayload,
  type FinanceCategoryListResponse,
  type FinanceCategoryPayload,
} from '@@/account/types';
