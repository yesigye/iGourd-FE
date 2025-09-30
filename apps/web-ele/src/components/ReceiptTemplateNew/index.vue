<script lang="ts" setup>
import { ref, watchEffect } from 'vue';

import { PrintPreview } from '@igourd/common-ui';
import { useUserStore } from '@igourd/stores';

import { transformTemplate } from './utils';

type TemplateType =
  | 'BARCODE_LABEL'
  | 'PRELIMINARY_BILL_RECEIPT'
  | 'PRICE_TAG'
  | 'RECEIPT'
  | 'REFUND_RECEIPT';

// 定义子组件传递参数，设置默认值
const props = withDefaults(defineProps<PropsType>(), {
  fontSize: 15,
  isBarcode: true,
  printInfo: () => [],
  roles: () => ({}),
  templateType: 'RECEIPT',
});
const { merchantInfo } = useUserStore();
interface LabelOrValueItem {
  key?: string;
  label?: string;
  before?: number | string;
  value?: number | string;
  result?: number | string;
  after?: number | string;
}
interface TemplateOptions {
  title: string;
  subTitle: LabelOrValueItem[];
  topList: LabelOrValueItem[];
  centerList: LabelOrValueItem[];
  productInfo: {
    productList: Array<LabelOrValueItem[]>;
    titleList: Array<LabelOrValueItem>;
  };
  bottomList: LabelOrValueItem[];
  footerList: LabelOrValueItem[];
  barcode: string;
}
type PropsType = {
  fontSize?: number;
  imageUrl?: string;
  isBarcode?: boolean;
  optionContent?: any[];
  printId: string;
  printInfo?: any[];
  roles: Partial<TemplateOptions>;
  templateType?: TemplateType;
  title?: string;
};

const printData = ref<TemplateOptions[]>([]);
watchEffect(async () => {
  const templateData = await transformTemplate({
    template: props.optionContent,
    templateType: props.templateType,
    storeInfo: merchantInfo.value,
  });
  printData.value = templateData;
  if (props.isBarcode) {
    printData.value.push({
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
.Rt {
  // padding: 0 28px;
  box-sizing: border-box;
  margin: 0 auto;
  font-family: initial;
  font-weight: 500;
}

@page {
  size: auto;
  margin: 0;
}

@media print {
  body {
    margin: 0;
    // print-color-adjust: exact;
    // -webkit-print-color-adjust: exact;
  }

  .Rt {
    position: absolute;
    top: 0;
    width: 100%;
  }
}
</style>
<style lang="scss">
.receipt-template-new {
  img {
    max-width: 100%;
  }

  p {
    font-size: 14px;
  }
}
</style>
