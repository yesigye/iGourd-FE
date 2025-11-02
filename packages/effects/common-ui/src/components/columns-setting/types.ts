import type { ElTableColumn } from 'element-plus';

import type { VNode } from 'vue';

export enum SearchType {
  Date = 'date',
  DateRange = 'dateRange',
  Input = 'input',
  Select = 'select',
}

/** 列配置组件的类型 ColumnsSetting.vue start */
export type ColumnsSettingProps = {
  columns: ElTableSettingColumns[];
  /**
   * @description 是否显示固定列操作按钮
   */
  hideFixed?: boolean;
  updateColumns: (columns: ElTableSettingColumns[]) => void;
};

/**
 * element-plus table column props
 */
export type ElTableColumnProps<Row = any> = {
  /** 多级表头使用 */
  children?: ElTableColumnProps[];
  /**
   * @description 是否可搜索
   */
  filterAble?: boolean;
  /** 自定义表头渲染 */
  headerRender?: (scope: any) => number | string | VNode;
  /**
   * @description 是否禁用列固定操作按钮
   */
  hideColumnsSettingFixedAction?: boolean;
  /**
   * @description 列的唯一标识
   */
  key?: number | string;
  /**
   * @description 列的标题
   */
  label: string;
  /** @description tableData数据字段key */
  prop: string;
  render?: (row: Row, index: number) => number | string | VNode;
  /** @description 搜索组件的 props , 根据searchType的组件确定 */
  searchComponentOptions?: Record<string, any>;
  /** @description 搜索key, 没有使用 prop */
  searchKey?: string;
  /** @description 搜索框的类型 */
  searchType?: SearchType;
  // onSearch?: (value: Record<string, string>) => void;
  /** @description 禁用排序、隐藏 */
  sortDisabled?: boolean;
} & Omit<InstanceType<typeof ElTableColumn>['$props'], 'key'> &
  Record<string, any>;

export type ElTableSettingColumns = {
  /**
   * @description 列操作相关
   */
  actions?: {
    /** 是否当前列可以在列操作中取消勾选☑️
      @default: false */
    disableUncheck?: boolean;
  };
  /**
   * @description 是否隐藏该列
   */
  hide?: boolean;
} & ElTableColumnProps;
