import { defineComponent, onBeforeMount, ref } from 'vue';

import { ElOption, ElSelect, h } from '@igourd/common-ui';

interface ListItem {
  value: any;
  label: string;
}

export function useSelect(options: { request: () => Promise<ListItem[]> }) {
  const Select = defineComponent(
    (props: InstanceType<typeof ElSelect>['props'], { attrs, slots }) => {
      const ops = ref<ListItem[]>([]);
      const loading = ref<boolean>(false);
      onBeforeMount(() => {
        options.request().then((data) => {
          ops.value = data;
        });
      });
      return h(
        ElSelect,
        { ...attrs, ...props, loading: loading.value },
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          default: () => ops.value.map((i) => h(ElOption, { ...i })),
          ...slots,
        },
      );
    },
  );
  return [Select];
}
