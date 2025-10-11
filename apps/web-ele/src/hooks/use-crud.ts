/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Component, Ref } from 'vue';

import type { ISchema } from '@igourd/common-ui';

import type {
  VxeGridListeners,
  VxeGridProps,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { computed, provide, reactive, ref } from 'vue';

import { confirm, useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { omit, pick } from '@igourd/utils';

import { modifySaleOrderApi } from '@@/sale/apis/order';

import { useIgourdVxeGrid } from '#/adapter/vxe-table';

/**
 * 列表数据接口定义
 * 包含查询参数和查询结果的泛型接口
 */
interface List<T> {
  /** 查询参数接口，包含分页信息 */
  QueryParams: {
    page_num: number; // 当前页码
    page_size: number; // 每页数据条数
  };
  /** 查询结果接口，包含数据列表和总数 */
  QueryResult: {
    list: Array<T> | null; // 数据列表，可能为null
    total: number; // 总数据条数
  };
}
type QueryForm = List<any>['QueryParams'];
/**
 * 服务接口定义
 * 包含CRUD操作的方法集合
 * @template T - 数据实体类型
 * @template P - 数据传输对象类型(DTO)
 */
export interface Service<T, P> {
  /** 查询方法，返回分页数据 */
  query: (
    params: List<Partial<T>>['QueryParams'],
  ) => Promise<List<Partial<T>>['QueryResult']>;
  /** 获取详情方法，根据ID获取单条数据 */
  detail: (dto: T) => Promise<T>;
  /** 删除方法，批量删除数据 */
  drop: (ids: (number | string)[]) => any;
  /** 更新方法，更新单条数据 */
  update: (dto: P) => Promise<number | string>;
  /** 创建方法，创建单条数据 */
  create: (dto: P) => Promise<number | string>;
}

/**
 * CRUD操作配置接口
 * 继承VxeGrid表格属性，并扩展CRUD相关配置
 * @template T - 数据实体类型
 * @template P - 数据传输对象类型(DTO)
 */
export interface CRUDOptions<T extends object, P extends object>
  extends VxeGridProps<T, P>,
    VxeTableGridOptions {
  /** 服务接口实现，提供CRUD操作方法 */
  service: Partial<Service<T, P>>;
  /** 搜索表单的JSON Schema定义 */
  searchFormSchema: ISchema['properties'];
  /** 是否启用批量操作 */
  batchOperate: boolean;
  /** 表格事件监听器 */
  girdEvents: VxeGridListeners<T>;
  /** 表单作用域对象，用于表单数据绑定 */
  scope: Record<string, any>;
  /** 连接的组件，用于抽屉等UI组件 */
  connectedComponent: Component;
  initialValues: Record<string, any>;
  params: Record<string, any>;
  /** 用于标识记录的字段名，默认为'id' */
  idField?: string;
}

/**
 * 实体参数装饰器函数
 * 用于在调用API时自动添加额外参数
 * @param parameters - 要添加的额外参数对象
 * @returns 装饰后的函数
 */
export function withEntityParam(parameters: object) {
  return function (fn: (params: any) => any) {
    return function (data: any) {
      return fn({ ...data, ...parameters });
    };
  };
}

/**
 * 批量操作的Hooks
 * 处理表格多选逻辑，维护选中项状态
 * @param checkboxChange - 复选框变化事件回调
 * @param checkboxAll - 全选/取消全选事件回调
 * @returns 返回选中键数组、表格事件和是否可以批量操作的计算属性
 */
function useBatchOperate<T>(
  checkboxChange?: VxeGridListeners<T>['checkboxChange'],
  checkboxAll?: VxeGridListeners<T>['checkboxChange'],
  idField: string = 'id',
) {
  // 存储选中项的ID数组
  const checkedKeys = ref<unknown[]>([]);

  // 定义表格事件处理器
  const gridEvents: VxeGridListeners<T> = {
    // 单个复选框变化事件
    checkboxChange(params) {
      // @ts-ignore - 忽略类型检查，获取所有选中记录的ID
      checkedKeys.value = params.records.map((item) => item[idField]) || [];
      // 调用外部传入的回调函数
      if (!checkboxChange) return;
      checkboxChange(params);
    },
    // 全选/取消全选事件
    checkboxAll(params) {
      // @ts-ignore - 忽略类型检查，获取所有选中记录的ID
      checkedKeys.value = params.records.map((item) => item[idField]) || [];
      // 调用外部传入的回调函数
      if (!checkboxAll) return;
      checkboxAll(params);
    },
  };

  // 计算是否可以进行批量操作（至少选中一项）
  const canBatchOperate = computed(() => {
    return checkedKeys.value.length > 0;
  });

  return [checkedKeys, gridEvents, canBatchOperate];
}

/**
 * CRUD操作的核心Hook
 * 集成表格、抽屉、批量操作等功能，提供完整的CRUD操作体验
 * @template T - 数据实体类型，必须是对象
 * @template P - 数据传输对象类型(DTO)，必须是对象
 * @param options - CRUD配置选项
 * @returns 返回CRUD相关的组件、API和处理函数
 */
function useCrud<T extends { id?: number | string }, P extends object>(
  options: Partial<CRUDOptions<T, P>>,
) {
  // 获取国际化函数
  const { t } = useI18n();
  const queryData = reactive<QueryForm>({
    page_num: 1,
    page_size: 10,
    ...options.params,
  });
  // 初始化批量操作相关功能
  const [checkedKeys, gridEvents, canBatchOperate] = useBatchOperate(
    options.girdEvents?.checkboxChange,
    options.girdEvents?.checkboxAll,
    (options.idField as string) || 'id',
  );

  // 从选项中提取表格配置，排除非表格相关的属性
  const gridOptions = omit(options, [
    'service',
    'searchFormSchema',
    'batchOperate',
    'girdEvents',
    'scope',
    'data',
    'connectedComponent',
    'tableTitle',
    'tableTitleHelp',
    'class',
    'showSearchForm',
    'separator',
    'tabs',
    'tabsOption',
  ]);
  const vxeTableProps = pick(options, [
    'tableTitle',
    'tableTitleHelp',
    'class',
    'showSearchForm',
    'separator',
    'tabs',
    'tabsOption',
  ]);
  // 确保代理配置存在
  if (!gridOptions.proxyConfig) {
    gridOptions.proxyConfig = {};
  }

  // 确保Ajax配置存在
  if (!gridOptions.proxyConfig.ajax) {
    gridOptions.proxyConfig.ajax = {};
  }

  // 如果没有提供查询函数，则设置默认查询函数
  if (!gridOptions.proxyConfig.ajax.query) {
    gridOptions.proxyConfig.ajax.query = async function ({ page }, form = {}) {
      // 如果没有提供查询服务，则返回空数据
      if (!options.service?.query) {
        return {
          total: 0,
          list: [],
        };
      }
      Object.assign(queryData, form, {
        page_num: page.currentPage,
        page_size: page.pageSize,
      });
      // 调用服务的查询方法，传入分页参数、表单数据和额外参数
      return await options.service.query(queryData);
    };
  }

  // 初始化表格组件和API
  const [Grid, gridApi] = useIgourdVxeGrid({
    // 合并事件处理器
    gridEvents: { ...options.girdEvents, ...gridEvents },
    formOptions: {
      schema: options.searchFormSchema,
      scope: options.scope,
      initialValues: options.initialValues,
    },
    ...vxeTableProps,
    gridOptions: {
      height: 'auto',
      ...gridOptions,
    },
  });

  // 初始化抽屉组件和API
  const [Drawer, drawerApi] = useIgourdDrawer({
    // 设置连接的组件
    connectedComponent: options.connectedComponent,
    // 确认回调：重新加载表格数据
    onConfirm() {
      gridApi.reload();
    },
    // 关闭回调：清空抽屉数据
    onClosed() {
      drawerApi.setData({});
    },
  });

  /**
   * 处理编辑操作
   * 打开抽屉并设置数据
   * @param dto - 要编辑的数据对象，可选
   */
  const handleEdit = async (dto?: T) => {
    if (options.service?.detail && Reflect.ownKeys(dto ?? {}).length > 0) {
      // @ts-ignore
      const data = await options.service?.detail(dto);
      drawerApi.setData(data ?? {}).open();
      return;
    }
    drawerApi.setData(dto ?? {}).open();
  };
  /*
   *  查看详情
   */
  const handleView = (dto?: T) => {
    if (dto) {
      // @ts-ignore
      dto.mode = 'detail';
    }
    drawerApi.setData(dto ?? {}).open();
  };

  /**
   * 处理取消订单操作
   * 显示确认对话框，确认后调用API取消订单
   * @param row - 要取消的订单数据行
   */
  const handleCancel = (row: any) => {
    confirm({
      title: t('common.cancel-order'),
      content: t('common.are-you-sure-cancel-order'),
    })
      .then(async () => {
        // 取消订单，调用API修改订单状态
        await modifySaleOrderApi({
          id_list: [row?.id],
          status: 'CANCEL',
        });
        // 重新加载表格数据
        gridApi.reload();
      })
      .catch(() => {
        // 用户取消操作，不做任何处理
      });
  };

  /**
   * 处理批量删除操作
   * 显示确认对话框，确认后调用API删除选中项
   */
  const handleBatchDelete = () => {
    // 设置表格加载状态
    gridApi.setLoading(true);

    // 显示确认对话框
    confirm({
      title: t('common.delete-confirm-title'),
      content: t('common.delete-confirm-text'),
    })
      .then(() => {
        // 如果没有提供删除服务，则直接返回选中的键
        if (!options.service?.drop) {
          return (checkedKeys as Ref<unknown[]>).value;
        }
        // 调用服务的删除方法
        return options.service?.drop((checkedKeys as Ref<string[]>).value);
      })
      .then(() => {
        // 重新加载表格数据
        gridApi.reload();
        // 清空选中项
        (checkedKeys as Ref<unknown[]>).value = [];
      })
      .finally(() => {
        // 无论成功失败，都取消加载状态并重新加载数据
        gridApi.setLoading(false);
        gridApi.reload();
      });
  };
  // 行删除
  const handleDelete = (ids: string[]) => {
    // 设置表格加载状态
    gridApi.setLoading(true);
    // 显示确认对话框
    confirm({
      title: t('common.delete-confirm-title'),
      content: t('common.delete-confirm-text'),
    })
      .then(() => {
        // 调用服务的删除方法
        return options.service?.drop?.(ids);
      })
      .then(() => {
        // 重新加载表格数据
        gridApi.reload();
      })
      .finally(() => {
        // 无论成功失败，都取消加载状态并重新加载数据
        gridApi.setLoading(false);
        gridApi.reload();
      });
  };

  // 提供表格API和服务给子组件使用
  provide(Symbol.for('PageGrid'), { gridApi, service: options.service });

  // 返回组件、API和处理函数
  return {
    queryData,
    canBatchOperate, // 是否可以批量操作
    checkedKeys, // 选中的键数组
    gridApi, // 表格API
    Grid, // 表格组件
    Drawer, // 抽屉组件
    drawerApi, // 抽屉API
    handleEdit, // 编辑处理函数
    handleBatchDelete, // 批量删除处理函数
    handleCreate: handleEdit, // 创建处理函数（复用编辑函数）
    handleCancel, // 取消订单处理函数
    handleDelete,
    handleView,
  };
}

export { useBatchOperate, useCrud };
