/* eslint-disable @typescript-eslint/ban-ts-comment */
import { defineComponent, h, onBeforeMount, ref } from 'vue';

import {
  connect,
  ElSelectV2,
  mapProps,
  mapReadPretty,
  PreviewText,
} from '@igourd/common-ui';

import { warehouseProductPageList } from '@@/inventory/apis';

import { useProductConext } from '#/components/product-table';

const InnerSelectV2 = connect(
  ElSelectV2,
  mapProps({
    value: 'modelValue',
    readOnly: 'readonly',
    // @ts-ignore
    change: 'update:modelValue',
  }),
  mapReadPretty(PreviewText.Select),
);
interface ListItem {
  value: number | string;
  label: string;
}

const InnerProductSelect = defineComponent({
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'selectChanged'],
  setup(props, { attrs, slots, emit }) {
    const { useProductTableContext } = useProductConext();
    const { warehouse_id } = useProductTableContext() as Record<string, any>;

    const options = ref<ListItem[]>([]);
    onBeforeMount(() => {
      if (props.label) {
        options.value = [{ label: props.label, value: props.modelValue }];
      }
    });

    function remoteMethod(keyword?: string) {
      warehouseProductPageList({
        keyword,
        warehouse_id,
        // @ts-ignore
      }).then(({ list }) => {
        // @ts-ignore
        options.value =
          list?.map((item) => {
            return {
              value: item.id,
              label: [item.major_name, item.product_spec_kvmessage].join('-'),
            };
          }) || [];
      });
    }

    return () =>
      h(
        InnerSelectV2,
        {
          ...attrs,
          ...emit,
          modelValue: props.modelValue,
          options: options.value,
          remote: true,
          remoteMethod,
          'onVisible-change': function (visible: boolean) {
            if (!visible) return;
            remoteMethod(props.label);
          },
          onChange(val) {
            emit('update:modelValue', val);
            emit(
              'selectChanged',
              options.value.find((i) => i.value === val),
            );
          },
        },
        slots,
      );
  },
});
export const ProductSelect = connect(
  InnerProductSelect,
  mapProps({
    value: 'modelValue',
    readOnly: 'readonly',
    // @ts-ignore
    change: 'update:modelValue',
  }),
  mapReadPretty(PreviewText.Select),
);
