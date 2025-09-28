import { onBeforeMount } from 'vue';

import { observable } from '@igourd/common-ui';

import { getSameMerchantApi } from '@@/inventory';

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

export function useMerchantSelect(params) {
  return useSelect({
    params,
    fetch: (params) =>
      getSameMerchantApi(params).then((list) => {
        return list.map((i: any) => {
          return {
            ...i,
            label: i.full_name,
            value: i.id,
          };
        });
      }),
  });
}
