import type { VxeTableGridOptions } from '@igourd/plugins/vxe-table';

import { h } from 'vue';

import { ElButton, ElImage } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import {
  setupIgourdVxeTable,
  useIgourdVxeGrid,
} from '@igourd/plugins/vxe-table';

import { formatNumber } from '#/utils';

// import { useIgourdForm } from './form';

setupIgourdVxeTable({
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        align: 'center',
        border: false,
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
        const { t } = useI18n();
        const { row, column } = params;
        const cellValue = row[column.field];
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

    // 这里可以自行扩展 vxe-table 的全局配置，比如自定义格式化
    // vxeUI.formats.add
  },
  // useIgourdForm,
});

export { useIgourdVxeGrid };

export type * from '@igourd/plugins/vxe-table';
