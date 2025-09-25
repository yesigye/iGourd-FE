// Formily Schema 高级辅助函数
import type { ColumnDescriptor } from '../types';

/**
 * 创建带有条件显示的列
 */
export const createConditionalColumn = (
  name: string,
  title: string,
  component: string,
  condition: string,
  props: Record<string, any> = {},
): ColumnDescriptor => ({
  name,
  title,
  'x-component': component,
  'x-component-props': props,
  'x-reactions': {
    fulfill: {
      state: {
        'x-hidden': `{{!${condition}}}`,
      },
    },
  },
});

/**
 * 创建带有数据源的列
 */
export const createDataSourceColumn = (
  name: string,
  title: string,
  component: string,
  dataSource: string,
  valueField?: string,
  props: Record<string, any> = {},
): ColumnDescriptor => ({
  name,
  title,
  'x-component': component,
  'x-component-props': {
    dataSource: `{{${dataSource}}}`,
    ...(valueField && { valueField }),
    ...props,
  },
});

/**
 * 创建带有验证的列
 */
export const createValidatedColumn = (
  name: string,
  title: string,
  component: string,
  validators: any[],
  props: Record<string, any> = {},
): ColumnDescriptor => ({
  name,
  title,
  'x-component': component,
  'x-component-props': props,
  'x-validator': validators,
});

/**
 * 创建带有联动反应的列
 */
export const createReactiveColumn = (
  name: string,
  title: string,
  component: string,
  dependencies: string[],
  reactions: any,
  props: Record<string, any> = {},
): ColumnDescriptor => ({
  name,
  title,
  'x-component': component,
  'x-component-props': props,
  'x-reactions': {
    dependencies,
    fulfill: {
      state: reactions,
    },
  },
});

/**
 * 创建带有格式化显示的列
 */
export const createFormattedColumn = (
  name: string,
  title: string,
  formatter: string,
  props: Record<string, any> = {},
): ColumnDescriptor => ({
  name,
  title,
  'x-component': 'PreviewText.Input',
  'x-component-props': props,
  'x-reactions': {
    fulfill: {
      state: {
        value: `{{${formatter}}}`,
      },
    },
  },
});

/**
 * 创建带有自定义渲染的列
 */
export const createCustomColumn = (
  name: string,
  title: string,
  component: string,
  props: Record<string, any> = {},
): ColumnDescriptor => ({
  name,
  title,
  'x-component': component,
  'x-component-props': props,
});

/**
 * 创建数组表格的列配置
 */
export const createArrayTableColumn = (
  name: string,
  title: string,
  component: string,
  props: Record<string, any> = {},
): ColumnDescriptor => ({
  type: 'void',
  'x-component': 'ArrayTable.Column',
  'x-component-props': {
    title,
    ...props,
  },
  properties: {
    [name]: {
      'x-component': component,
      'x-decorator': 'FormItem',
      'x-component-props': props,
    },
  },
});

/**
 * 创建带有计算字段的列
 */
export const createComputedColumn = (
  name: string,
  title: string,
  expression: string,
  props: Record<string, any> = {},
): ColumnDescriptor => ({
  name,
  title,
  'x-component': 'PreviewText.Input',
  'x-component-props': props,
  'x-reactions': {
    fulfill: {
      state: {
        value: `{{${expression}}}`,
      },
    },
  },
});
