export type SearchSelectProps = {
  onSearch: <T extends Record<string, any>>(
    params: SearchSelectPagination,
  ) => Promise<SearchApiResponse<T>>
  onChange?: (value: string[]) => any
  /** 默认的选项列表 */
  defaultOptions?: SearchSelectOptions<any>[]
  value?: string[]
}

export type SearchApiResponse<T extends Record<string, any>> = {
  list: SearchSelectOptions<T>[]
  total: number
}

/**
 * 分页参数
 */
export interface SearchSelectPagination {
  page_num: number
  page_size: number
  total?: number
  keywords?: string
  ids?: any[]
}

/** Options 值类型 */
export type SearchSelectOptions<T = Record<string, any>> = {
  label: string
  value: string
} & T
