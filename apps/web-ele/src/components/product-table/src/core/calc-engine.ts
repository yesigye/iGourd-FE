import type { LineItem, VATMode } from '../types';

const toNum = (v: any) => (v === null || v === '' || Number.isNaN(+v) ? 0 : +v);
const round2 = (n: number) => Math.round(n * 100) / 100;

export function calcLineAmounts(
  line: LineItem,
  vatMode: VATMode = 'NOT_APPLICATION',
): LineItem {
  const qty = toNum(line.quantity_base ?? line.display_quantity);
  const price = toNum(line.unit_price);
  const discAmt = toNum(line.discount_amount);
  const discPct = toNum(line.discount_percentage);
  const vatRate = toNum(line.vat_rate);

  const discount = discAmt || (discPct ? price * qty * discPct : 0);
  const subtotal = Math.max(price * qty - discount, 0);

  let total = subtotal;
  let vat = 0;
  if (vatMode === 'VAT_EXCLUSIVE') {
    vat = subtotal * vatRate;
    total = subtotal + vat;
  } else if (vatMode === 'VAT_INCLUSIVE') {
    const incVat = price * qty - discount;
    const base = vatRate ? incVat / (1 + vatRate) : incVat;
    vat = incVat - base;
    total = incVat;
  }

  return {
    ...line,
    subtotal_amount: round2(subtotal),
    vat_amount: round2(vat),
    total_amount: round2(total),
  };
}
