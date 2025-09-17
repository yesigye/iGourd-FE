import type { CountItem } from '../../types/count';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { useCrud } from '#/hooks';
import { formatNumber } from '#/utils/functions';

import { getCountList } from '../../apis/count';

export function useInventoryCountList() {
  const { t } = useI18n();

  const getStatusInfo = (status: 'APPROVED' | 'PENDING' | 'REJECTED') => {
    switch (status) {
      case 'APPROVED': {
        return {
          icon: 'icon-SURE',
          color: '#13BA67',
          text: t('inventory.approved'),
        };
      }
      case 'PENDING': {
        return {
          icon: 'icon-daishenhe',
          color: '#7D90B2',
          text: t('inventory.pendingReview'),
        };
      }
      case 'REJECTED': {
        return {
          icon: 'icon-fILED',
          color: '#FF0000',
          text: t('inventory.rejected'),
        };
      }
      default: {
        return {
          icon: 'icon-daishenhe',
          color: '#7D90B2',
          text: t('inventory.pendingReview'),
        };
      }
    }
  };

  const columns: VxeGridPropTypes.Column<CountItem>[] = [
    {
      field: 'physical_stock_take_no',
      title: t('inventory.physicalStockTakeNo'),
      minWidth: 230,
      fixed: 'left',
    },
    {
      field: 'physical_stock_take_date',
      title: t('inventory.physicalStockTakeDate'),
      minWidth: 160,
      formatter: ({ cellValue }) => (cellValue ? cellValue.split(' ')[0] : ''),
    },
    {
      field: 'warehouse_name',
      title: t('inventory.warehouse'),
      minWidth: 150,
    },
    {
      field: 'origin_total_quantity',
      title: t('inventory.originTotalQuantity'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue),
    },
    {
      field: 'physical_total_quantity',
      title: t('inventory.physicalTotalQuantity'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue),
    },
    {
      field: 'total_variance_quantity',
      title: t('inventory.totalVarianceQuantity'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue),
    },
    {
      field: 'total_variance_selling_price',
      title: t('inventory.totalVarianceSellingPrice'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue),
    },
    {
      field: 'total_variance_cost',
      title: t('inventory.totalVarianceCost'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue),
    },
    {
      field: 'review_status',
      title: t('inventory.review'),
      minWidth: 85,
      align: 'center',
      formatter: ({ row }) => {
        const statusInfo = getStatusInfo(row.review_status);
        return `<i class="iconfont ${statusInfo.icon}" style="color: ${statusInfo.color}">${statusInfo.text}</i>`;
      },
    },
    {
      field: 'creator_name',
      title: t('inventory.creator'),
      minWidth: 200,
    },
    {
      field: 'create_time',
      title: t('inventory.creationTime'),
      minWidth: 180,
      sortable: true,
      formatter: 'formatDateTime',
    },
  ];

  const service = {
    query: async ({
      page_num,
      page_size,
    }: {
      page_num: number;
      page_size: number;
    }) => {
      const res = await getCountList({
        page_num,
        page_size,
        keywords: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: "{{t('common.keywords')}}",
            clearable: true,
          },
        },
      });
      return {
        list: res.data?.list || [],
        total: res.data?.total || 0,
      };
    },
  };

  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      columns,
      searchFormSchema: {
        keywords: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: "{{t('common.keywords')}}",
            clearable: true,
          },
        },
      },
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
