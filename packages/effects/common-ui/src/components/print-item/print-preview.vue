<script setup lang="ts">
import { computed, markRaw, ref, watchEffect } from 'vue';

import { processAffixedValue } from '@igourd/utils';

import PrintBarcode from './print-barcode.vue';
import PrintDivider from './print-divider.vue';
import PrintImage from './print-image.vue';
import PrintLabel from './print-label.vue';
import PrintRichText from './print-rich-text.vue';
import PrintTable from './print-table.vue';
import PrintText from './print-text.vue';
import PrintTitle from './print-title.vue';

const props = defineProps({
  printData: {
    type: Array,
    default: () => [],
  },
  printInfo: {
    type: Array,
    default: () => [],
  },
  imageUrl: {
    type: String,
    default: '',
  },
});
// 打印预览组件库
const printComponents = {
  PrintText: markRaw(PrintText),
  PrintImage: markRaw(PrintImage),
  PrintTitle: markRaw(PrintTitle),
  PrintLabel: markRaw(PrintLabel),
  PrintBarcode: markRaw(PrintBarcode),
  PrintTable: markRaw(PrintTable),
  PrintDivider: markRaw(PrintDivider),
  PrintRichTextEditor: markRaw(PrintRichText),
};
// const optionData = ref([]);
// 模板数据
const printDataList = ref([]);
const optionData = computed(() => {
  const templateData = [];
  props.printInfo.forEach((item) => {
    const templateJsons = printDataList.value;
    templateJsons.forEach((ele) => {
      if (ele.component_type === 'PrintTable') {
        // column column_option_code
        // data array
        ele.option.value = item.order_item_model_list;
      } else {
        const optionValue =
          item?.[ele.tag]?.[ele.column_option_code] ??
          item[ele.column_option_code];
        if (optionValue) {
          if (ele.suffix) {
            ele.option.value = processAffixedValue(
              optionValue,
              ele.suffix,
              true,
              item.Store,
            );
          } else if (ele.prefix) {
            ele.option.value = processAffixedValue(
              optionValue,
              ele.prefix,
              false,
              item.Store,
            );
          } else {
            ele.option.value = String(optionValue);
          }
        } else {
          ele.option.value = optionValue || (ele.option.value ?? '-');
        }
      }
    });
    templateData.push(templateJsons);
  });

  return templateData;
});

watchEffect(() => {
  props.printData.forEach((item) => {
    item.com = printComponents[item.component_type];
    item.option = {
      title: item.label,
      value: item.option ? item.option.value : '',
    };
  });
  printDataList.value = [...props.printData];
});
</script>
<template>
  <section style="margin-top: 24px">
    <div v-for="(item, index) in optionData" :key="index">
      <div v-for="items in item" :key="items.id" class="mb-1">
        <component
          :is="items.com || ''"
          :title="items.name"
          :value="items.option.value"
          :item-style="items.style"
          :image-url="props.imageUrl"
          :element-data="items"
        />
      </div>
    </div>
  </section>
</template>
