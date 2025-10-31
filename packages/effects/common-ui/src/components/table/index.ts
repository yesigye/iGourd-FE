// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
let tableFn;

export function useTable(options: any) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return tableFn(options);
}

export function setupTable(fn: any) {
  tableFn = fn;
}
