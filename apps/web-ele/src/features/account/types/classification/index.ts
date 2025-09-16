import type {
  FinanceCategoryListPayload,
  FinanceCategoryListResponse,
  FinanceCategoryPayload,
  DeleteFinanceCategoryPayload,
  DetailFinanceCategoryPayload,
  FinanceCategoryDetailModel,
} from '@/apis/accounting/type';

import { DrawerType } from '@/utils';

// 财务分类抽屉数据
export type FinanceCategoryDrawer = {
  type: DrawerType;
  id?: string;
};

// 列类型枚举
export enum ColumnType {
  ALL = 'ALL',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
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
export type {
  FinanceCategoryListPayload,
  FinanceCategoryListResponse,
  FinanceCategoryPayload,
  DeleteFinanceCategoryPayload,
  DetailFinanceCategoryPayload,
  FinanceCategoryDetailModel,
};
