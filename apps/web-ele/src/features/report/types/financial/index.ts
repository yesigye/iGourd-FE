// 财务报表行数据类型
export interface FinancialReportRow {
  id: number;
  date: string;
  income: number;
  expense: number;
  profit: number;
  profit_margin: number;
  create_time: string;
}

// 财务报表查询参数类型
export interface FinancialReportQueryParams {
  start_date?: string;
  end_date?: string;
  page: number;
  page_size: number;
}

// 财务统计数据类型
export interface FinancialStats {
  total_income: number;
  total_expense: number;
  total_profit: number;
  avg_profit_margin: number;
}
