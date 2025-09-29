export function isDef(val: any) {
  return (
    val !== undefined && val !== null && val !== 'null' && val !== 'undefined'
  );
}
// 千分位分隔符
export function thousandSeparator(value: string) {
  if (!isDef(value)) {
    return value;
  }
  return value.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
}
