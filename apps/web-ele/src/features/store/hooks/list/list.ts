import type { StoreListPageModel } from '@@/store/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useRouter } from 'vue-router';

import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { deleteStoreListApi, getStoreListPageListApi } from '@@/store/apis';

import { useCrud } from '#/hooks';

import { BUSINESS_TYPE_CONFIG } from '../../constants';

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
      business_type: row.business_type,
      package_business_type: type,
    });
  }

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<StoreListPageModel>[] = [
    {
      field: 'short_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('store.storeList.short_name'),
    },
    {
      field: 'id',
      width: 150,
      align: 'left',
      title: 'Id',
    },
    {
      field: 'full_name',
      width: 120,
      align: 'center',
      title: t('store.storeList.full_name'),
    },
    {
      field: 'business_type',
      width: 100,
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
      width: 250,
      align: 'left',
      title: t('store.storeList.industry_name'),
    },
    {
      field: 'status',
      width: 120,
      align: 'left',
      title: t('store.storeList.status'),
      cellRender: {
        name: 'OpenStatus',
      },
    },
    {
      field: 'create_time',
      width: 120,
      align: 'left',
      title: t('store.storeList.create_time'),
    },
    {
      field: 'owned_quantity',
      width: 150,
      align: 'left',
      title: t('store.storeList.owned_quantity'),
    },
    {
      field: 'used_quantity',
      width: 120,
      align: 'left',
      title: t('store.storeList.used_quantity'),
    },
    {
      field: 'package',
      width: 150,
      align: 'center',
      title: t('store.storeList.package'),
    },
    {
      field: 'final_expiration_time',
      width: 120,
      align: 'right',
      title: t('store.storeList.final_expiration_time'),
    },
    {
      field: 'upgradeService',
      width: 100,
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
      width: 120,
      align: 'left',
      fixed: 'right',
      title: t('store.storeList.device'),
    },
    {
      field: 'actions',
      width: 100,
      align: 'center',
      title: t('common.action'),
      fixed: 'right',
      slots: {},
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
            placeholder: t('store.searchPlaceholder'),
          },
        },
      },
      batchOperate: true, // 支持批量删除
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
