<script setup lang="ts">
import type { CheckboxValueType } from 'element-plus';

import type { Ref } from 'vue';

import { computed, nextTick, reactive, ref, watch, watchEffect } from 'vue';

import { ArrowRight, Filter } from '@igourd/icons';

import {
  ElButton,
  ElCheckbox,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElLink,
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
  keywords?: string;
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
    /** columns used for both sides */
    columns: Column[];
    excludeSelectedFromLeft?: boolean;
    /** fetch rows by ids (用于跨页全选批量拉取) */
    // eslint-disable-next-line vue/require-default-prop
    fetchByIds?: (ids: Array<number | string>) => Promise<KV[]>;
    /** fetcher for LEFT table (available list) */
    fetchLeft: (params: FetchParams) => Promise<PageResult>;
    /** fetcher for RIGHT table (selected list) */
    // eslint-disable-next-line vue/require-default-prop
    fetchRight?: (params: FetchParams) => Promise<PageResult>;
    /** 提供当前筛选条件下的全部 ID（用于跨页全选） */
    // eslint-disable-next-line vue/require-default-prop
    getAllIdsUnderFilter?: (
      params: Omit<FetchParams, 'page' | 'pageSize'>,
    ) => Promise<Array<number | string>>;
    /** optional action column on LEFT */
    // eslint-disable-next-line vue/require-default-prop
    leftActionColumn?: { label?: string; width?: number };
    leftTitle?: string;
    /** v-model value: selected rows on the RIGHT table */
    modelValue: KV[];
    pageSize?: number;
    rightTitle?: string;
    /** unique key in each row */
    rowKey: string;
    searchPlaceholder?: string;
    /** top popover filter fields */
    topFilterFields?: TopFilterField[];
  }>(),
  {
    modelValue: () => [],
    leftTitle: '可选择',
    rightTitle: '已选择',
    pageSize: 10,
    searchPlaceholder: '输入关键字搜索',
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
    value.value = [...v];
    right.refresh();
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
 * Cross-page select state
 */
const cross = reactive({
  allSelected: false,
  idSet: new Set<any>(),
});

function clearCrossSelected() {
  cross.allSelected = false;
  cross.idSet.clear();
  // also clear visual selections
  nextTick(() => syncLeftPageSelections());
}

/** ****************************
 * Composables: pagination/fetcher
 */
function usePager(
  fetcher: (p: FetchParams) => Promise<PageResult>,
  getExtra: () => Partial<FetchParams> = () => ({}),
) {
  const page: Ref<number> = ref(1);
  const pageSize = ref(props.pageSize);
  const total: Ref<number> = ref<number>(0);
  const data: Ref<KV[]> = ref<KV[]>([]);
  const loading = ref<boolean>(false);

  const getParams = (): FetchParams => ({
    page_num: page.value,
    page_size: pageSize.value,
    keywords: debouncedKeyword.value,
    filters: topFilters,
    columnFilters,
    ...getExtra(),
  });

  async function refresh() {
    loading.value = true;
    try {
      const res = await fetcher(getParams());
      data.value = res.list || [];
      total.value = res.total || 0;
      await nextTick();
      syncLeftPageSelections();
    } catch (error: any) {
      ElMessage.error(error?.message || '加载失败');
    } finally {
      loading.value = false;
    }
  }

  function resetToFirstPageThenRefresh() {
    page.value = 1;
    refresh();
  }

  return {
    page,
    pageSize,
    total,
    data,
    loading,
    refresh,
    resetToFirstPageThenRefresh,
    getParams,
  };
}

// debounce keyword
const debouncedKeyword = ref('');
let keywordTimer: any;
watch(
  keyword,
  (v) => {
    clearTimeout(keywordTimer);
    keywordTimer = setTimeout(() => {
      debouncedKeyword.value = v;
      clearCrossSelected();
      left.resetToFirstPageThenRefresh();
    }, 300);
  },
  { immediate: false },
);

// LEFT pager
const left = usePager(async (params) => {
  // optionally exclude selected from left list
  const real = { ...params } as FetchParams;
  if (props.excludeSelectedFromLeft && valueIds.value.length > 0) {
    (real as any).excludeIds = valueIds.value;
  }
  return props.fetchLeft(real);
});

// RIGHT pager (query by ids)
const right = usePager(async (params) => {
  if (props.fetchRight) {
    return props.fetchRight({ ...params, ids: valueIds.value });
  }
  // fallback: simple local paging if no fetchRight provided
  const start = (params.page_num - 1) * params.page_size;
  const end = start + params.page_size;
  return { list: value.value.slice(start, end), total: value.value.length };
});

// 清空跨页选择：当筛选项变化时
watch(
  () => ({
    k: debouncedKeyword.value,
    tf: JSON.stringify(topFilters),
    cf: JSON.stringify(columnFilters),
  }),
  () => clearCrossSelected(),
);

watchEffect(() => {
  left.refresh();
  right.refresh();
});

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
 * Cross-page select handlers
 */
async function onToggleAllAcrossPages(val: CheckboxValueType) {
  if (!val) {
    clearCrossSelected();
    return;
  }
  if (!props.getAllIdsUnderFilter) {
    ElMessage.warning('请提供 getAllIdsUnderFilter 以启用跨页全选');
    cross.allSelected = false;
    return;
  }
  try {
    const p = left.getParams();
    // 取当前筛选条件（不需要分页）
    const { keywords, filters, columnFilters } = p;
    const ids = await props.getAllIdsUnderFilter({
      keywords,
      filters,
      columnFilters,
    } as any);
    cross.idSet = new Set(ids);
    // 视觉选中当前页
    await nextTick();
    syncLeftPageSelections();
  } catch (error: any) {
    cross.allSelected = false;
    ElMessage.error(error?.message || '跨页全选失败');
  }
}

function syncLeftPageSelections() {
  if (!leftTableRef.value) return;
  // 清空当前页选择，再根据 idSet 设置
  leftTableRef.value.clearSelection();
  if (!cross.allSelected || cross.idSet.size === 0) return;
  (left.data as any).value?.forEach((row: KV) => {
    const checked = cross.idSet.has(row[props.rowKey]);
    if (checked) leftTableRef.value.toggleRowSelection(row, true);
  });
}

async function addCrossSelected() {
  const ids = [...cross.idSet];
  const toAddIds = ids.filter((id) => !valueIds.value.includes(id));
  if (toAddIds.length === 0) {
    ElMessage.info('没有新的可添加项');
    return;
  }
  if (!props.fetchByIds) {
    ElMessage.warning('未提供 fetchByIds，无法根据 ID 批量拉取数据');
    return;
  }
  const rows = await props.fetchByIds(toAddIds);
  addRows(rows);
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
  clearCrossSelected();
  left.resetToFirstPageThenRefresh();
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
  // 已在右侧选中的，左侧禁用勾选
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
  right.resetToFirstPageThenRefresh();
  // 刷新左侧（以隐藏已选）
  left.refresh();
}

function removeRow(row: KV) {
  const id = row[props.rowKey];
  const next = value.value.filter((r) => r[props.rowKey] !== id);
  setValue(next);
  right.refresh();
  left.refresh();
}

// expose refresh for parent if needed
defineExpose({ refreshLeft: left.refresh, refreshRight: right.refresh });
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Top bar: search + popover filters + selected counter -->
    <div class="flex items-center gap-2">
      <ElInput
        v-model="keyword"
        :placeholder="searchPlaceholder"
        class="w-[360px]"
        clearable
        @keyup.enter="left.refresh()"
      >
        <template #append>
          <ElButton :loading="left.loading" @click="left.refresh()">
            Search
          </ElButton>
        </template>
      </ElInput>

      <ElPopover placement="bottom-start" trigger="click" width="420">
        <template #reference>
          <ElButton text :icon="Filter">筛选</ElButton>
        </template>
        <div class="space-y-2">
          <ElForm label-width="96px" :model="topFilters">
            <template v-for="f in topFilterFields" :key="f.key as string">
              <ElFormItem :label="f.label">
                <!-- input -->
                <ElInput
                  v-if="f.type === 'input'"
                  v-model="topFilters[f.key]"
                  :placeholder="f.placeholder || '输入关键字'"
                  clearable
                />
                <!-- static select -->
                <ElSelect
                  v-else-if="f.type === 'select'"
                  v-model="topFilters[f.key]"
                  filterable
                  clearable
                  :multiple="f.multiple"
                  :placeholder="f.placeholder || '请选择'"
                  class="w-full"
                >
                  <ElOption
                    v-for="opt in f.options || []"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </ElSelect>
                <!-- remote select -->
                <ElSelect
                  v-else-if="f.type === 'remote-select'"
                  v-model="topFilters[f.key]"
                  filterable
                  remote
                  clearable
                  :multiple="f.multiple"
                  :remote-method="(q: string) => loadTopRemoteOptions(f, q)"
                  :loading="topRemoteLoading[f.key as string]"
                  :placeholder="f.placeholder || '搜索选项'"
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
            <ElButton size="small" @click="resetTopFilters">重置</ElButton>
            <ElButton
              size="small"
              type="primary"
              @click="left.resetToFirstPageThenRefresh()"
            >
              应用
            </ElButton>
          </div>
        </div>
      </ElPopover>

      <ElButton text @click="clearAll">Clear</ElButton>
      <div class="flex-1"></div>
      <div class="text-primary font-medium">
        已选择 {{ valueIds.length }} 项
      </div>
    </div>

    <div class="grid grid-cols-[1fr_auto_1fr] gap-3">
      <!-- LEFT: available list -->
      <div class="flex flex-col overflow-hidden rounded-xl border">
        <div
          class="border-b bg-[var(--el-fill-color-light)] px-3 py-2 font-medium"
        >
          {{ leftTitle }}
        </div>

        <!-- Cross-page select bar -->
        <div class="flex items-center gap-3 border-b px-3 py-2 text-sm">
          <ElCheckbox
            v-model="cross.allSelected"
            @change="onToggleAllAcrossPages"
          >
            全选本次查询（共 {{ left.total }} 条）
          </ElCheckbox>
          <ElLink
            v-if="cross.allSelected"
            type="primary"
            @click="addCrossSelected"
          >
            添加已全选
          </ElLink>
          <ElLink
            v-if="cross.allSelected"
            type="danger"
            @click="clearCrossSelected"
          >
            取消全选
          </ElLink>
        </div>
        <ElTable
          ref="leftTableRef"
          v-loading="left.loading"
          :data="left.data"
          :row-key="props.rowKey"
          border
          height="420"
          @selection-change="(rows: any[]) => (leftSelection = rows)"
          :row-class-name="leftRowClass"
        >
          <ElTableColumn
            type="selection"
            width="48"
            :selectable="leftSelectable"
          />

          <template v-for="col in columns" :key="col.prop as string">
            <ElTableColumn
              :prop="col.prop as string"
              :label="col.label"
              :width="col.width as any"
              :align="col.align || 'left'"
              :sortable="col.sortable || false"
            >
              <template #header>
                <div class="flex items-center gap-1">
                  <span>{{ col.label }}</span>
                  <ElPopover
                    v-if="col.filter"
                    placement="bottom-start"
                    trigger="click"
                    width="260"
                  >
                    <template #reference>
                      <ElButton text :icon="Filter" class="h-5 p-0" />
                    </template>
                    <div class="space-y-2">
                      <!-- input filter -->
                      <ElInput
                        v-if="col.filter?.type === 'input'"
                        v-model="columnFilters[col.prop as string]"
                        :placeholder="col.filter?.placeholder || '输入关键字'"
                        clearable
                      />
                      <!-- static select filter -->
                      <ElSelect
                        v-else-if="col.filter?.type === 'select'"
                        v-model="columnFilters[col.prop as string]"
                        filterable
                        clearable
                        :multiple="col.filter?.multiple"
                        class="w-full"
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
                      >
                        <ElOption
                          v-for="opt in columnRemoteOptions[
                            col.prop as string
                          ] || []"
                          :key="opt.value"
                          :label="opt.label"
                          :value="opt.value"
                        />
                      </ElSelect>
                      <div class="flex justify-end gap-2">
                        <ElButton
                          size="small"
                          @click="
                            () => {
                              columnFilters[col.prop as string] = undefined;
                            }
                          "
                        >
                          清除
                        </ElButton>
                        <ElButton
                          size="small"
                          type="primary"
                          @click="left.resetToFirstPageThenRefresh()"
                        >
                          应用
                        </ElButton>
                      </div>
                    </div>
                  </ElPopover>
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
                  添加
                </ElButton>
              </slot>
            </template>
          </ElTableColumn>
        </ElTable>

        <div class="border-t px-3 py-2">
          <ElPagination
            background
            layout="prev, pager, next, sizes, jumper"
            :total="left.total"
            v-model:current-page="left.page"
            v-model:page-size="left.pageSize"
            @current-change="left.refresh"
            @size-change="left.resetToFirstPageThenRefresh"
          />
        </div>
      </div>

      <!-- MIDDLE actions -->
      <div class="flex flex-col justify-center gap-2">
        <ElButton
          :disabled="cross.allSelected ? false : leftSelection.length === 0"
          @click="
            cross.allSelected ? addCrossSelected() : addRows(leftSelection)
          "
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
          :row-key="props.rowKey"
          v-loading="right.loading"
          :data="right.data"
          border
          height="420"
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
          <ElTableColumn label="操作" width="100">
            <template #default="{ row }">
              <ElButton type="danger" link @click="removeRow(row)">
                移除
              </ElButton>
            </template>
          </ElTableColumn>
        </ElTable>

        <div class="border-t px-3 py-2">
          <ElPagination
            background
            layout="prev, pager, next, sizes, jumper"
            :total="right.total"
            v-model:current-page="right.page"
            v-model:page-size="right.pageSize"
            @current-change="right.refresh"
            @size-change="right.resetToFirstPageThenRefresh"
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
    // params: { page, pageSize, keyword, filters, columnFilters, excludeIds? }
    const { data } = await api.get('/products', { params })
    return { list: data.items, total: data.total }
  },
  async fetchSelectedProducts(params){
    const { data } = await api.post('/products/query-by-ids', { ids: params.ids, page: params.page, pageSize: params.pageSize })
    return { list: data.items, total: data.total }
  },
  async fetchProductsByIds(ids){
    const { data } = await api.post('/products/by-ids', { ids })
    return data.items // KV[]
  },
  async getAllIdsUnderFilter(params){
    // params: { keyword, filters, columnFilters }
    const { data } = await api.post('/products/ids-under-filter', params)
    return data.ids // (string|number)[]
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
    fetchByIds: '{{ $actions.fetchProductsByIds }}',
    getAllIdsUnderFilter: '{{ $actions.getAllIdsUnderFilter }}',
    topFilterFields: [
      { key: 'vendor', label: '供应商', type: 'remote-select', remoteMethod: '{{ $actions.searchVendors }}' },
      { key: 'brand', label: '品牌', type: 'select', options: [ {label:'Nike',value:'nike'} ] }
    ],
    searchPlaceholder: '输入采购单号/供应商/商品名',
    excludeSelectedFromLeft: true
  },
  default: []
}

// 新增点：
// - 全选跨页：通过 getAllIdsUnderFilter 拿到当前筛选条件下的所有 ID；
// - 批量拉取：通过 fetchByIds(ids) 一次性将选中的 ID 实体化到右侧；
// - Tailwind：布局/间距/强调都用 Tailwind 原子类，无额外样式表。
-->
