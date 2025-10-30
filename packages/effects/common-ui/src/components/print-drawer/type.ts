import type { Column } from 'element-plus';

export type PrintDrawerProps = {
  printDatas: PrintData[];
  type: PrintDrawerType;
};

export type WithPrintType<T> = Pick<PrintDrawerProps, 'type'> &
  T & {
    hideOnPrint: HideOnPrint;
  };

export enum PrintComponentType {
  PrintList = 'PrintList',
  PrintTable = 'PrintTable',
  PrintTitle = 'PrintTitle',
}

type PrintData = ListType | TableType | TitleType;
export type TableType = {
  compType: PrintComponentType.PrintTable;
  gridOptions: Record<string, any>;
};

export type TitleType = {
  code?: `${number}`;
  compType: PrintComponentType.PrintTitle;
  title: string;
};

export type ListTypeColumn = Partial<Pick<Column, 'hide'>> &
  Pick<Column, 'label' | 'prop'> & {
    labelCol?: number;
    labelRender?: (value: ListTypeColumn) => string;
    valueCol?: number;
    valueRender?: (data: any) => string;
  };

export type ListType = {
  columns: ListTypeColumn[];
  compType: PrintComponentType.PrintList;
  data: Record<string, number | string>;
};

export enum PrintDrawerType {
  'A4' = 'A4',
  receipt = 'receipt',
}

export enum HideOnPrint {
  'hide' = 'hide',
  'show' = 'show',
}

export type GetPrintDataParams<
  SearchParams extends {
    page_num?: number | string;
    page_size?: number | string;
  },
  Value = Record<string, string>,
> = {
  getDataFn: (params: SearchParams) => Array<any>;
  getDataParams: SearchParams;
  result?: Value[];
};
