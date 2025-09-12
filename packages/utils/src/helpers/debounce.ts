/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param delay 防抖时间
 * @param immediate 是否立即执行
 * @param resultCallback 回调函数
 * @returns 防抖后的函数
 * @author CHENYI
 */
function debounce(fn: Function, delay: number, immediate = false, resultCallback?: Function) {
  let timer;
  let isInvoke = false;
  const _debounce = function (this: any, ...args: any[]) {
    return new Promise((resolve, reject) => {
      try {
        if (timer) clearTimeout(timer);
        // 获取返回值
        let res = undefined;
        // 第一次操作立即执行
        if (immediate && !isInvoke) {
          res = fn.apply(this, args);
          if (resultCallback) resultCallback(res);
          resolve(res);
          isInvoke = true;
          return;
        }
        timer = setTimeout(() => {
          // 箭头函数没有arguments，所以使用apply绑定arguments
          // [event] 将event对象作为参数传递给fn
          res = fn.apply(this, args);
          if (resultCallback) resultCallback(res);
          resolve(res);
          timer = null;
          isInvoke = false; // 执行完函数后，将定时器变量设置为null
        }, delay);
      } catch (error) {
        reject(error);
      }
    });
  };
  // 给_debounce函数添加一个取消功能
  _debounce.cancel = function () {
    if (timer) clearTimeout(timer);
    timer = null;
    isInvoke = false;
  };
  return _debounce;
}
export { debounce };
