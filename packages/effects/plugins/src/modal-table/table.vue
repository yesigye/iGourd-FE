<script setup lang="ts">
import type { ModalProps } from '@igourd/common-ui';
import type { VxeTableGridOptions } from '../vxe-table';

import { ref, unref } from 'vue';

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
  valueField?: string;
  searchPlaceholder?: string;
  searchable?: boolean;
  onBeforeOpen?: () => Promise<any>;
}

const props = withDefaults(defineProps<Partial<ModalTableProps>>(), {
  text: 'Select',
  title: 'Select Source Order',
  rowKey: 'id',
  searchPlaceholder: 'Enter keyword...',
  searchable: true,
  draggable: true,
});

const emits = defineEmits<{
  (e: 'update:modelValue', v: any): void;
  (e: 'change', v: any): void;
  (e: 'confirm', v: any): void;
  (e: 'cancel'): void;
  (e: 'open'): void;
  (e: 'close'): void;
}>();

const [Modal, modalApi] = useIgourdModal({
  title: props.title,
  draggable: true,
  class: props.class,
  destroyOnClose: true,
  onConfirm() {
    if (gridApi.grid.getRadioRecord(true)) {
      emits('confirm', [gridApi.grid.getRadioRecord(true)]);
    }
    if (gridApi.grid.getCheckboxRecords(true)) {
      emits('confirm', gridApi.grid.getCheckboxRecords(true));
    }
    modalApi.close();
  },
});

const [VxeGrid, gridApi] = useIgourdVxeGrid({
  gridOptions: props.grid,
});
const keyword = ref('');
const activeTab = ref<string | undefined>(props.tabs?.[0]?.name);

function onSearch() {
  gridApi.reload({
    keywords: unref(keyword),
    activeTab: unref(activeTab),
  });
}
async function open() {
  await props.onBeforeOpen?.();
  modalApi.open();
}
function onTabChange(name: any) {
  activeTab.value = name;
  gridApi.reload({
    keywords: unref(keyword),
    activeTab: unref(activeTab),
  });
}
</script>

<template>
  <div class="igourd-modal-table">
    <!-- 触发器 -->
    <slot name="reference">
      <div class="igourd-trigger text-sm" @click="open()">
        <SquareMousePointer class="mr-1" />
        {{ props.text }}
      </div>
    </slot>

    <Modal>
      <div class="p-3 text-sm">
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
        <VxeGrid height="400px" />
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.igourd-trigger {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  height: 18px;
  padding: 0 10px;
  color: var(--primary, #1677ff);
  cursor: pointer;
  user-select: none;
  background: var(--primary-background-light, #f0f6ff);
  border-radius: 8px;
}
</style>
