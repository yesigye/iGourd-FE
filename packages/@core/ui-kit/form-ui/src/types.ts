// import { type Form } from "@formily/core"

import type { IFormProps } from '@formily/core';
import type { ISchema } from '@formily/vue';
import type { ButtonProps } from 'element-plus';

import type { ClassType, MaybeComputedRef } from '@igourd-core/typings';
import type { Component } from 'vue';

export interface ActionButtonOptions extends ButtonProps {
  [key: string]: any;
  content?: MaybeComputedRef<string>;
  show?: boolean;
}

export type ArrayToStringFields = Array<
  | [string[], string?] // 嵌套数组格式，可选分隔符
  | string // 单个字段，使用默认分隔符
  | string[] // 简单数组格式，最后一个元素可以是分隔符
>;

export type FieldMappingTime = [
  string,
  [string, string],
  (
    | ((value: any, fieldName: string) => any)
    | [string, string]
    | null
    | string
  )?,
][];

export type HandleResetFn = (
  values?: Record<string, any>,
) => Promise<void> | void;

export type HandleSubmitFn = (
  values?: Record<string, any>,
) => Promise<void> | void;

export interface IGourdFormProps<T extends object> extends IFormProps<T> {
  /**
   * 操作按钮是否反转（提交按钮前置）
   */
  actionButtonsReverse?: boolean;
  /**
   * 操作按钮组的样式
   * newLine: 在新行显示。rowEnd: 在行内显示，靠右对齐（默认）。inline: 使用grid默认样式
   */
  actionLayout?: 'inline' | 'newLine' | 'rowEnd';
  /**
   * 操作按钮组显示位置，默认靠右显示
   */
  actionPosition?: 'center' | 'left' | 'right';
  /**
   * 表单操作区域class
   */
  actionWrapperClass?: ClassType;
  /**
   * 表单字段数组映射字符串配置 默认使用","
   */
  arrayToStringFields?: ArrayToStringFields;

  /**
   * 表单字段映射
   */
  fieldMappingTime?: FieldMappingTime;

  /**
   * 表单重置回调
   */
  handleReset?: HandleResetFn;

  /**
   * 表单提交回调
   */
  handleSubmit?: HandleSubmitFn;
  /**
   * 表单值变化回调
   */
  handleValuesChange?: (
    values: Record<string, any>,
    fieldsChanged: string[],
  ) => void;
  /**
   * 重置按钮参数
   */
  resetButtonOptions?: ActionButtonOptions;

  /**
   * 表单 JSON Schema
   */
  schema: ISchema;

  /**
   * 副作用
   */
  scope?: Record<string, any>;

  /**
   * 验证失败时是否自动滚动到第一个错误字段
   * @default false
   */
  scrollToFirstError?: boolean;

  /**
   * 是否显示默认操作按钮
   * @default true
   */
  showDefaultActions?: boolean;

  /**
   * 提交按钮参数
   */
  submitButtonOptions?: ActionButtonOptions;

  /**
   * 是否在字段值改变时提交表单
   * @default false
   */
  submitOnChange?: boolean;

  /**
   * 自定义表单组件
   */
  components?: Record<string, Component>;

  /**
   * 是否在回车时提交表单
   * @default false
   */
  submitOnEnter?: boolean;
  useI18n: () => unknown;
}
export type { IFormProps };
