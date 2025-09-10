// 优先暴露 @formily/vue 的实现；随后再整体 re-export @formily/json-schema（不会覆盖已存在的具名导出）.

// 组件
export {
  FormProvider,
  FormConsumer,
  ArrayField,
  ObjectField,
  VoidField,
  RecursionField,
  Field,
  createSchemaField,
  ExpressionScope,
} from '@formily/vue';

// Hooks
export {
  useForm,
  useField,
  useFormEffects,
  useFieldSchema,
  useParentForm,
} from '@formily/vue';

// Shared（运行时工具）
export {
  connect,
  mapProps,
  mapReadPretty,
  h,
  Fragment,
  createForm, // 注意：与 @formily/core 同名，这里以 vue 版本为主
} from '@formily/vue';

export type { Schema } from "@formily/vue"
// 进一步与官方保持一致：把 @formily/json-schema 的导出也透传出来
export * from '@formily/json-schema';

// 类型导出（不会与值级别命名冲突）
export type * from '@formily/vue';
export type * from '@formily/json-schema';
