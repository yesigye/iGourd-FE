import type { ISchema } from '@igourd/common-ui';

import { getProductList } from '@@/inventory';

function remoteMethod(keywords: string) {
  return getProductList({
    page_num: 1,
    page_size: 15,
    keywords,
  }).then((res) => {
    return res.list.map((item: any) => {
      return {
        ...item,
        label: item.major_name,
        value: item.id,
      };
    });
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
      col1: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: "{{t('marketing.productCode')}}",
        },

        properties: {
          id: {
            type: 'string',
            'x-component': 'RemoteSelect',
            'x-component-props': {
              remoteMethod(keywords: string) {
                return remoteMethod(keywords).then((res) => {
                  return res.map((item) => ({
                    ...item,
                    value: item.id,
                    label: [item.product_code, item.major_name].join('-'),
                  }));
                });
              },
            },
            'x-reactions': [
              {
                dependencies: ['.major_name_spec'],
                fulfill: { state: { value: '{{$deps[0]}}' } },
              },
            ],
          },
        },
      },
      col2: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: "{{t('marketing.PRODUCT')}}",
        },
        properties: {
          major_name_spec: {
            type: 'string',
            'x-component': 'RemoteSelect',
            'x-component-props': {
              remoteMethod,
            },
            'x-reactions': [
              {
                dependencies: ['.id'],
                fulfill: { state: { value: '{{$deps[0]}}' } },
              },
              // (field) => {
              //   // if (!field.modified) return;
              //   const v = field.value;
              //   field.query('.id').take((target: any) => {
              //     if (target && target.value !== v) target.setValue(v);
              //   });
              // },
            ],
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
