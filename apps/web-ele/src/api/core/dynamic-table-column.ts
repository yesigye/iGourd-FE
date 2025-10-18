import { requestClient } from '#/api/request';

/**
 * 同步表格动态列
 * @param table_key
 * @param column_json
 * @returns
 */
export function asyncTableColumn(table_key: string, column_json: string) {
  return requestClient.post('/v1/merchant/basics/dynamic-table-column/sync', {
    table_key,
    column_json,
  });
}

export function findTableColumn(table_key: string) {
  return requestClient
    .post('/v1/merchant/basics/dynamic-table-column/find', {
      table_key,
    })
    .then((res) => {
      return JSON.parse(res.column_json);
    });
}
