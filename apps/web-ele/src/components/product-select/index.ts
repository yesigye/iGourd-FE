import type { ISchema } from '@igourd/common-ui';

import { getProductList } from '@@/inventory';

function remoteMethod(keywords: string) {
  return getProductList({
    page_num: 1,
    page_size: 15,
    keywords,
  }).then((res) => {
    const ops = res.list.map((item: any) => {
      return {
        ...item,
        product_code: [item.product_code, item.major_name].join('-'),
        label: item.major_name,
        value: item.id,
      };
    });
    return ops;
  });
}

export const productSelect: ISchema = {
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
      col0: {
        type: 'void',
        'x-visible': false,
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: "{{t('marketing.product-code')}}",
        },

        properties: {
          id: {
            type: 'string',
          },
        },
      },
      col1: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: "{{t('marketing.product-code')}}",
        },

        properties: {
          product_code: {
            type: 'string',
            'x-component': 'RemoteSelect',
            'x-component-props': {
              remoteMethod(keywords: string) {
                return remoteMethod(keywords).then((res) => {
                  return res.map((item) => ({
                    ...item,
                    value: item.id,
                    label: item.product_code,
                  }));
                });
              },
            },
          },
        },
      },
      col2: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: "{{t('marketing.product-name')}}",
        },
        properties: {
          major_name: {
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
