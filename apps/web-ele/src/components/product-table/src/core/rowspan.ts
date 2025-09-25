import type { LineItem } from '../types';

export interface SpanMethodProps {
  row: LineItem;
  column: { property?: string };
  rowIndex: number;
  columnIndex: number;
}

export function buildSpanMethod(
  by: Array<{ byField: keyof LineItem; columnKey: string }>,
) {
  return (props: SpanMethodProps, data: LineItem[]) => {
    const colKey = props.column?.property;
    const rule = by.find((r) => r.columnKey === colKey);
    if (!rule) return undefined;

    const key = data[props.rowIndex]?.[rule.byField];
    if (key === null) return undefined;

    // group contiguous rows with same key
    let start = props.rowIndex;
    while (start > 0 && data[start - 1]?.[rule.byField] === key) start--;
    let end = props.rowIndex;
    while (end + 1 < data.length && data[end + 1]?.[rule.byField] === key)
      end++;

    return props.rowIndex === start
      ? { rowspan: end - start + 1, colspan: 1 }
      : { rowspan: 0, colspan: 0 };
  };
}
