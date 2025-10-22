<script setup lang="ts">
import type { VxeGridProps } from 'vxe-table';

import { computed, unref } from 'vue';

import { dayjs } from '@igourd/utils';

import { useIgourdVxeGrid } from './use-vxe-grid';

const props = defineProps<VxeGridProps>();

const options = computed(() => {
  return {
    ...props,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      enabled: false,
    },
    columnConfig: {
      drag: false,
    },
    toolbarConfig: {
      enabled: false,
    },
    columns: props.columns?.filter((item) => {
      return (
        !['checkbox', 'radio'].includes(item.type!) &&
        !['action', 'actions', 'operations', 'opreate'].includes(item.field)
      );
    }),
    showHeader: true,
    id: `${props.id}-print-config`,
  } as VxeGridProps;
});
const [Grid, api] = useIgourdVxeGrid({
  gridOptions: unref(options),
});
defineExpose({
  print() {
    (
      document.querySelector('div[data-drawer-print]') as HTMLDivElement
    ).click();
  },
});
</script>

<template>
  <div class="pt-root" aria-hidden="true">
    <div class="pt-page" :id="options.id?.toString() ?? 'helo'">
      <!-- 可自定义的页眉（打印每页都会重复） -->
      <header class="pt-header">
        <slot name="header">
          <div class="pt-header__block">
            <h1 class="pt-title">{{ options.printConfig?.params?.title }}</h1>
            <div class="pt-meta">
              <span>日期: {{ dayjs(Date.now()).format('YYYY-MM-DD') }}</span>
              <span class="pt-sub">{{
                options.printConfig?.params?.subTitle
              }}</span>
            </div>
          </div>
        </slot>
      </header>
      <div>
        我是打印区
        <Grid v-bind="options" />
        <div data-drawer-print class="hidden" v-print="{ ids: options.id }">
          打印
        </div>
      </div>
    </div>
  </div>
</template>
