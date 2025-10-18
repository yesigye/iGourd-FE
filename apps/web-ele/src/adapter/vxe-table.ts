import type { VxeTableGridOptions } from '@igourd/plugins/vxe-table';

import { h } from 'vue';

import { ElButton, ElImage, ElSpace, ElSwitch } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import {
  setupIgourdVxeTable,
  useIgourdVxeGrid,
} from '@igourd/plugins/vxe-table';
import { moneyFormat } from '@igourd/utils';

import StatusTemplate from '#/components/status/index.vue';
import { formatNumber } from '#/utils';
import {
  asyncTableColumn,
  findTableColumn,
} from '#/api/core/dynamic-table-column';

// import { useIgourdForm } from './form';

setupIgourdVxeTable({
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        align: 'center',
        border: true,
        stripe: true,
        rowConfig: {
          isCurrent: true,
        },
        columnConfig: {
          resizable: true,
          drag: true,
        },
        minHeight: 180,
        formConfig: {
          // 全局禁用vxe-table的表单配置，使用formOptions
          enabled: false,
        },
        columnDragConfig: {
          showIcon: true,
          showDragTip: true,
          animation: true,
          disabledMethod: ({ column }) => {
            if (['actions', 'operation'].includes(column.field as string)) {
              return true;
            }
            if (column.fixed) {
              return true;
            }
            return false;
          },
        },
        rowDragConfig: {
          showDragTip: true,
          animation: true,
        },
        proxyConfig: {
          form: false,
          autoLoad: true,
          response: {
            result: 'list',
            total: 'total',
          },
          showActiveMsg: true,
          showResponseMsg: false,
        },
        toolbarConfig: {
          custom: true,
          refresh: true,
        },
        customConfig: {
          storage: true,
          checkMethod({ column }) {
            if (column.type === 'checkbox') {
              return false;
            }
            if (column.type === 'seq') {
              return false;
            }
            if (
              ['action', 'actions', 'operation', 'operations'].includes(
                column.field,
              )
            ) {
              return false;
            }
            return true;
          },
          restoreStore({ id }) {
            return findTableColumn(id)
          },
          updateStore({ storeData, id }) {
            asyncTableColumn(id, JSON.stringify(storeData));
          },
        },
        round: true,
        showOverflow: true,
        size: 'small',
      } as VxeTableGridOptions,
    });

    // 表格配置项可以用 cellRender: { name: 'CellImage' },
    vxeUI.renderer.add('CellImage', {
      renderTableDefault(_renderOpts, params) {
        const { column, row } = params;
        const src = row[column.field];
        return h(ElImage, { src, previewSrcList: [src] });
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellLink' },
    vxeUI.renderer.add('CellLink', {
      renderTableDefault(renderOpts) {
        const { props } = renderOpts;
        return h(
          ElButton,
          { size: 'small', link: true },
          { default: () => props?.text },
        );
      },
    });
    vxeUI.formats.add('formatMoney', {
      tableCellFormatMethod({ cellValue }) {
        return moneyFormat(cellValue);
      },
    });

    vxeUI.renderer.add('ReviewStatus', {
      renderTableDefault(_, params) {
        const { column, row } = params;
        const cellValue = row[column.field];
        if (!cellValue) {
          return h('span', '--');
        }
        if (cellValue === 'REJECTED') {
          return h('i', {
            class: 'iconfont icon-fILED',
            style: 'color:var(--el-color-danger)',
          });
        }
        if (cellValue === 'PENDING') {
          return h('i', {
            class: 'iconfont icon-daishenhe status_icon',
            style: 'color:var(--el-color-warning)',
          });
        }
        return h('i', {
          class: 'iconfont icon-SURE status_icon',
          style: 'color:var(--el-color-success)',
        });
      },
    });

    vxeUI.renderer.add('OpenStatus', {
      renderTableDefault({ props }, params) {
        const { column, row } = params;
        const cellValue = row[column.field] as string;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return h(StatusTemplate, {
          value: cellValue,
          isI18n: true,
          ...props,
          onClick: () => {
            props?.onClick({ row });
          },
        });
      },
    });
    vxeUI.renderer.add('PaymentStatus', {
      renderTableDefault(_, params) {
        const { t } = useI18n();
        const { row } = params;
        const isPending = row.paid_amount < row.total_amount;
        if (isPending) {
          return h(
            'div',
            { class: 'flex justify-left items-center gap-x-[10px]' },
            [
              h('div', { class: 'w-[10px] h-[10px] bg-warning rounded-[5px]' }),
              h('div', {}, t('purchase.PENDING')),
            ],
          );
        }
        return h(
          'div',
          { class: 'flex justify-left items-center gap-x-[10px]' },
          [
            h('div', { class: 'w-[10px] h-[10px] bg-success rounded-[5px]' }),
            h('div', {}, t('purchase.COMPLETE')),
          ],
        );
      },
    });
    vxeUI.renderer.add('Amount', {
      renderTableDefault(props, params) {
        const { row, column } = params;
        const cellValue = row[column.field];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { computedFn } = props || {};
        if (!computedFn) {
          return formatNumber(cellValue) as string;
        }
        const changeAmount = computedFn?.({ row });
        if (changeAmount > 0) {
          return h(
            'span',
            {
              style: 'color:var(--el-color-success)',
            },
            formatNumber(changeAmount),
          );
        }
        return h(
          'span',
          {
            style: 'color:var(--el-color-error)',
          },
          formatNumber(changeAmount),
        );
      },
    });
    vxeUI.renderer.add('Switch', {
      renderTableDefault({ props }, params) {
        const { row, column } = params;
        const cellValue = row[column.field];
        return h(ElSwitch, {
          modelValue: cellValue,
          ...props,
          onChange(value) {
            props?.onChange?.(value, { row, column });
          },
        });
      },
    });
    vxeUI.renderer.add('upgradeService', {
      renderTableDefault({ props }, params) {
        const { t } = useI18n();
        const { row, column } = params;
        const cellValue = row[column.field];
        const disabled = row.status === 'NONACTIVATED';
        const { package_models } = row;
        let upgradeDisabled = true;
        if (!disabled) {
          if (package_models?.length) {
            upgradeDisabled = false;
          }

          if (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            package_models?.some(({ package_id }) => Number(package_id) >= 3)
          ) {
            upgradeDisabled = true;
          }
        }
        return h(ElSpace, null, {
          default: () => [
            h(
              ElButton,
              {
                disabled,
                type: 'primary',
                link: true,
                onClick: () => {
                  if (disabled) {
                    return;
                  }
                  props?.onClick({ row, value: cellValue }, 'RENEW');
                },
              },
              {
                default: () => t('store.storeList.renew'),
              },
            ),
            h(
              ElButton,
              {
                disabled: disabled || upgradeDisabled,
                type: 'primary',
                link: true,
                onClick: () => {
                  props?.onClick({ row, value: cellValue }, 'UPGRADE');
                },
              },
              {
                default: () => t('store.storeList.upgrade'),
              },
            ),
          ],
        });
      },
    });
    vxeUI.renderer.add('AuthStatus', {
      renderTableDefault({ props }, params) {
        const { t } = useI18n();
        const { row } = params;
        const disabled = row.status === 'NONACTIVATED';
        return h(ElSpace, null, {
          default: () => {
            return [
              h(
                ElButton,
                {
                  link: true,
                  disabled,
                  type: 'primary',
                  onClick: () => {
                    props?.onClick({ row });
                  },
                },
                {
                  default: () => t('store.storeList.authorize'),
                },
              ),
            ];
          },
        });
      },
    });
    // 这里可以自行扩展 vxe-table 的全局配置，比如自定义格式化
    // vxeUI.formats.add
  },
  // useIgourdForm,
});

export { useIgourdVxeGrid };

export type * from '@igourd/plugins/vxe-table';
