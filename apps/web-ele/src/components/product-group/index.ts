import type { ISchema } from '@igourd/common-ui';

import { getSecondGroupList } from '@@/inventory';

function remoteMethod(keywords: string) {
  return getSecondGroupList({
    page_num: 1,
    page_size: 15,
    keywords,
  }).then((res) => {
    return res.list.map((item: any) => {
      return {
        ...item,
        label: item.parent_group_name,
        value: item.id,
      };
    });
  });
}

export const productGroupSelect: ISchema = {
  type: 'array',
  'x-component': 'ArrayTable',
  'x-component-props': {
    border: true,
    stripe: true,
    size: 'small',
  },
  'x-decorator': 'FormItem',
  items: {
    type: 'object',
    properties: {
      col1: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: "{{t('discount.form.productGroups')}}",
        },

        properties: {
          id: {
            type: 'string',
            'x-component': 'RemoteSelect',
            'x-component-props': {
              remoteMethod,
            },
          },
        },
      },
      colOps: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: "{{t('discount.table.columns.ops')}}",
          width: 120,
        },
        properties: {
          add: { type: 'void', 'x-component': 'ArrayTable.Addition' },
          remove: { type: 'void', 'x-component': 'ArrayTable.Remove' },
        },
      },
    },
  },
};
