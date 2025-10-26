import { camelCase, compact, omit } from '@igourd/utils';

import { requestClient } from '#/api/request';
import { blobDownload } from '#/utils';

/** * 获取导出时需要的表头数据 */
export const getExportTableHeaders = (
  tableHeaders: any[],
  parentHeaderName?: string,
) => {
  // eslint-disable-next-line unicorn/no-array-reduce
  return tableHeaders.reduce((tmp, next) => {
    return next.children
      ? [...tmp, ...getExportTableHeaders(next.children, next.title)]
      : [
          ...tmp,
          {
            field_key: camelCase(next.field),
            header_names: compact([parentHeaderName, next.title]),
          },
        ];
  }, []);
};

export const tableExport = (data: any) => {
  const table_multi_headers = getExportTableHeaders(
    data.$grid.getTableColumn().collectColumn.filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (item) => !['action', 'actions', 'operation'].includes(item.field),
    ),
  );

  return requestClient
    .post(
      `/v1/merchant/base/file-export/multi-header/export`,
      {
        table_key: data.$grid.props.id,
        conditions: omit(data.options.params, ['page_size', 'page_num']),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        table_multi_headers,
      },
      {
        responseType: 'blob',
        responseReturn: 'raw',
      },
    )
    .then((res) => {
      const { data, headers } = res;
      const fileName = headers['content-disposition'].replace(
        'attachment;filename=',
        '',
      );
      blobDownload(data, fileName);
      return true;
    })
    .catch((error) => {
      console.log(error);
    });
};
