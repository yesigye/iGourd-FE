import { camelCase, omit } from '@igourd/utils';

import { requestClient } from '#/api/request';

export const tableExport = (data: any) => {
  const table_multi_headers = data.$grid
    .getTableColumn()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .collectColumn.map((node) => {
      // console.log(node);
      if (node.children) {
        return {
          field_key: camelCase(node.field.replaceAll('_col', '')),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          header_names: node.children?.map((item) => item.title),
        };
      }

      return {
        field_key: camelCase(node.field),
        header_names: [node.title],
      };
    });
  return requestClient.post(
    `/v1/merchant/base/file-export/multi-header/export`,
    {
      table_key: data.$grid.props.id,
      conditions: omit(data.options.params, ['page_size', 'page_num']),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      table_multi_headers,
    },
  );
};
