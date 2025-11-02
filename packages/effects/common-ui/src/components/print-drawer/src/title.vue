<script lang="ts" setup>
import type { TitleType, WithPrintType } from '../type';

import { nextTick, ref, watchPostEffect } from 'vue';

import { useRenderPrint } from '@igourd/hooks';
import { useI18n } from '@igourd/locales';

import cls from 'classnames';

import { HideOnPrint, PrintDrawerType } from '../type';

import stys from './index.module.scss';

const props = withDefaults(defineProps<WithPrintType<TitleType>>(), {
  title: '',
  code: undefined,
  type: PrintDrawerType.A4,
  hideOnPrint: HideOnPrint.show,
});

const { t } = useI18n();

const barcodeRef = ref();
const { renderBarcode } = useRenderPrint();
watchPostEffect(() => {
  if (props.code && barcodeRef.value) {
    nextTick(() => {
      renderBarcode(barcodeRef.value, props.code, { height: 40 });
    });
  }
});
</script>
<template>
  <header :class="stys[props.type]">
    <div v-if="props.title" :class="stys.title">
      {{ t(props?.title || '') }}
    </div>
    <div v-show="props.code" :class="cls(stys['bar-code'], stys[props.type])">
      <svg ref="barcodeRef" :class="stys['print-barcode']" />
    </div>
  </header>
</template>
