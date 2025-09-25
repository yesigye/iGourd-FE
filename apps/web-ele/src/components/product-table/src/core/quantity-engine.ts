import type { LineItem } from '../types';

const toNum = (v: any) => (v === null || v === '' || Number.isNaN(+v) ? 0 : +v);
const clamp0 = (n: number) => Math.max(n, 0);
const round = (n: number, p = 8) => Math.round(n * 10 ** p) / 10 ** p;

export function toBaseQuantity(line: LineItem): LineItem {
  const ratio = Math.max(toNum(line.basic_unit_radio) || 1, 1);
  const disp = toNum(line.display_quantity);
  const base = line.unit_code === 'major' ? disp * ratio : disp;
  return { ...line, quantity_base: round(clamp0(base)) };
}

export function fromBaseQuantity(line: LineItem): LineItem {
  const ratio = Math.max(toNum(line.basic_unit_radio) || 1, 1);
  const base = toNum(line.quantity_base);
  const disp = line.unit_code === 'major' ? base / ratio : base;
  return { ...line, display_quantity: round(clamp0(disp)) };
}

export function handleQuantityChangeLocal(
  line: LineItem,
  opts: { keepBase?: boolean } = {},
): LineItem {
  const after = opts.keepBase ? fromBaseQuantity(line) : toBaseQuantity(line);
  return after;
}
