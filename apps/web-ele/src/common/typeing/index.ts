import type {
  // ComponentPublicInstance,
  // FunctionalComponent,
  VNode,
  VNodeChild,
  PropType as VuePropType,
  ComputedRef,
  Ref
} from 'vue';

export interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

export declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}

export declare type RefType<T> = T | null;

export declare namespace JSX {
  type Element = VNode;
  interface ElementAttributesProperty {
    $props: any;
  }
  interface IntrinsicElements {
    [elem: string]: any;
  }
  interface IntrinsicAttributes {
    [elem: string]: any;
  }
}

export declare type EmitType = (event: string, ...args: any[]) => void;
export declare type TargetContext = '_self' | '_blank';
export declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T;
}
export declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;
export declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

export declare type PropType<T> = VuePropType<T>;
export declare type Nullable<T> = T | null;
export declare type NonNullable<T> = T extends null | undefined ? never : T;
export declare type Recordable<T = any> = Record<string, T>;
export declare interface ReadonlyRecordable<T = any> {
  readonly [key: string]: T;
}
export declare type VueNode = VNodeChild | JSX.Element;
export declare type DynamicProps<T> = {
  [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>;
};

export declare type InternalComponentProps = 'key' | 'ref' | 'ref_for' | 'ref_key' | 'slot' | 'is' | `onVnode${string}`;
// export declare type ExtractProps<T extends new (...args: any[]) => any> = Omit<
export declare type ExtractProps = Omit<
  // ExtractPropTypes<InstanceType<T>['$props']>,
  any,
  InternalComponentProps
>;

export declare interface PageParam {
  pageSize?: number;
  pageNo?: number;
}

export declare interface PageResult<T = any> {
  list: T[];
  total: number;
}

// declare module 'vue' {
//   export type JSXComponent<Props = any> = { new (): ComponentPublicInstance<Props> } | FunctionalComponent<Props>;
// }
