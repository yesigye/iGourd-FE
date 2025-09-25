import type { Ctx } from '../types';

import { defineComponent, h, onBeforeUnmount, provide } from 'vue';

import { composeExport, RecursionField, useField } from '@igourd/common-ui';

import { getMode, registerMode } from '../core/registry';
import { PhysicalMode } from '../modes/physical';
import { PurchaseMode } from '../modes/purchase';
import { ReceiptMode } from '../modes/receipt';
import { SpoilageMode } from '../modes/spoilage';
import { TransferMode } from '../modes/transfer';
import { ProductCell, QuantityCell, UnitCell } from './components';
import SkuSelect from './components/sku-select.vue';
import { buildSchema } from './schema-builder';

registerMode(PurchaseMode);
registerMode(TransferMode);
registerMode(ReceiptMode);
registerMode(PhysicalMode);
registerMode(SpoilageMode);

// function addrToIndex(addr: any): number {
//   const segs = addr?.segments || [];
//   const idx =
//     typeof segs.at?.(-2) === 'number'
//       ? segs.at(-2)
//       : segs.findLast?.((s: any) => typeof s === 'number');
//   return typeof idx === 'number' ? idx : -1;
// }

export const InnerProductTable = defineComponent({
  name: 'ProductTable',
  props: {
    mode: { type: String, required: true },
    warehouseId: [String, Number],
    currencySymbol: String,
    vatMode: { type: String, default: 'NOT_APPLICATION' },
    capabilities: { type: Array, default: () => [] },
    // flags
    isReceiptMode: { type: Boolean, default: false },
    purchaseOrderSelected: { type: Boolean, default: false },
    // services
    fetchProductByBarcode: Function,
    fetchStockBySku: Function,
    listSkusByProduct: Function,
    searchProducts: Function,
  } as any,
  setup(props: any) {
    const field = useField();
    const mode = getMode(props.mode);
    if (!mode) throw new Error(`Unknown ProductTable mode: ${props.mode}`);
    const ctx: Ctx = {
      mode: props.mode,
      warehouseId: props.warehouseId,
      vatMode: props.vatMode,
      currencySymbol: props.currencySymbol ?? '',
      capabilities: props.capabilities as any,
      services: {
        fetchProductByBarcode: props.fetchProductByBarcode as any,
        fetchStockBySku: props.fetchStockBySku as any,
        listSkusByProduct: props.listSkusByProduct as any,
        searchProducts: props.searchProducts as any,
      },
      flags: {
        isReceiptMode: props.isReceiptMode,
        purchaseOrderSelected: props.purchaseOrderSelected,
      },
    };
    provide('ptCtx', ctx);

    // build schema
    const schema = buildSchema(mode.columns(ctx), ctx, {
      tableProps: {
        scrollbarAlwaysOn: true,
      },
    });
    // function dispatch(evt: ProductTableEvent) {
    //   // @ts-ignore
    //   const data = (field.value.form?.values?.[field.value.props.name] ??
    //     []) as any[];
    //   // @ts-ignore
    //   const next = mode.handleEvent(evt, data, ctx);
    //   if (next instanceof Promise) {
    //     next.then((v) =>
    //       field.value.form?.setValuesIn(field.value.props.name, v),
    //     );
    //   } else {
    //     field.value.form?.setValuesIn(field.value.props.name, next);
    //   }
    // }
    const base = String(field.value.address);
    const effectId = `PT-EFX-${base}`; // 保证唯一，避免重复注册

    // field.value.form?.addEffects(effectId, () => {
    //   // 输入态：本地计算
    //   onFieldInputValueChange(`${base}.*.quantity`, (f: any) => {
    //     const i = addrToIndex(f.address);
    //     if (i >= 0) {
    //       // 注意：有的适配层把输入值放在 f.inputValue 或 f.inputValues，按你们库来
    //       const val =
    //         (f as any).inputValues ?? (f as any).inputValue ?? f.value;
    //       dispatch({ type: 'QTY_CHANGE_LOCAL', index: i, value: val });
    //     }
    //   });

    //   // 提交态：远端校验/补全
    //   onFieldValueChange(`${base}.*.display_quantity`, (f: any) => {
    //     const i = addrToIndex(f.address);
    //     if (i >= 0)
    //       dispatch({ type: 'QTY_CHANGE_COMMIT', index: i, value: f.value });
    //   });

    //   // 单位切换
    //   onFieldValueChange(`${base}.*.unit_code`, (f: any) => {
    //     const i = addrToIndex(f.address);
    //     if (i >= 0) dispatch({ type: 'UNIT_CHANGE', index: i, unit: f.value });
    //   });

    //   // 价格变更
    //   onFieldValueChange(`${base}.*.unit_price`, (f: any) => {
    //     const i = addrToIndex(f.address);
    //     if (i >= 0)
    //       dispatch({ type: 'PRICE_CHANGE', index: i, value: f.value });
    //   });
    // });

    // 可选：组件卸载时清理（避免热更/多实例重复注册）
    onBeforeUnmount(() => {
      field.value.form?.removeEffects?.(effectId);
    });

    return () =>
      h(RecursionField, {
        schema,
        name: field.value.props.name,
      });
  },
});
export default InnerProductTable;

export const ProductTable = composeExport(InnerProductTable, {
  ProductCell,
  QuantityCell,
  SkuSelect,
  UnitCell,
});
