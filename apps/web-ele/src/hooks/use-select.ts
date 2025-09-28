import { onBeforeMount } from 'vue';

import { observable } from '@igourd/common-ui';

import { getWarehouseListApi } from '@@/inventory';

interface ListItem {
  value: any;
  label: string;
}

interface Options {
  params?: Record<string, any>;
  fetch: (params?: Record<string, any>) => Promise<ListItem[]>;
}

export function useSelect(option: Options) {
  const options = observable<{ value: ListItem[] }>({ value: [] });
  const { params, fetch } = option;
  onBeforeMount(() => {
    fetch(params).then((res) => {
      options.value = res;
    });
  });
  return options;
}

export function useWarehouseSelect(params) {
  return useSelect({
    params,
    fetch: (params) =>
      getWarehouseListApi(params).then(({ list }) => {
        return list.map((i: any) => {
          return {
            ...i,
            label: i.name,
            value: i.id,
          };
        });
      }),
  });
}
