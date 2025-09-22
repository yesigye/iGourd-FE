/* eslint-disable @typescript-eslint/ban-ts-comment */
import { defineComponent, h, onBeforeMount, ref, unref } from 'vue';

import {
  connect,
  ElOption,
  ElSelect,
  mapProps,
  mapReadPretty,
  PreviewText,
  useRecord,
} from '@igourd/common-ui';

import { useProductConext } from '#/components/product-table';
import { wareHouseProductSearch } from '#/features/inventory';

const InnerSelectV2 = connect(
  ElSelect,
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
    const loading = ref(false);
    const record = unref(useRecord());
    const { useProductTableContext } = useProductConext();
    const { warehouse_id, business_type } = useProductTableContext() as Record<
      string,
      any
    >;

    const options = ref<any[]>([]);
    onBeforeMount(() => {
      if (props.label) {
        options.value = [{ label: props.label, value: props.modelValue }];
      }
    });

    function remoteMethod(keywords?: string) {
      wareHouseProductSearch({
        keywords,
        warehouse_id,
        business_type,
        page_num: 1,
        page_size: 20,
        // @ts-ignore
      })
        .then(({ list }) => {
          // @ts-ignore
          options.value = list;
        })
        .finally(() => {
          loading.value = false;
        });
    }

    function onSelect(val: any) {
      emit('update:modelValue', val);
      const selectOption = options.value.find((i) => i.id === val);
      emit('selectChanged', selectOption);
      Object.assign(record, selectOption);
    }

    return () =>
      h(
        ElSelect,
        {
          ...attrs,
          ...emit,
          filterable: true,
          modelValue: props.modelValue,
          options: options.value,
          remote: true,
          loading: loading.value,
          remoteMethod,
          remoteShowSuffix: true,
          onChange: onSelect,
        },
        {
          default: () =>
            options.value.map((item) => {
              return h(ElOption, {
                value: item.id,
                label: [item.major_name, item.product_spec_kvmessage].join('-'),
              });
            }),
          ...slots,
        },
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
