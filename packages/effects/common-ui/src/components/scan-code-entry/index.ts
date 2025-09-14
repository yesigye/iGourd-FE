import type { Form } from '@formily/core';

// ScanCodeEntry.ts — 增强版（连续模式/库存校验/提示音/去抖去重）
import { defineComponent, h, onMounted, ref } from 'vue';

import { useField } from '@formily/vue';
import { ElButton, ElInput } from 'element-plus';

// ====== 服务类型 ======
type InventoryServiceLike = {
  getByBarcode?: (params: {
    barcode: string;
    merchantId: number | string;
    type?: string;
    warehouseId?: number | string;
  }) => Promise<any | { data?: any }>;
  productSearch: (params: {
    keyword: string;
    merchantId: number | string;
    pageNo?: number;
    pageSize?: number;
    type?: string;
    warehouseId?: number | string;
  }) => Promise<{ list: any[] }>;
};

type MatchKey =
  | 'basic_product_id'
  | 'product_code'
  | 'product_id'
  | 'sku_barcode';
type ResolveStrategy = 'first' | 'throw';

// ====== type → 数量字段映射（与 ProductArrayTable 对齐）======
const TYPE_QTY_KEY: Record<string, string> = {
  purchase: 'quantity',
  stock: 'stock_add_quantity',
  physical: 'physical_quantity',
  transfer: 'transfer_quantity',
  return: 'return_quantity',
  spoilage: 'spoilage_quantity',
  receipt: 'enter_quantity',
};

// ====== 内置蜂鸣声（WebAudio 简易实现）======
function beep(kind: 'err' | 'ok', enabled = true) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = kind === 'ok' ? 880 : 220;
    g.gain.value = 0.08;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(
      () => {
        o.stop();
        ctx.close();
      },
      kind === 'ok' ? 90 : 160,
    );
  } catch {}
}

// ====== 去抖/节流 ======
const useDebounce = <T extends (...a: any[]) => any>(fn: T, wait = 120) => {
  let t: any = null;
  return ((...args: any[]) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  }) as T;
};

// ====== 组件 Props ======
type Props = {
  afterAppend?: (result: {
    action: 'append' | 'merge';
    index: number;
    row: any;
  }) => void;
  autoClear?: boolean; // 成功后清空（默认 true）
  autoFocus?: boolean; // 挂载后自动聚焦（默认 true）
  beforeAppend?: (
    row: any,
    ctx: { existsIndex: number; form: Form },
  ) => boolean | Promise<boolean>;
  buttonText?: string;
  dedupeWindowMs?: number; // 短时重复码去重窗口（默认 300ms）

  // —— 扫描交互 —— //
  enterToSubmit?: boolean; // 回车提交（默认 true）
  errorSoundUrl?: string; // 自定义失败音（可选）
  // —— 合并策略 —— //
  incrementStep?: number; // 合并时 +N（默认 1）
  inputDebounceMs?: number; // 连续模式去抖间隔（默认 120ms）
  inputWidth?: number | string;
  InventoryService: InventoryServiceLike;
  // —— 校验/钩子 —— //
  mapProductToRow?: (
    raw: any,
    ctx: { form: Form; qtyKey: string; type?: string },
  ) => Record<string, any>;
  merchantId: number | string;

  mergeBy?: MatchKey[]; // 匹配键优先级（默认 bpid>pid>barcode>code）
  mergeRow?: (
    existing: any,
    incoming: any,
    ctx: { increment: number; qtyKey: string },
  ) => any;
  // —— 提示 & 声音 —— //
  notify?: (type: 'error' | 'success' | 'warning', message: string) => void;

  onMultipleMatch?: (list: any[], keyword: string) => void;
  onNoMatch?: (keyword: string) => void;
  // —— UI —— //
  placeholder?: string;
  quantityField?: string; // 覆盖数量字段（优先于 type）
  resolveStrategy?: ResolveStrategy; // 多结果处理（默认 'first'）
  selectOnFocus?: boolean; // 聚焦时全选（默认 true）
  sound?: boolean; // 是否播放提示音（默认 true）

  submitIntervalMs?: number; // 两次提交最小间隔/节流（默认 80ms，防抖后的再兜底）
  submitOnInput?: boolean; // 连续模式：按输入去抖自动提交（默认 false）
  successSoundUrl?: string; // 自定义成功音（可选）
  targetPath: string; // 目标数组字段，如 'purchase_order_item_model_list'

  type?: string; // purchase/stock/physical/...
  /** 库存校验：返回 true 通过；返回字符串为错误文案 */
  validateStock?: (
    raw: any,
    ctx: { form: Form; increment: number; qtyKey: string; warehouseId?: any },
  ) => boolean | Promise<boolean | string> | string;
  warehousePath?: string; // 从表单取仓库路径（默认 'warehouse_id'）
};

const N = (v: any, d = 0) => (Number.isFinite(+v) ? +v : d);

// ====== 默认映射/合并 ======
const defaultMapper = (raw: any, ctx: { qtyKey: string }) => {
  const row: Record<string, any> = {
    id: undefined,
    product_id: raw?.product_id ?? raw?.basic_product_id ?? raw?.id ?? null,
    basic_product_id: raw?.basic_product_id ?? null,
    product_code: raw?.product_code ?? '',
    major_name: raw?.major_name ?? raw?.product_name ?? '',
    display_major_name:
      raw?.display_major_name ?? raw?.major_name ?? raw?.product_name ?? '',
    sku_barcode: raw?.sku_barcode ?? raw?.product_barcode ?? '',
    major_unit_name: raw?.major_unit_name ?? raw?.product_unit_name ?? '',
    basic_unit_radio: N(raw?.basic_unit_radio, 0),
    cost_price: N(raw?.cost_price, 0),
    remark: '',
    quantity: 0,
  };
  row[ctx.qtyKey] = 1;
  // 盘点/库存展示
  if (
    raw?.stock_total_quantity_message ||
    raw?.sale_warehouse_product_stock_quantity_message
  ) {
    row.origin_quantity_message =
      raw.stock_total_quantity_message ??
      raw.sale_warehouse_product_stock_quantity_message;
  }
  return row;
};
const defaultMergeRow = (
  existing: any,
  incoming: any,
  ctx: { increment: number; qtyKey: string },
) => {
  const cur = { ...existing };
  cur[ctx.qtyKey] = N(cur[ctx.qtyKey], 0) + Math.max(1, ctx.increment);
  return cur;
};

// ====== 组件实现 ======
export default defineComponent<Props>({
  name: 'ScanCodeEntry',
  props: [
    'merchantId',
    'targetPath',
    'warehousePath',
    'type',
    'quantityField',
    'InventoryService',
    'enterToSubmit',
    'submitOnInput',
    'inputDebounceMs',
    'submitIntervalMs',
    'dedupeWindowMs',
    'autoClear',
    'autoFocus',
    'selectOnFocus',
    'incrementStep',
    'mergeBy',
    'resolveStrategy',
    'mapProductToRow',
    'mergeRow',
    'validateStock',
    'beforeAppend',
    'afterAppend',
    'onMultipleMatch',
    'onNoMatch',
    'notify',
    'sound',
    'successSoundUrl',
    'errorSoundUrl',
    'placeholder',
    'buttonText',
    'inputWidth',
  ] as unknown as undefined,
  setup(props) {
    const host = useField();
    const form = host.value.form as Form;

    const inputVal = ref('');
    const inputRef = ref<any>(null);
    const loading = ref(false);
    const lastSubmitAt = ref(0);
    const lastCode = ref('');
    const lastCodeAt = ref(0);

    const qtyKey = () =>
      props.quantityField?.trim?.()
        ? String(props.quantityField)
        : TYPE_QTY_KEY[(props.type || 'purchase').toLowerCase()] || 'quantity';
    const getWarehouseId = () => {
      try {
        return form?.getValuesIn(props.warehousePath || 'warehouse_id');
      } catch {
        return undefined;
      }
    };
    const ensureArray = () => {
      const v = form.getValuesIn(props.targetPath);
      if (!Array.isArray(v)) {
        form.setValuesIn(props.targetPath, []);
        return [];
      }
      return v as any[];
    };
    const findExistingIndex = (arr: any[], inc: any, keys: MatchKey[]) =>
      arr.findIndex((it) => keys.some((k) => !!inc[k] && inc[k] === it[k]));

    const playSound = (kind: 'err' | 'ok') => {
      const enabled = props.sound !== false;
      const url = kind === 'ok' ? props.successSoundUrl : props.errorSoundUrl;
      if (url && enabled) {
        const audio = new Audio(url);
        audio.play?.().catch?.(() => {});
      } else {
        beep(kind, enabled);
      }
    };

    // —— 搜索（优先条码直查）——
    const doSearch = async (keyword: string) => {
      if (props.InventoryService.getByBarcode) {
        try {
          const r = await props.InventoryService.getByBarcode({
            merchantId: props.merchantId,
            barcode: keyword,
            warehouseId: getWarehouseId(),
            type: props.type,
          });
          const data = r?.data ?? r;
          if (data) return [data];
        } catch {}
      }
      const res = await props.InventoryService.productSearch({
        merchantId: props.merchantId,
        keyword,
        warehouseId: getWarehouseId(),
        type: props.type,
        pageNo: 1,
        pageSize: 20,
      });
      return Array.isArray(res?.list) ? res.list : [];
    };

    const appendOrMerge = async (row: any) => {
      const arr = ensureArray();
      const idx = findExistingIndex(
        arr,
        row,
        props.mergeBy || [
          'basic_product_id',
          'product_id',
          'sku_barcode',
          'product_code',
        ],
      );
      const okBefore = async (actionIndex: number) =>
        (await props.beforeAppend?.(row, { form, existsIndex: actionIndex })) ??
        true;
      if (idx > -1) {
        if (!(await okBefore(idx))) return 'cancel';
        const merged = (props.mergeRow || defaultMergeRow)(arr[idx], row, {
          qtyKey: qtyKey(),
          increment: Math.max(1, props.incrementStep ?? 1),
        });
        const next = ensureArray();
        next.splice(idx, 1, merged);
        form.setValuesIn(props.targetPath, next);
        props.afterAppend?.({ index: idx, action: 'merge', row: merged });
        return 'merged';
      } else {
        if (!(await okBefore(-1))) return 'cancel';
        const next = ensureArray();
        next.push(row);
        form.setValuesIn(props.targetPath, next);
        props.afterAppend?.({ index: next.length - 1, action: 'append', row });
        return 'appended';
      }
    };

    const handleSubmitCore = async (code: string) => {
      // 节流：最小提交间隔
      const minGap = Math.max(0, props.submitIntervalMs ?? 80);
      const now = Date.now();
      if (now - lastSubmitAt.value < minGap) return;
      lastSubmitAt.value = now;

      // 去重：短时重复相同码
      const dedupeWin = Math.max(0, props.dedupeWindowMs ?? 300);
      if (code && code === lastCode.value && now - lastCodeAt.value < dedupeWin)
        return;
      lastCode.value = code;
      lastCodeAt.value = now;

      if (!code) return;
      loading.value = true;
      try {
        const list = await doSearch(code);
        if (list.length === 0) {
          props.onNoMatch?.(code);
          props.notify?.('warning', 'No match');
          playSound('err');
          return;
        }
        if (list.length > 1 && props.resolveStrategy === 'throw') {
          props.onMultipleMatch?.(list, code);
          playSound('err');
          return;
        }
        const raw = list[0];
        // 库存校验（可选）
        if (props.validateStock) {
          const r = await props.validateStock(raw, {
            form,
            qtyKey: qtyKey(),
            increment: Math.max(1, props.incrementStep ?? 1),
            warehouseId: getWarehouseId(),
          });
          if (r !== true) {
            const msg = typeof r === 'string' ? r : 'Stock invalid';
            props.notify?.('error', msg);
            playSound('err');
            return;
          }
        }
        // 映射 + 合并/追加
        const row = (
          props.mapProductToRow ||
          ((x: any) => defaultMapper(x, { qtyKey: qtyKey() }))
        )(raw, { form, type: props.type, qtyKey: qtyKey() });
        const res = await appendOrMerge(row);
        if (res === 'cancel') return;
        playSound('ok');
        if (props.autoClear !== false) inputVal.value = '';
      } catch (error: any) {
        props.notify?.('error', error?.message || 'Scan failed');
        playSound('err');
      } finally {
        loading.value = false;
      }
    };

    const handleSubmit = () =>
      handleSubmitCore(String(inputVal.value || '').trim());
    const debouncedSubmit = useDebounce(
      handleSubmit,
      props.inputDebounceMs ?? 120,
    );

    const onInput = () => {
      if (props.submitOnInput) debouncedSubmit();
    };
    const onKeyup = (e: KeyboardEvent) => {
      if (props.enterToSubmit === false) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        debouncedSubmit();
      }
    };

    onMounted(() => {
      if (props.autoFocus !== false) {
        setTimeout(() => {
          try {
            // ElementPlus 输入框实例有 focus 方法，或取 $el.querySelector('input')
            inputRef.value?.focus?.();
            if (props.selectOnFocus !== false) {
              const el: HTMLInputElement | null =
                (inputRef.value?.input as HTMLInputElement) ||
                (inputRef.value?.$el?.querySelector?.('input') ?? null);
              el?.select?.();
            }
          } catch {}
        }, 0);
      }
    });

    return () =>
      h('div', { style: 'display:flex; gap:8px; align-items:center;' }, [
        h(ElInput as any, {
          ref: inputRef,
          modelValue: inputVal.value,
          placeholder: props.placeholder || '扫码/输入条码后回车',
          clearable: true,
          disabled: loading.value,
          style: { width: props.inputWidth ?? '320px' },
          onKeyup,
          onInput,
          'onUpdate:modelValue': (v: any) => (inputVal.value = v),
        }),
        h(
          ElButton as any,
          { type: 'primary', loading: loading.value, onClick: debouncedSubmit },
          { default: () => props.buttonText || '加入' },
        ),
      ]);
  },
});
