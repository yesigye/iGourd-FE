<script setup lang="ts">
import type { ModalProps } from '@igourd/common-ui';

import type { VxeTableGridOptions } from '../vxe-table';

import { computed, nextTick, onMounted, ref, watch } from 'vue';

import {
  ElButton,
  ElInput,
  ElTabPane,
  ElTabs,
  useIgourdModal,
} from '@igourd/common-ui';
import { SquareMousePointer } from '@igourd/icons';

import { useIgourdVxeGrid } from '../vxe-table';

interface GirdTabProps {
  name: string;
  grid: VxeTableGridOptions;
}
interface ModalTableProps extends ModalProps {
  modelValue: number | number[] | string | string[];
  text: string;
  title?: string;
  tabs?: GirdTabProps[];
  grid?: VxeTableGridOptions;
  rowKey?: string;
  valueField?: string;
  searchPlaceholder?: string;
  searchable?: boolean;
  fetch?: (args: {
    keyword: string;
    page: number;
    pageSize: number;
    tab: string;
  }) => Promise<{ list: any[]; total: number }>;
  /** 是否自动把 Drawer/Modal 的 confirm/ok 事件绑定为选择确认（默认 true） */
  bindDrawerConfirm?: boolean;
}

const props = withDefaults(defineProps<Partial<ModalTableProps>>(), {
  text: 'Select',
  title: 'Select Source Order',
  rowKey: 'id',
  searchPlaceholder: 'Enter keyword...',
  searchable: true,
  bindDrawerConfirm: true,
});

const emits = defineEmits<{
  (e: 'update:modelValue', v: any): void;
  (e: 'change', v: any): void;
  (e: 'confirm', payload: { rows: any[]; values: any }): void;
  (e: 'cancel'): void;
  (e: 'open'): void;
  (e: 'close'): void;
}>();

const [Modal, modalApi] = useIgourdModal({
  title: '可拖拽',
  draggable: true,
  confirmText: '确定',
});

console.log(modalApi);

const [VxeGrid, gridApi] = useIgourdVxeGrid({
  gridOptions: props.grid,
});
const keyword = ref('');
const activeTab = ref<string>(props.tabs?.[0]?.name || 'default');
const page = ref(1);
const pageSize = ref(100);
const total = ref(0);
const loading = ref(false);
const rows = ref<any[]>(
  Array.isArray(props.grid?.data) ? (props.grid!.data as any[]) : [],
);
const gridRef = ref();

const isMultiple = computed(() => Array.isArray(props.modelValue));
const currentGrid = computed<VxeTableGridOptions>(() => {
  const t = props.tabs?.find((x) => x.name === activeTab.value);
  return (t?.grid || props.grid || {}) as VxeTableGridOptions;
});

const baseGrid = computed<VxeTableGridOptions>(() => ({
  border: true,
  stripe: true,
  height: 520,
  showHeaderOverflow: true,
  showOverflow: true as any,
  pagerConfig: {
    enabled: true,
    pageSize: pageSize.value,
    currentPage: page.value,
    total: total.value,
  },
  rowConfig: { keyField: props.rowKey!, isHover: true } as any,
  checkboxConfig: { range: true, reserve: true } as any,
}));

const mergedColumns = computed(() => {
  const cols = [...(currentGrid.value.columns || [])];
  const hasCheckbox = cols.some((c: any) => c.type === 'checkbox');
  const hasSeq = cols.some((c: any) => c.type === 'seq');
  const prefix: any[] = [];
  if (!hasCheckbox) prefix.push({ type: 'checkbox', width: 36, fixed: 'left' });
  if (!hasSeq)
    prefix.push({ type: 'seq', title: '#', width: 60, fixed: 'left' });
  return [...prefix, ...cols];
});

const gridBind = computed<VxeTableGridOptions>(() => {
  const raw = currentGrid.value || {};
  return {
    ...baseGrid.value,
    ...raw,
    columns: mergedColumns.value,
    data: rows.value,
    pagerConfig: {
      ...baseGrid.value.pagerConfig,
      ...raw.pagerConfig,
      currentPage: page.value,
      pageSize: pageSize.value,
      total: total.value,
    },
    checkboxConfig: {
      ...(baseGrid.value as any).checkboxConfig,
      ...(raw as any).checkboxConfig,
    },
  };
});

async function loadData() {
  loading.value = true;
  try {
    if (props.fetch) {
      const { list, total: t } = await props.fetch({
        tab: activeTab.value,
        keyword: keyword.value.trim(),
        page: page.value,
        pageSize: pageSize.value,
      });
      rows.value = list || [];
      total.value = t || 0;
    } else {
      const local = Array.isArray(currentGrid.value.data)
        ? (currentGrid.value.data as any[])
        : [];
      total.value = local.length;
      const start = (page.value - 1) * pageSize.value;
      rows.value = local.slice(start, start + pageSize.value);
    }
    await nextTick();
    restoreSelectionFromModel();
  } finally {
    loading.value = false;
  }
}

function restoreSelectionFromModel() {
  const key = props.rowKey!;
  const valField = props.valueField || key;
  const table = gridRef.value;
  if (!table) return;
  table.clearCheckboxRow && table.clearCheckboxRow();
  const values = props.modelValue;
  if (values == null) return;
  const setOne = (v: any) => {
    const r = rows.value.find((it) => it[valField] === v || it[key] === v);
    if (r) table.setCheckboxRow && table.setCheckboxRow(r, true);
  };
  // eslint-disable-next-line unicorn/no-array-callback-reference
  Array.isArray(values) ? values.forEach(setOne) : setOne(values);
}

function getSelection() {
  const table = gridRef.value;
  const key = props.rowKey!;
  const valField = props.valueField || key;
  const selected: any[] = table?.getCheckboxRecords
    ? table.getCheckboxRecords()
    : [];
  const pick = (r: any) => r[valField] ?? r[key];
  // eslint-disable-next-line unicorn/no-array-callback-reference
  if (isMultiple.value) return { values: selected.map(pick), rows: selected };
  const last = selected[selected.length - 1];
  return { values: last ? pick(last) : undefined, rows: last ? [last] : [] };
}

function onCheckboxChange() {
  if (!isMultiple.value) {
    const table = gridRef.value;
    const selected: any[] = table?.getCheckboxRecords
      ? table.getCheckboxRecords()
      : [];
    if (selected.length > 1) {
      const last = selected[selected.length - 1];
      table.clearCheckboxRow();
      table.setCheckboxRow(last, true);
    }
  }
  const { values } = getSelection();
  emits('update:modelValue', values);
  emits('change', values);
}

function onPageChange({ currentPage, pageSize: ps }: any) {
  page.value = currentPage;
  pageSize.value = ps;
  loadData();
}

function onSearch() {
  page.value = 1;
  loadData();
}

function onTabChange(name: string) {
  activeTab.value = name;
  page.value = 1;
  loadData();
}

/** 提供给外层 Drawer 的“确定”回调 */
function confirmFromDrawer() {
  const sel = getSelection();
  emits('update:modelValue', sel.values);
  emits('confirm', sel);
}

function onCancel() {
  emits('cancel');
}

/** 外层变更 v-model 时同步 */
watch(
  () => props.modelValue,
  () => nextTick(restoreSelectionFromModel),
);
onMounted(loadData);

/** 暴露方法给父：open/close/confirm/reload/getSelection */
defineExpose({
  open: modalApi.open,
  close: modalApi.close,
  confirm: confirmFromDrawer,
  reload: loadData,
  getSelection,
});
</script>

<template>
  <div class="igourd-modal-table">
    <!-- 触发器 -->
    <slot name="reference">
      <div
        class="igourd-trigger"
        @click="
          () => {
            modalApi.open();
          }
        "
      >
        <SquareMousePointer class="mr-1" />
        {{ props.text }}
      </div>
    </slot>

    <Modal>
      <div class="p-3">
        <ElTabs
          v-if="props.tabs?.length"
          v-model="activeTab"
          type="card"
          @tab-change="onTabChange"
          class="mb-3"
        >
          <ElTabPane
            v-for="t in props.tabs"
            :key="t.name"
            :name="t.name"
            :label="t.name"
          />
        </ElTabs>

        <div v-if="props.searchable" class="mb-3 flex items-center gap-2">
          <ElInput
            v-model="keyword"
            :placeholder="props.searchPlaceholder"
            clearable
            @keyup.enter="onSearch"
            style="width: 360px"
          />
          <ElButton type="primary" @click="onSearch">
            {{ $t('common.search') }}
          </ElButton>
        </div>

        <VxeGrid
          ref="gridRef"
          v-bind="gridBind"
          :loading="loading"
          @page-change="onPageChange"
          @checkbox-change="onCheckboxChange"
          @checkbox-all="onCheckboxChange"
        />
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.igourd-trigger {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 6px 10px;
  color: var(--primary, #1677ff);
  cursor: pointer;
  user-select: none;
  background: var(--primary-background-light, #f0f6ff);
  border-radius: 8px;
}
</style>
