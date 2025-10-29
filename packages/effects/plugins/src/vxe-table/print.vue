<script setup lang="ts">
import {
  SelectDropdown,
  useIgourdDrawer,
  FontSizeSelect,
} from '@igourd/common-ui';
import type { VxeGridProps } from 'vxe-table';

import { computed, ref, unref, nextTick } from 'vue';
import { $t } from '@igourd/locales';
// import { dayjs } from '@igourd/utils';

import { VxeUI } from 'vxe-table';

import { useIgourdVxeGrid } from './use-vxe-grid';

import 'vxe-pc-ui/styles/all.scss';
import { dayjs } from '@igourd/utils';

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
    height: document.body.clientHeight - 150,
    showHeader: true,
    id: `${props.id}-print-config`,
  } as VxeGridProps;
});
const [Grid, api] = useIgourdVxeGrid({
  gridOptions: unref(options),
});
const [Drawer, drawerApi] = useIgourdDrawer({
  confirmText: $t('common.print'),
  class: 'w-1/2',
  header: false,
});
defineExpose({
  print() {
    api.grid
      .getPrintHtml({
        columns: api.grid.getColumns().filter((i) => {
          return !['actions', 'action', 'operate', 'operates'].includes(
            i.field,
          );
        }),
      })
      .then(({ html }) => {
        VxeUI.print({
          headerHtml: `
        <div>
          <p style="align:center">财务流水</p>
          <p>${dayjs(Date.now()).format('YYYY-MM-DD')}</p>
        </div>
        `,
          pageBreaks: [
            {
              bodyHtml: html,
            },
          ],
        });
      });
  },
  open(value) {
    drawerApi.open();
    drawerApi.onOpened = () => {
      nextTick(() => {
        api.grid.loadData(value);
      });
    };
  },
});

enum PrintDrawerType {
  receipt = 'receipt',
  'A4' = 'A4',
}

const onFontSizeChange = (val: number, type: 'title' | 'base') => {
  const printElement = document.getElementById(`${options.value.id}`);
  if (printElement) {
    if (type === 'title') {
      printElement.style.setProperty('--title-font-size', `${val}px`);
    } else if (type === 'base') {
      printElement.style.setProperty('--base-font-size', `${val}px`);
    }
  }
};
const printTypeOptions = (t: (s: string) => string) => [
  {
    label: t(`common.print-config.${PrintDrawerType.receipt}`),
    value: PrintDrawerType.receipt,
  },
  {
    label: t(`common.print-config.${PrintDrawerType['A4']}`),
    value: PrintDrawerType['A4'],
  },
];
const printType = ref(PrintDrawerType['A4']);
const onTemplateChange = ({ value }) => {
  printType.value = value;
};
</script>

<template>
  <Drawer>
    <div class="pt-root" aria-hidden="true">
      <div class="pt-page" :id="options.id?.toString() ?? 'helo'">
        <header class="mb-1 bg-white p-3">
          <div class="print-config flex justify-around text-sm">
            <SelectDropdown
              :options="printTypeOptions($t)"
              @change="onTemplateChange"
            >
              {{ $t(`common.print-config.pager`) }}
              {{ $t(`common.print-config.${printType}`) }}
            </SelectDropdown>
            <FontSizeSelect
              :font-size="16"
              @change="(val) => onFontSizeChange(val, 'title')"
              >{{ $t('common.print-config.title-font-size') }}</FontSizeSelect
            >
            <FontSizeSelect
              :font-size="14"
              @change="(val) => onFontSizeChange(val, 'base')"
              >{{ $t('common.print-config.base-font-size') }}</FontSizeSelect
            >
          </div>
        </header>
        <div class=" flex items-center justify-center">
          <div :class="printType">
            <Grid v-bind="options" />
          </div>
        </div>
      </div>
    </div>
  </Drawer>
</template>
<style scoped lang="scss">
.receipt {
  width: 80mm;
}

.A4 {
  width: 100%;
}
</style>
