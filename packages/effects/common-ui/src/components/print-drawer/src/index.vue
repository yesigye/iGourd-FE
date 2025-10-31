<script setup lang="ts">
import type { PrintDrawerProps } from '../type';

import { ref, unref, useId } from 'vue';

import { useI18n } from '@igourd/locales';

import { useIgourdDrawer } from '@igourd-core/popup-ui';

import cls from 'classnames';
import { ElButton } from 'element-plus';

import FontSizeSelect from '../../fontsize-select/index.vue';
import SelectDropdown from '../../select-dropdown/index.vue';
import { HideOnPrint, PrintComponentType, PrintDrawerType } from '../type';
import PrintList from './list.vue';
import PrintTable from './table.vue';
import PrintTitle from './title.vue';

// import stys from './index.module.scss';

const compMap = {
  [PrintComponentType.PrintTitle]: unref(PrintTitle),
  [PrintComponentType.PrintList]: unref(PrintList),
  [PrintComponentType.PrintTable]: unref(PrintTable),
};
const printTypeOptions = (t: (s: string) => string) => [
  {
    label: t(`common.${PrintDrawerType.receipt}`),
    value: PrintDrawerType.receipt,
  },
  {
    label: t(`common.${PrintDrawerType.A4}`),
    value: PrintDrawerType.A4,
  },
];
const id = useId();
const { t } = useI18n();

const printData = ref<PrintDrawerProps>({
  type: PrintDrawerType.A4,
  printDatas: [],
});
const hideOnPrint = ref(HideOnPrint.show);

// @ts-ignore
const onTemplateChange = (val: (typeof printTypeOptions)[number]) => {
  printData.value.type = val.value;
};

const onFontSizeChange = (val: number, type: 'base' | 'title') => {
  // @ts-ignore
  // eslint-disable-next-line unicorn/prefer-query-selector
  const printElement = document.getElementById(`print_${id}`);
  if (printElement) {
    if (type === 'title') {
      printElement.style.setProperty('--title-font-size', `${val}px`);
    } else if (type === 'base') {
      printElement.style.setProperty('--base-font-size', `${val}px`);
    }
  }
};
const [BasicDrawer] = useIgourdDrawer({
  class: 'w-1/2',
  destroyOnClose: true,
});
</script>
<template>
  <BasicDrawer>
    <!-- just for hide title  -->
    <template #title>
      <div class="print-config flex-justify-around flex">
        <SelectDropdown
          :options="printTypeOptions(t)"
          @change="onTemplateChange"
        >
          {{ t('webPrintTemplate.printTemplate') }}
          {{ t(`common.${printData.type}`) }}
        </SelectDropdown>
        <FontSizeSelect
          :font-size="16"
          @change="(val) => onFontSizeChange(val, 'title')"
        >
          {{ t('webPrintTemplate.titleFontSize') }}
        </FontSizeSelect>
        <FontSizeSelect
          :font-size="14"
          @change="(val) => onFontSizeChange(val, 'base')"
        >
          {{ t('webPrintTemplate.baseFontSize') }}
        </FontSizeSelect>
      </div>
    </template>
    <main
      :id="`print_${id}`"
      :class="cls(stys.print, stys[printData.type], 'printer')"
    >
      <component
        v-bind.prop="{
          ...item,
          type: printData.type,
          hideOnPrint,
        }"
        :is="compMap[item.compType]"
        v-for="(item, i) of printData?.printDatas"
        :key="i"
      />
    </main>
    <template #footer>
      <div class="drawer-footer">
        <ElButton
          v-print="{
            ids: `#print_${id}`,
            beforePrintCallback: () => (hideOnPrint = HideOnPrint.hide),
            closeCallback: () => (hideOnPrint = HideOnPrint.show),
          }"
          :button-props="{ onClick: async () => {}, type: 'primary' }"
        >
          {{ t('common.print') }}
        </ElButton>
      </div>
    </template>
  </BasicDrawer>
</template>
