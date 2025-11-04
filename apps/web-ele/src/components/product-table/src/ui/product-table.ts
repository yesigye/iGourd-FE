/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Ctx } from '../types';

import { defineComponent, h, provide, watch } from 'vue';

import {
  ArrayTable,
  composeExport,
  observable,
  RecursionField,
  useField,
  useFieldSchema,
  useForm,
} from '@igourd/common-ui';

import { getMode, registerMode } from '../core/registry';
import { createQuantityCalculationEffect } from '../effects/quantity-calculation-effect';
import { InventoryMode } from '../modes/inventory';
import { PhysicalMode } from '../modes/physical';
import { PurchaseMode } from '../modes/purchase';
import { ReceiptMode } from '../modes/receipt';
import { ReturnMode } from '../modes/return';
import { SpoilageMode } from '../modes/spoilage';
// import { StockMode } from '../modes/stock';
import { TransferMode } from '../modes/transfer';

import { TransferDisabledMode } from '../modes/transfer-disabled';
import { ProductCell, QuantityCell, UnitCell } from './components';
import SkuSelect from './components/sku-select.vue';
import { buildSchema } from './schema-builder';

registerMode(PurchaseMode);
registerMode(TransferMode);
registerMode(ReceiptMode);
registerMode(PhysicalMode);
registerMode(SpoilageMode);
registerMode(ReturnMode);
registerMode(InventoryMode);
registerMode(TransferDisabledMode);


export const InnerProductTable = defineComponent({
  name: 'ProductTable',
  props: {
    mode: { type: String, required: true },
    warehouseId: [String, Number],
    canOperate: { type: Boolean, default: true },
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
    const form = useForm();
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
    const filedSchema = useFieldSchema();
    const canOperate = observable({ value: props.canOperate });
    // build schema
    const schema = buildSchema(mode.columns(ctx), ctx, {
      canOperate,
      tableProps: {
        scrollbarAlwaysOn: true,
      },
    });
    watch(
      () => props.canOperate,
      (value) => {
        form.value.setFieldState('*.operations', (state) => {
          state.visible = value;
        });
      },
      {
        immediate: true,
      },
    );
    // @ts-ignore
    filedSchema.value.setItems(schema.items);
    // @ts-ignore
    filedSchema.value.setProperties(schema.properties);

    form.value.addEffects('0094ff', () => {
      createQuantityCalculationEffect(
        field.value.props.name as string,
        ctx,
        mode,
      );
    });

    return () =>
      h(
        ArrayTable as any,
        {
          scrollbarAlwaysOn: true,
        },
        {
          default: () =>
            h(RecursionField, {
              schema: filedSchema.value,
            }),
        },
      );
  },
});
export default InnerProductTable;

export const ProductTable = composeExport(InnerProductTable, {
  ProductCell,
  QuantityCell,
  SkuSelect,
  UnitCell,
});
