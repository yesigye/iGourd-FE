<!-- eslint-disable vue/no-required-prop-with-default -->
<!-- eslint-disable vue/require-default-prop -->
<script lang="ts" setup>
import type { PropsType, TemplateOptions } from './types';

import { ref, watchEffect } from 'vue';

import { useUserStore } from '@igourd/stores';

// import useUserStore from '@igourd/';
import { PrintPreview } from '../print-item';
import { transformTemplate } from './utils';

// 定义子组件传递参数，设置默认值
const props = withDefaults(defineProps<PropsType>(), {
  fontSize: 15,
  isBarcode: true,
  printInfo: () => [],
  roles: () => ({}),
  templateType: 'RECEIPT',
});
const { merchantInfo } = useUserStore();

const printData = ref<TemplateOptions[]>([]);

watchEffect(async () => {
  const templateData = await transformTemplate({
    // @ts-ignore
    template: props.optionContent,
    templateType: props.templateType,
    storeInfo: merchantInfo.value,
    getCustomTemplateOptionList: props.getCustomTemplateOptionList,
  });
  printData.value = templateData;
  if (props.isBarcode) {
    printData.value.push({
      // @ts-ignore
      id: '',
      label: '',
      component_type: 'PrintBarcode',
      column_option_code: 'order_no',
      nonSystem: true,
      option: { title: '', value: props.printInfo[0]?.order_no || '' },
      style: {
        fontSize: '14px',
        textAlign: 'center',
        fontWeight: '400',
        display: 'flex',
        justifyContent: 'center',
      },
    });
  }
});
</script>

<template>
  <section class="max-w-[512px] pl-4 pr-4">
    <div
      :id="printId"
      class="Rt text-14 receipt-template-new bg-white text-black"
    >
      <PrintPreview
        :print-data="printData"
        :print-info="
          props.printInfo.map((item) => ({ ...item, Store: merchantInfo }))
        "
        :image-url="props.imageUrl"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@page {
  size: auto;
  margin: 0;
}

@media print {
  body {
    min-height: auto;
  }
}

.Rt {
  // padding: 0 28px;
  box-sizing: border-box;
  margin: 0 auto;
  font-family: initial;
  font-weight: 500;
}
// @media print {
//   body {
//     margin: 0;
//     // print-color-adjust: exact;
//     // -webkit-print-color-adjust: exact;
//   }

//   .Rt {
//     position: absolute;
//     top: 0;
//   }
// }
.receipt-template-new {
  img {
    max-width: 100%;
  }

  p {
    font-size: 14px;
  }
}
</style>
