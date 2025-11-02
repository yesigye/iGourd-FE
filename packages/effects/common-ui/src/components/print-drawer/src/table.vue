<script lang="ts" setup>
import type {
  ExtendedVxeGridApi,
  VxeTableGridOptions,
} from '@igourd/plugins/vxe-table';

import { nextTick, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  gridApi: () => ExtendedVxeGridApi;
  printConfig: VxeTableGridOptions['printConfig'];
}>();
const printHtml = ref('');
const gridApi: ExtendedVxeGridApi['grid'] = props.gridApi().grid;

onMounted(async () => {
  await nextTick();
  const { html } = await gridApi.getPrintHtml(props.printConfig);
  printHtml.value = html;
});
watch(
  () => props.printConfig,
  () => {
    console.log(props.printConfig);
  },
  {
    deep: true,
    immediate: true,
  },
);
const openConfig = async () => {
  gridApi.openPrint(props.printConfig);
  const { html } = await gridApi.getPrintHtml();
  printHtml.value = html;
};
</script>
<template>
  <div class="vxe-table-print mt-2 flex">
    <div v-html="printHtml"></div>
    <div class="w-[50px]" @click="openConfig">设置打印字段</div>
  </div>
</template>
<style lang="scss">
.vxe-table-print {
  td,
  th,
  tr {
    border: 1px solid #ccc;
  }
}
</style>
