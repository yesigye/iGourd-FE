/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { VxeGridProps, VxeUIExport } from 'vxe-table';

import type { Recordable } from '@igourd/types';

import type { VxeGridApi } from './api';

import { h } from 'vue';

import { ElSpace, IgourdIcon } from '@igourd/common-ui';
import { formatDate, formatDateTime, isEmpty, isFunction } from '@igourd/utils';

export function extendProxyOptions(
  api: VxeGridApi,
  options: VxeGridProps,
  getFormValues: () => Recordable<any>,
) {
  [
    'query',
    'querySuccess',
    'queryError',
    'queryAll',
    'queryAllSuccess',
    'queryAllError',
  ].forEach((key) => {
    extendProxyOption(key, api, options, getFormValues);
  });
}

function extendProxyOption(
  key: string,
  api: VxeGridApi,
  options: VxeGridProps,
  getFormValues: () => Recordable<any>,
) {
  const { proxyConfig } = options;
  const configFn = (proxyConfig?.ajax as Recordable<any>)?.[key];
  if (!isFunction(configFn)) {
    return options;
  }

  const wrapperFn = async (
    params: Recordable<any>,
    customValues: Recordable<any>,
    ...args: Recordable<any>[]
  ) => {
    const formValues = getFormValues();
    const data = await configFn(
      params,
      {
        /**
         * 开启toolbarConfig.refresh功能
         * 点击刷新按钮 这里的值为PointerEvent 会携带错误参数
         */
        ...(customValues instanceof PointerEvent ? {} : customValues),
        ...formValues,
      },
      ...args,
    );
    return data;
  };
  api.setState({
    gridOptions: {
      proxyConfig: {
        ajax: {
          [key]: wrapperFn,
        },
      },
    },
  });
}

export function extendsDefaultFormatter(vxeUI: VxeUIExport) {
  vxeUI.formats.add('formatDate', {
    tableCellFormatMethod({ cellValue }) {
      return formatDate(cellValue);
    },
  });

  vxeUI.formats.add('formatDateTime', {
    tableCellFormatMethod({ cellValue }) {
      return formatDateTime(cellValue);
    },
  });
}

export function extendsColumn(
  columns: VxeGridProps['columns'],
  api: VxeGridApi,
) {
  const actions = columns?.find((col) =>
    ['actions', 'operation'].includes(col.field ?? ''),
  );
  if (isEmpty(actions)) {
    columns?.push({
      fixed: 'right',
      sortable: false,
      field: 'actions',
      width: 32,
      align: 'center',
      slots: {
        header: () => {
          return h(IgourdIcon, {
            icon: 'ep:set-up',
            class: 'cursor-pointer size-4',
            onClick: () => {
              api.grid.openCustom();
            },
          });
        },
      },
    });
  } else {
    if (!actions.field) {
      actions.field = 'actions';
    }
    actions.slots!.header = () => {
      return h(
        ElSpace,
        {},
        {
          default: () => [
            actions.title,
            h(IgourdIcon, {
              icon: 'ep:set-up',
              class: 'cursor-pointer size-4',
              onClick: () => {
                api.grid.openCustom();
              },
            }),
          ],
        },
      );
    };
  }
}
