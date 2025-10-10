import type { StoreListPageModel } from '@@/store/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useRouter } from 'vue-router';

import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { deleteStoreListApi, getStoreListPageListApi } from '@@/store/apis';

import { useCrud } from '#/hooks';

import { BUSINESS_TYPE_CONFIG, STATUS_CONFIG } from '../../constants';

export function useStoreList() {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();
  const router = useRouter();

  function jumpCreateStorePage(query: Record<string, any>) {
    router.push({ path: '/store/create', query });
  }

  function handleUpgradeCellClick(
    { row }: { row: StoreListPageModel },
    type: 'RENEW' | 'UPGRADE',
  ) {
    jumpCreateStorePage({
      sub_merchant_id: row.id,
      business_type: row.business_type,
      package_business_type: type,
    });
  }

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<StoreListPageModel>[] = [
    {
      field: 'short_name',
      minWidth: 200,
      align: 'left',
      fixed: 'left',
      title: t('store.storeList.short_name'),
    },
    {
      field: 'id',
      minWidth: 150,
      align: 'left',
      title: t('store.storeList.id'),
    },
    {
      field: 'full_name',
      minWidth: 120,
      align: 'center',
      title: t('store.storeList.full_name'),
    },
    {
      field: 'business_type',
      minWidth: 100,
      align: 'center',
      title: t('store.storeList.business_type'),
      formatter({ cellValue }) {
        return t(
          `${BUSINESS_TYPE_CONFIG.find((i) => i.value === cellValue)?.name}`,
        );
      },
    },
    {
      field: 'industry_name',
      minWidth: 250,
      align: 'left',
      title: t('store.storeList.industry_name'),
    },
    {
      field: 'status',
      minWidth: 120,
      align: 'left',
      title: t('store.storeList.status'),
      cellRender: {
        name: 'OpenStatus',
        props: {
          statusList: STATUS_CONFIG,
          onClick({ row }: { row: StoreListPageModel }) {
            handleUpgradeCellClick({ row }, 'RENEW');
          },
        },
      },
    },
    {
      field: 'create_time',
      minWidth: 120,
      align: 'left',
      title: t('store.storeList.create_time'),
    },
    {
      field: 'device_authorization_model',
      minWidth: 150,
      align: 'left',
      title: t('store.storeList.owned_quantity'),
      formatter({ cellValue }) {
        return cellValue?.owned_quantity;
      },
    },
    {
      field: 'device_authorization_model_1',
      minWidth: 120,
      align: 'left',
      title: t('store.storeList.used_quantity'),
      formatter({ row }) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return row.device_authorization_model?.used_quantity;
      },
    },
    {
      field: 'package_models',
      minWidth: 150,
      align: 'center',
      title: t('store.storeList.package'),
      formatter({ cellValue }) {
        const info = cellValue?.pop();
        return info ? t(`common.package_${info.package_id}`) : '-';
      },
    },
    {
      field: 'final_expiration_time',
      minWidth: 120,
      align: 'right',
      title: t('store.storeList.final_expiration_time'),
    },
    {
      field: 'upgradeService',
      minWidth: 100,
      align: 'center',
      fixed: 'right',
      title: t('store.storeList.upgradeService'),
      cellRender: {
        name: 'upgradeService',
        props: {
          onClick: handleUpgradeCellClick,
        },
      },
    },
    {
      field: 'device',
      minWidth: 120,
      align: 'left',
      fixed: 'right',
      title: t('store.storeList.device'),
      cellRender: {
        name: 'AuthStatus',
        props: {
          onClick: ({ row }) => {
            handleUpgradeCellClick(row, 'RENEW');
          },
        },
      },
    },
    {
      field: 'actions',
      minWidth: 100,
      align: 'center',
      title: t('common.action'),
      fixed: 'right',
      slots: {
        default: 'actions',
      },
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getStoreListPageListApi,

    // 删除店铺
    remove: async (data: { store_id_list: number[] }) => {
      return await deleteStoreListApi(data);
    },
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      columns: baseColumns,
      params: {
        first_level_merchant_id: currentLoginUserApp.owner_id,
      },
      searchFormSchema: {
        keywords: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: t('common.search'),
          },
        },
      },
      batchOperate: true, // 支持批量删除
    });

  return {
    jumpCreateStorePage,
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
