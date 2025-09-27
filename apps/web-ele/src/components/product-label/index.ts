import type { ISchema } from '@igourd/common-ui';

function remoteMethod(keywords: string) {
  return Promise.resolve([
    { label: '0094ff', value: '0094ff' },
    { label: keywords, value: keywords },
  ]);
  return;
}

export const productLabelSelect: ISchema = {
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
              filterable: true,
              remote: true,
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
