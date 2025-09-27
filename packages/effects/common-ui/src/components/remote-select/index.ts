import type { PropType } from 'vue';

import { defineComponent, h, ref } from 'vue';

import { connect, mapProps, mapReadPretty } from '@formily/vue';
import { ElOption, ElSelect } from 'element-plus';

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
  (props, { attrs }) => {
    const loading = ref<boolean>(false);
    const options = ref<OptionItem[]>([]);
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
    return () => {
      return h(
        ElSelect,
        {
          ...attrs,
          ...props,
          remote: true,
          filterable: true,
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
    },
  },
);

export const RemoteSelect = connect(
  InnerSelect,
  mapProps({
    value: 'modelValue',
  }),
  mapReadPretty(PreviewText.Select),
);
