import type { App, Component } from 'vue';
import type {
  RouteLocationNormalized,
  RouteRecordNormalized,
} from 'vue-router';

import type { Recordable, TargetContext } from '#/common/typeing';

import { unref } from 'vue';

import { intersectionWith, isEqual, mergeWith, unionWith } from '@igourd/utils';

import { isArray, isObject } from '#/common/utils/is';

export function noop() {}

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body;
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj)
    parameters += `${key}=${encodeURIComponent(obj[key])}&`;

  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl)
    ? baseUrl + parameters
    : baseUrl.replace(/\/?$/, '?') + parameters;
}

/**
 * Recursively merge two objects.
 * 递归合并两个对象。
 *
 * @param source The source object to merge from. 要合并的源对象。
 * @param target The target object to merge into. 目标对象，合并后结果存放于此。
 * @param mergeArrays How to merge arrays. Default is "replace".
 *        如何合并数组。默认为replace。
 *        - "union": Union the arrays. 对数组执行并集操作。
 *        - "intersection": Intersect the arrays. 对数组执行交集操作。
 *        - "concat": Concatenate the arrays. 连接数组。
 *        - "replace": Replace the source array with the target array. 用目标数组替换源数组。
 * @returns The merged object. 合并后的对象。
 */
export function deepMerge<
  T extends null | object | undefined,
  U extends null | object | undefined,
>(
  source: T,
  target: U,
  mergeArrays: 'concat' | 'intersection' | 'replace' | 'union' = 'replace',
): T & U {
  if (!target) return source as T & U;

  if (!source) return target as T & U;

  return mergeWith({}, source, target, (sourceValue, targetValue) => {
    if (isArray(targetValue) && isArray(sourceValue)) {
      switch (mergeArrays) {
        case 'concat': {
          return sourceValue.concat(targetValue);
        }
        case 'intersection': {
          return intersectionWith(sourceValue, targetValue, isEqual);
        }
        case 'replace': {
          return targetValue;
        }
        case 'union': {
          return unionWith(sourceValue, targetValue, isEqual);
        }
        default: {
          throw new Error(
            `Unknown merge array strategy: ${mergeArrays as string}`,
          );
        }
      }
    }
    if (isObject(targetValue) && isObject(sourceValue))
      return deepMerge(sourceValue, targetValue, mergeArrays);

    return undefined;
  });
}

export function openWindow(
  url: string,
  opt?: {
    noopener?: boolean;
    noreferrer?: boolean;
    target?: string | TargetContext;
  },
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
  const feature: string[] = [];

  noopener && feature.push('noopener=yes');
  noreferrer && feature.push('noreferrer=yes');

  window.open(url, target, feature.join(','));
}

// dynamic use hook props
export function getDynamicProps<T extends Record<string, unknown>, U>(
  props: T,
): Partial<U> {
  const ret: Recordable = {};

  // eslint-disable-next-line array-callback-return
  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key]);
  });

  return ret as Partial<U>;
}

export function getRawRoute(
  route: RouteLocationNormalized,
): RouteLocationNormalized {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  };
}

// https://github.com/vant-ui/vant/issues/8302
interface EventShim {
  new (...args: any[]): {
    $props: {
      onClick?: (...args: any[]) => void;
    };
  };
}

export type WithInstall<T> = EventShim &
  T & {
    install(app: App): void;
  };

export type CustomComponent = Component & { displayName?: string };

export function withInstall<T extends CustomComponent>(
  component: T,
  alias?: string,
) {
  (component as Record<string, unknown>).install = (app: App) => {
    const compName = component.name || component.displayName;
    if (!compName) return;
    app.component(compName, component);
    if (alias) app.config.globalProperties[alias] = component;
  };
  return component as WithInstall<T>;
}

/**
 * 简单实现防抖方法
 *
 * 防抖(debounce)函数在第一次触发给定的函数时，不立即执行函数，而是给出一个期限值(delay)，比如100ms。
 * 如果100ms内再次执行函数，就重新开始计时，直到计时结束后再真正执行函数。
 * 这样做的好处是如果短时间内大量触发同一事件，只会执行一次函数。
 *
 * @param fn 要防抖的函数
 * @param delay 防抖的毫秒数
 * @returns {Function} simpleDebounce
 */
export function simpleDebounce(fn, delay = 100) {
  let timer: any | null = null;
  return () => {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

export function getUrlParams(url: string, key?: string) {
  const aElement = document.createElement('a');
  aElement.setAttribute('href', url);
  if (key) {
    return aElement[key];
  }
  return [
    'hash',
    'host',
    'hostname',
    'href',
    'origin',
    'pathname',
    'port',
    'protocol',
  ].reduce((origin, key) => {
    origin[key] = aElement[key];
    return origin;
  }, {});
}

// 获取后缀名
export function getExtame(path: string): string {
  const fileName = path.toLowerCase();
  const lastIndex = fileName.lastIndexOf('.');
  const suffix = fileName.substring(lastIndex + 1, fileName.length);
  return suffix;
}

export function getPartsOfUrl(url: string) {
  const urlObj = new URL(url);
  const queryParams = urlObj.searchParams; // 获取?后面的查询参数
  const pathname = urlObj.pathname; // 获取路径部分
  // 正则表达式匹配最后一个'/'之后的内容
  const lastSegment = pathname.replace(/.*\//, '');
  const extname = getExtame(lastSegment);
  return { queryParams, lastSegment, extname: extname.toLocaleUpperCase() };
}

export function maskPhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 格式化价格，最多保留四位小数，如果小数点后都是0则取整
 * @param price 需要格式化的价格
 * @returns 格式化后的价格字符串
 */
export function formatPrice(price: number | string): string {
  if (price === null || price === undefined || price === '') {
    return '0';
  }

  const numPrice = typeof price === 'string' ? Number.parseFloat(price) : price;

  // 先保留4位小数
  const formattedPrice = numPrice.toFixed(4);

  // 去除末尾的0
  const trimmedPrice = formattedPrice.replace(/\.?0+$/, '');

  // 如果结果是整数（没有小数点），直接返回
  return trimmedPrice.endsWith('.') ? trimmedPrice.slice(0, -1) : trimmedPrice;
}
