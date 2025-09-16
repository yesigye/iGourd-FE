import {
  useIgourdVxeGrid,
  type VxeGridListeners,
  type VxeGridProps,
} from '#/adapter/vxe-table';
import { useIgourdDrawer, type ISchema, confirm } from '@igourd/common-ui';
import { ref, computed, type Component, type Ref, provide } from 'vue';
import { omit } from '@igourd/utils';
import { useI18n } from '@igourd/locales';

interface List<T> {
  QueryParams: {
    page_num: number;
    page_size: number;
  };
  QueryResult: {
    total: number;
    list: Array<T> | null;
  };
}

export interface Service<T, P> {
  query: (
    params: List<Partial<T>>['QueryParams'],
  ) => Promise<List<Partial<T>>['QueryResult']>;
  detail: (id: number | string) => Promise<T>;
  drop: (ids: (string | number)[]) => {};
  update: (dto: P) => Promise<string | number>;
  create: (dto: P) => Promise<string | number>;
}

export interface CRUDOptions<T, P> extends VxeGridProps<T> {
  service: Partial<Service<T, P>>;
  searchFormSchema: ISchema['properties'];
  batchOperate: boolean;
  girdEvents: VxeGridListeners<T>;
  scope: Record<string, any>;
  connectedComponent: Component;
}

/**
 * 批量操作的Hooks
 * @param checkboxChange
 * @param checkboxAll
 * @returns
 */
function useBatchOperate<T>(
  checkboxChange?: VxeGridListeners<T>['checkboxChange'],
  checkboxAll?: VxeGridListeners<T>['checkboxChange'],
) {
  const checkedKeys = ref<unknown[]>([]);
  const gridEvents: VxeGridListeners<T> = {
    checkboxChange(params) {
      //@ts-ignore
      checkedKeys.value = params.records.map((item) => item.id) || [];
      if (!checkboxChange) return;
      checkboxChange(params);
    },
    checkboxAll(params) {
      //@ts-ignore
      checkedKeys.value = params.records.map((item) => item.id) || [];
      if (!checkboxAll) return;
      checkboxAll(params);
    },
  };
  const canBatchOperate = computed(() => {
    return !!checkedKeys.value.length;
  });
  return [checkedKeys, gridEvents, canBatchOperate];
}

function useCrud<T extends object, P extends object>(
  options: Partial<CRUDOptions<T, P>>,
) {
  const { t } = useI18n();
  const [checkedKeys, gridEvents, canBatchOperate] = useBatchOperate(
    options.girdEvents?.checkboxChange,
    options.girdEvents?.checkboxAll,
  );
  const gridOptions = omit(options, [
    'service',
    'searchFormSchema',
    'batchOperate',
    'girdEvents',
    'scope',
    'data',
    'connectedComponent',
  ]);
  if (!gridOptions.proxyConfig) {
    gridOptions.proxyConfig = {};
  }
  if (!gridOptions.proxyConfig.ajax) {
    gridOptions.proxyConfig.ajax = {};
  }
  if (!gridOptions.proxyConfig.ajax.query) {
    gridOptions.proxyConfig.ajax.query = async function ({ page }, form = {}) {
      if (!options.service?.query) {
        return {
          total: 0,
          list: [],
        };
      }
      return await options.service.query({
        page_num: page.currentPage,
        page_size: page.pageSize,
        ...form,
      });
    };
  }
  const [Grid, gridApi] = useIgourdVxeGrid({
    gridEvents: { ...options.girdEvents, ...gridEvents },
    formOptions: { schema: options.searchFormSchema, scope: options.scope },
    gridOptions: {
      height: 'auto',
      ...gridOptions,
    },
  });

  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: options.connectedComponent,
    onConfirm() {
      gridApi.reload();
    },
    onClosed() {
      drawerApi.setData({});
    },
  });
  console.log(drawerApi);
  const handleEdit = (dto?: T) => {
    drawerApi.setData(dto ?? {}).open();
  };

  const handleBatchDelete = () => {
    gridApi.setLoading(true);
    confirm({
      title: t('purchase.deleteConfirmTitle'),
      content: t('purchase.deleteConfirmText'),
    })
      .then(() => {
        if (!options.service?.drop) {
          return (checkedKeys as Ref<unknown[]>).value;
        }
        return options.service?.drop((checkedKeys as Ref<string[]>).value);
      })
      .then(() => {
        gridApi.reload();
        (checkedKeys as Ref<unknown[]>).value = [];
      })
      .finally(() => {
        gridApi.setLoading(false);
        gridApi.reload();
      });
  };
  provide(Symbol.for('PageGrid'), { gridApi, service: options.service });
  return {
    canBatchOperate,
    checkedKeys,
    gridApi,
    Grid,
    Drawer,
    drawerApi,
    handleEdit,
    handleBatchDelete,
    handleCreate: handleEdit,
  };
}

export { useCrud, useBatchOperate };
