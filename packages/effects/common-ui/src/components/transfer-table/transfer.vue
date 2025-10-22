<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch, watchEffect } from 'vue';
import { $t } from '@igourd/locales';

import { ArrowRight, Filter } from '@igourd/icons';

import {
  ElButton,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElMessage,
  ElOption,
  ElPagination,
  ElPopover,
  ElSelect,
  ElTable,
  ElTableColumn,
} from 'element-plus';

/** ****************************
 * Types
 */
export type KV = Record<string, any>;

export interface OptionItem {
  label: string;
  value: any;
}

export interface Column<T = KV> {
  label: string;
  prop: keyof T | string;
  width?: number | string;
  align?: 'center' | 'left' | 'right';
  sortable?: 'custom' | boolean;
  formatter?: (row: T, value: any, index: number) => any;
  filter?: {
    multiple?: boolean;
    options?: OptionItem[];
    placeholder?: string;
    remoteMethod?: (keyword: string) => Promise<OptionItem[]>;
    type: 'input' | 'remote-select' | 'select';
  };
}

export interface FetchParams {
  page_num: number;
  page_size: number;
  keyword?: string;
  /** Popover filters */
  filters?: KV;
  /** Column header filters */
  columnFilters?: KV;
  sort?: { order: 'ascending' | 'descending' | null; prop: string };
  /** Selected ids to query the right table */
  ids?: Array<number | string>;
  /** For excluding ids from left */
  excludeIds?: Array<number | string>;
}

export interface PageResult<T = KV> {
  list: T[];
  total: number;
}

export interface TopFilterField {
  key: string;
  label: string;
  type: 'input' | 'remote-select' | 'select';
  placeholder?: string;
  multiple?: boolean;
  options?: OptionItem[];
  remoteMethod?: (keyword: string) => Promise<OptionItem[]>;
}

/** ****************************
 * Props
 */
const props = withDefaults(
  defineProps<{
    // top-bottom 上线布局   left-right 左右布局 默认
    layout:string,
    // 选择数据的模式 select左边勾选直接添加(默认的)   move 通过中间按钮添加
    selectMode:string,
    columns: Column[];
    excludeSelectedFromLeft?: boolean;
    fetchLeft: (
      params: FetchParams,
    ) => Promise<
      KV[] | PageResult | { count?: number; items: KV[]; total?: number }
    >;
    fetchRight?: (
      params: FetchParams,
    ) => Promise<
      KV[] | PageResult | { count?: number; items: KV[]; total?: number }
    >;
    leftActionColumn?: { label?: string; width?: number };
    leftTitle?: string;
    modelValue: KV[];
    pageSize?: number;
    rightTitle?: string;
    rowKey: string;
    searchPlaceholder?: string;
    topFilterFields?: TopFilterField[];
  }>(),
  {
    layout:"left-right",
    selectMode:'select',
    modelValue: () => [],
    leftTitle: $t('transfer.optional'),
    rightTitle: $t('transfer.selected'),
    pageSize: 10,
    searchPlaceholder: $t('transfer.enter-keyword-to-search'),
    excludeSelectedFromLeft: true,
    topFilterFields: () => [],
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: KV[]): void;
  (e: 'change', v: KV[]): void;
}>();

/** ****************************
 * Local state
 */
const keyword = ref('');
const searchPlaceholder = computed(() => props.searchPlaceholder);

// top popover filters
const topFilterFields = computed(() => props.topFilterFields);
const topFilters = reactive<KV>({});
const topRemoteOptions = reactive<Record<string, OptionItem[]>>({});
const topRemoteLoading = reactive<Record<string, boolean>>({});

// header column filters
const columnFilters = reactive<Record<string, any>>({});
const columnRemoteOptions = reactive<Record<string, OptionItem[]>>({});
const columnRemoteLoading = reactive<Record<string, boolean>>({});

// selection and value
const value = ref<KV[]>([...props.modelValue]);
watch(
  () => props.modelValue,
  (v) => {
    rightData.value = [...v];
  },
);
const valueIds = computed(() => value.value.map((r) => r[props.rowKey]));

function setValue(next: KV[]) {
  value.value = next;
  emit('update:modelValue', next);
  emit('change', next);
}

// Left table selection (current page)
const leftSelection = ref<KV[]>([]);
const leftTableRef = ref<any>();

/** ****************************
 * Pager helper (page_num/page_size)
 */
function usePager(
  fetcher: (p: FetchParams) => Promise<any>,
  getExtra: () => Partial<FetchParams> = () => ({}),
) {
  const pageNum = ref(1);
  const pageSize = ref(props.pageSize);
  const total = ref(0);
  const data = ref<KV[]>([]);
  const loading = ref(false);

  const getParams = (): FetchParams => ({
    page_num: pageNum.value,
    page_size: pageSize.value,
    keyword: debouncedKeyword.value,
    filters: topFilters,
    columnFilters,
    ...getExtra(),
  });

  async function refresh() {
    loading.value = true;
    try {
      const raw = await fetcher(getParams());
      const { list, total: ttl } = normalizePageResult(raw);
      data.value = list;
      total.value = ttl;
      await nextTick();
    } catch (error: any) {
      ElMessage.error(error?.message || $t('transfer.failed-to-load'));
      data.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  function resetToFirstPageThenRefresh() {
    pageNum.value = 1;
    refresh();
  }

  return {
    pageNum,
    pageSize,
    total,
    data,
    loading,
    refresh,
    resetToFirstPageThenRefresh,
    getParams,
  };
}

/** ****************************
 * debounce keyword
 */
const debouncedKeyword = ref('');
let keywordTimer: any;
watch(
  keyword,
  (v) => {
    clearTimeout(keywordTimer);
    keywordTimer = setTimeout(() => {
      debouncedKeyword.value = v;
      leftResetToFirstPageThenRefresh();
    }, 300);
  },
  { immediate: false },
);

/** ****************************
 * LEFT pager
 */
const {
  pageNum: leftPageNum,
  pageSize: leftPageSize,
  total: leftTotal,
  data: leftData,
  loading: leftLoading,
  refresh: leftRefresh,
  resetToFirstPageThenRefresh: leftResetToFirstPageThenRefresh,
  getParams: leftGetParams,
} = usePager(async (params) => {
  const real = { ...params } as FetchParams;
  if (props.excludeSelectedFromLeft && valueIds.value.length > 0) {
    (real as any).excludeIds = valueIds.value;
  }
  return props.fetchLeft(real);
});

/** ****************************
 * RIGHT pager (query by ids)
 */
const {
  pageNum: rightPageNum,
  pageSize: rightPageSize,
  total: rightTotal,
  data: rightData,
  loading: rightLoading,
  refresh: rightRefresh,
  resetToFirstPageThenRefresh: rightResetToFirstPageThenRefresh,
} = usePager(async (params) => {
  if (props.fetchRight) {
    const raw = await props.fetchRight({ ...params, ids: valueIds.value });
    return normalizePageResult(raw);
  }
  const start = (params.page_num - 1) * params.page_size;
  const end = start + params.page_size;
  return { list: value.value.slice(start, end), total: value.value.length };
});

// 列内/顶部筛选变化时刷新
watch(
  () => ({
    k: debouncedKeyword.value,
    tf: JSON.stringify(topFilters),
    cf: JSON.stringify(columnFilters),
  }),
  () => leftResetToFirstPageThenRefresh(),
);

watchEffect(() => {
  leftSelection.value = [];
  leftRefresh();
  rightRefresh();
});

/** ****************************
 * Result normalizer
 */
function normalizePageResult(res: any): { list: any[]; total: number } {
  if (Array.isArray(res)) return { list: res, total: res.length };
  if (Array.isArray(res?.list))
    return {
      list: res.list,
      total:
        Number(res.total ?? res.count ?? res.list.length) || res.list.length,
    };
  if (Array.isArray(res?.items))
    return {
      list: res.items,
      total:
        Number(res.total ?? res.count ?? res.items.length) || res.items.length,
    };
  console.warn('[TransferTable] unexpected PageResult shape:', res);
  return { list: [], total: 0 };
}

/** ****************************
 * Remote option loaders
 */
async function loadTopRemoteOptions(f: TopFilterField, q: string) {
  const key = f.key;
  if (!f.remoteMethod) return;
  topRemoteLoading[key] = true;
  try {
    topRemoteOptions[key] = await f.remoteMethod(q);
  } finally {
    topRemoteLoading[key] = false;
  }
}

async function loadColumnRemoteOptions(col: Column, q: string) {
  const key = col.prop as string;
  if (!col.filter?.remoteMethod) return;
  columnRemoteLoading[key] = true;
  try {
    columnRemoteOptions[key] = await col.filter.remoteMethod(q);
  } finally {
    columnRemoteLoading[key] = false;
  }
}

/** ****************************
 * Helpers & actions
 */
function resetTopFilters() {
  Object.keys(topFilters).forEach((k) => delete topFilters[k]);
}

function clearAll() {
  keyword.value = '';
  resetTopFilters();
  Object.keys(columnFilters).forEach((k) => delete columnFilters[k]);
  leftResetToFirstPageThenRefresh();
}

function renderCell(col: Column, row: KV, index: number) {
  const val = row[col.prop as string];
  return col.formatter ? col.formatter(row, val, index) : val;
}

function leftRowClass({ row }: { row: KV }) {
  if (!props.excludeSelectedFromLeft) return '';
  return valueIds.value.includes(row[props.rowKey])
    ? 'bg-gray-50 text-gray-400'
    : '';
}

function leftSelectable(row: KV) {
  return !valueIds.value.includes(row[props.rowKey]);
}

function uniqByKey(arr: KV[], key: string) {
  const map = new Map<any, KV>();
  arr.forEach((r) => map.set(r[key], r));
  return [...map.values()];
}

function addRows(rows: KV[]) {
  if (!rows?.length) return;
  const merged = uniqByKey([...value.value, ...rows], props.rowKey);
  setValue(merged);
  leftSelection.value = [];
  leftRefresh();
}

function removeRow(row: KV) {
  const id = row[props.rowKey];
  const next = value.value.filter((r) => r[props.rowKey] !== id);
  setValue(next);
}
// 左边选择事件
function leftSelectionChange(rows:KV[]){
  leftSelection.value = rows
  if(props.selectMode === 'select'){
    addRows(rows)
  }
}

// expose refresh for parent if needed
defineExpose({ leftRefresh, rightRefresh });
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Top bar: search + popover filters + selected counter -->
    <div class="flex items-center gap-2">
      <ElInput
        v-model="keyword"
        :placeholder="searchPlaceholder"
        class="!w-[360px]"
        clearable
        @keyup.enter="leftRefresh()"
      >
        <template #append>
          <ElButton :loading="leftLoading" @click="leftRefresh()">
            {{ $t('transfer.search') }}
          </ElButton>
        </template>
      </ElInput>

      <!-- 顶部可选的高级筛选（保留 Popover，仅针对顶部，不影响列内筛选） -->
      <ElPopover placement="bottom-start" trigger="click" width="420">
        <template #reference>
          <ElButton text :icon="Filter">{{ $t('transfer.filter') }}</ElButton>
        </template>
        <div class="space-y-2">
          <ElForm label-width="96px" :model="topFilters">
            <template v-for="f in topFilterFields" :key="f.key as string">
              <ElFormItem :label="f.label">
                <ElInput
                  v-if="f.type === 'input'"
                  v-model="topFilters[f.key]"
                  :placeholder="f.placeholder ||  $t('transfer.enter-keyword')"
                  clearable
                />
                <ElSelect
                  v-else-if="f.type === 'select'"
                  v-model="topFilters[f.key]"
                  filterable
                  clearable
                  :multiple="f.multiple"
                  :placeholder="f.placeholder || $t('transfer.please-select')"
                  class="w-full"
                >
                  <ElOption
                    v-for="opt in f.options || []"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </ElSelect>
                <ElSelect
                  v-else-if="f.type === 'remote-select'"
                  v-model="topFilters[f.key]"
                  filterable
                  remote
                  clearable
                  :multiple="f.multiple"
                  :remote-method="(q: string) => loadTopRemoteOptions(f, q)"
                  :loading="topRemoteLoading[f.key as string]"
                  :placeholder="f.placeholder || $t('transfer.search-options')"
                  class="w-full"
                >
                  <ElOption
                    v-for="opt in topRemoteOptions[f.key as string] || []"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </ElSelect>
              </ElFormItem>
            </template>
          </ElForm>
          <div class="flex justify-end gap-2">
            <ElButton size="small" @click="resetTopFilters">{{ $t('transfer.reset') }}</ElButton>
            <ElButton
              size="small"
              type="primary"
              @click="leftResetToFirstPageThenRefresh()"
            >
              {{ $t('transfer.apply') }}
            </ElButton>
          </div>
        </div>
      </ElPopover>

      <ElButton text @click="clearAll">{{ $t('transfer.reset') }}</ElButton>
      <div class="flex-1"></div>
      <div class="font-medium text-blue-600">
        {{ $t('transfer.items-selected',{num:valueIds.length}) }}
      </div>
    </div>

    <div :class="['grid','gap-3',layout ==='top-bottom'?'grid-cols-1':'grid-cols-[1fr_auto_1fr]']">
      <!-- LEFT: available list -->
      <div class="flex flex-col overflow-hidden rounded-xl border">
        <div
          class="border-b bg-[var(--el-fill-color-light)] px-3 py-2 font-medium"
        >
          {{ leftTitle }}
        </div>

        <ElTable
          ref="leftTableRef"
          v-loading="leftLoading"
          :data="leftData || []"
          border
          height="420"
          :row-key="props.rowKey"
          :reserve-selection="true"
          @selection-change="leftSelectionChange"
          :row-class-name="leftRowClass"
        >
          <!-- 选择列：不显示“本页全选”复选框 -->
          <ElTableColumn
            type="selection"
            width="48"
            :selectable="leftSelectable"
          >
            <template #header>
              <span></span>
            </template>
          </ElTableColumn>

          <!-- 动态列：表头下追加一行筛选控件（非 Popover） -->
          <template v-for="col in columns" :key="col.prop as string">
            <ElTableColumn
              :prop="col.prop as string"
              :label="col.label"
              :width="col.width as any"
              :align="col.align || 'left'"
              :sortable="col.sortable || false"
            >
              <template #header>
                <div class="flex flex-col gap-1">
                  <span class="truncate">{{ col.label }}</span>
                  <div v-if="col.filter">
                    <!-- input filter -->
                    <ElInput
                      v-if="col.filter?.type === 'input'"
                      v-model="columnFilters[col.prop as string]"
                      size="small"
                      :placeholder="col.filter?.placeholder || $t('transfer.enter-keyword')"
                      clearable
                      @input="leftResetToFirstPageThenRefresh()"
                      @clear="leftResetToFirstPageThenRefresh()"
                    />
                    <!-- static select filter -->
                    <ElSelect
                      v-else-if="col.filter?.type === 'select'"
                      v-model="columnFilters[col.prop as string]"
                      filterable
                      clearable
                      :multiple="col.filter?.multiple"
                      class="w-full"
                      size="small"
                      @change="leftResetToFirstPageThenRefresh()"
                      @clear="leftResetToFirstPageThenRefresh()"
                    >
                      <ElOption
                        v-for="opt in col.filter?.options || []"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                      />
                    </ElSelect>
                    <!-- remote select filter -->
                    <ElSelect
                      v-else-if="col.filter?.type === 'remote-select'"
                      v-model="columnFilters[col.prop as string]"
                      filterable
                      remote
                      clearable
                      :multiple="col.filter?.multiple"
                      :remote-method="
                        (q: string) => loadColumnRemoteOptions(col, q)
                      "
                      :loading="columnRemoteLoading[col.prop as string]"
                      class="w-full"
                      size="small"
                      @change="leftResetToFirstPageThenRefresh()"
                      @clear="leftResetToFirstPageThenRefresh()"
                    >
                      <ElOption
                        v-for="opt in columnRemoteOptions[col.prop as string] ||
                        []"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                      />
                    </ElSelect>
                  </div>
                </div>
              </template>
              <template #default="scope">
                <span>{{ renderCell(col, scope.row, scope.$index) }}</span>
              </template>
            </ElTableColumn>
          </template>

          <ElTableColumn
            v-if="leftActionColumn"
            :label="leftActionColumn.label"
            :width="leftActionColumn.width || 100"
          >
            <template #default="{ row }">
              <slot name="left-row-action" :row="row">
                <ElButton type="primary" link @click="addRows([row])">
                  {{}}
                </ElButton>
              </slot>
            </template>
          </ElTableColumn>
        </ElTable>

        <div class="border-t px-3 py-2">
          <ElPagination
            background
            layout="prev, pager, next, sizes, jumper"
            :total="leftTotal"
            v-model:current-page="leftPageNum"
            v-model:page-size="leftPageSize"
            @current-change="leftRefresh"
            @size-change="leftResetToFirstPageThenRefresh"
          />
        </div>
      </div>

      <!-- MIDDLE actions -->
      <div  class="flex flex-col justify-center gap-2">
        <ElButton v-if="props.selectMode ==='move'"
          :disabled="leftSelection.length === 0"
          @click="addRows(leftSelection)"
        >
          <ElIcon><ArrowRight /></ElIcon>
        </ElButton>
      </div>

      <!-- RIGHT: selected list -->
      <div class="flex flex-col overflow-hidden rounded-xl border">
        <div
          class="border-b bg-[var(--el-fill-color-light)] px-3 py-2 font-medium"
        >
          {{ rightTitle }}
        </div>

        <ElTable
          v-loading="rightLoading"
          :data="rightData || []"
          border
          height="420"
          :row-key="props.rowKey"
        >
          <template v-for="col in columns" :key="`r-${col.prop as string}`">
            <ElTableColumn
              :prop="col.prop as string"
              :label="col.label"
              :width="col.width as any"
              :align="col.align || 'left'"
            >
              <template #default="scope">
                <span>{{ renderCell(col, scope.row, scope.$index) }}</span>
              </template>
            </ElTableColumn>
          </template>
          <ElTableColumn :label=" $t('transfer.opertion')" width="100">
            <template #default="{ row }">
              <ElButton type="danger" link @click="removeRow(row)">
                {{ $t('transfer.remove') }}
              </ElButton>
            </template>
          </ElTableColumn>
        </ElTable>

        <div class="border-t px-3 py-2">
          <ElPagination
            background
            layout="prev, pager, next, sizes, jumper"
            :total="rightTotal"
            v-model:current-page="rightPageNum"
            v-model:page-size="rightPageSize"
            @current-change="rightRefresh"
            @size-change="rightResetToFirstPageThenRefresh"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<!--
USAGE (as a Formily x-component)

// 1) Register in your SchemaField components map
import TransferTable from '@/components/TransferTable.vue'
const components = { TransferTable }

// 2) Provide scope actions for fetchers
const scope = {
  async fetchProducts(params){
    // params: { page_num, page_size, keyword, filters, columnFilters, excludeIds? }
    const { data } = await api.get('/products', { params })
    return { list: data.items, total: data.total }
  },
  async fetchSelectedProducts(params){
    const { data } = await api.post('/products/query-by-ids', { ids: params.ids, page_num: params.page_num, page_size: params.page_size })
    return { list: data.items, total: data.total }
  }
}

// 3) Schema example
{
  type: 'array',
  title: '商品选择',
  'x-decorator': 'FormItem',
  'x-component': 'TransferTable',
  'x-component-props': {
    rowKey: 'id',
    columns: [
      { label: 'Product', prop: 'name', filter: { type: 'input' } },
      { label: 'Product Code', prop: 'code', width: 140, filter: { type: 'select', options: [ {label:'A',value:'A'},{label:'B',value:'B'} ] } }
    ],
    fetchLeft: '{{ $actions.fetchProducts }}',
    fetchRight: '{{ $actions.fetchSelectedProducts }}',
    topFilterFields: [
      { key: 'vendor', label: '供应商', type: 'remote-select', remoteMethod: '{{ $actions.searchVendors }}' },
      { key: 'brand', label: '品牌', type: 'select', options: [ {label:'Nike',value:'nike'} ] }
    ],
    searchPlaceholder: '输入采购单号/供应商/商品名',
    excludeSelectedFromLeft: true
  },
  default: []
}

// 变更：
// - 修复无效结束标签，移除列头 Popover 残留，改为表头下第二行筛选
// - 去掉跨页全选及相关 props/逻辑
// - 顶部 Popover 仅保留用于全局筛选（可按需移除）
// - 变量解构 & page_num/page_size & Tailwind 保持
-->
