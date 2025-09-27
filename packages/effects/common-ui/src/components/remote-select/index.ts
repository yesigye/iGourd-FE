import type { PropType } from 'vue';

import { defineComponent, h, ref } from 'vue';

import { connect, mapProps, mapReadPretty } from '@formily/vue';
import { ElOption, ElSelect } from 'element-plus';

import { useRecord } from '../array-base';
import PreviewText from '../preview-text';

// type ElSelectProps = InstanceType<typeof ElSelect>;

type OptionItem = Pick<
  InstanceType<typeof ElOption>,
  'disabled' | 'label' | 'value'
>;

// interface RemoteSelectProps extends ElSelectProps {
//   remoteMethod: (keywords: string) => Promise<OptionItem[]>;
// }

const InnerSelect = defineComponent(
  (props, { attrs, emit }) => {
    const loading = ref<boolean>(false);
    const options = ref<OptionItem[]>(props.defaultOptions);
    const record = useRecord();
    function remoteQuery(keywords: string) {
      if (props.remoteMethod) {
        loading.value = true;
        props
          .remoteMethod(keywords)
          .then((res) => {
            options.value = res;
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
    function onChange(val: string) {
      emit('change', val);
      console.log(record);
      if (!record.value) {
        return;
      }
      Object.assign(
        record.value,
        options.value.find((i) => i.value === val) || {},
      );
    }
    return () => {
      return h(
        ElSelect,
        {
          ...attrs,
          ...props,
          'onUpdate:modelValue': (v: any) => emit('update:modelValue', v),
          onChange,
          remote: true,
          filterable: true,
          loading: loading.value,
          remoteShowSuffix: true,
          remoteMethod: remoteQuery,
        },
        {
          default: () => {
            return options.value.map((op) => {
              return h(ElOption, { ...op, key: op.value as unknown as string });
            });
          },
        },
      );
    };
  },
  {
    inheritAttrs: false,
    props: {
      // eslint-disable-next-line vue/require-default-prop
      modelValue: { type: null as unknown as PropType<any> },
      remoteMethod: {
        type: Function as PropType<(k: string) => Promise<OptionItem[]>>,
        required: true,
      },
      defaultOptions: {
        type: Array as PropType<OptionItem[]>,
        default: () => [],
      },
    },
    emits: ['update:modelValue', 'change'],
  },
);

export const RemoteSelect = connect(
  InnerSelect,
  mapProps({
    value: 'modelValue',
  }),
  mapReadPretty(PreviewText.Select),
);
