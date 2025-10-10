import type { PageResult } from '#/common/typeing';
import { reactive, toRefs, ref, computed, type Ref } from 'vue';

type LoadIngType = 'loadmore' | 'nomore' | 'loading';

interface AnyObject {
  [key: string]: any;
}

interface PageParam {
  pageNo: number; // 当前页
  pageSize: number; // 每页条数
  order?: 'desc' | 'asc'; // 拍序列
}

type PageQueryParam<T = AnyObject> = T & PageParam;

interface LoadPropsType<T, Q> {
  searchParams?: Ref<Q>;
  staticParams?: AnyObject;
  getLoadList: (params: PageQueryParam<Q>) => Promise<PageResult<T[]>>;
  pageSize?: number;
  isChangeLoadmore?: (dataList: T[]) => LoadIngType;
  addPosition?: boolean; // dataList 分页向前添加还是向后添加 默认false 向后添加
  order?: 'desc' | 'asc';
  filterCallback?: (list: T[]) => T[];
  loadingCallback?: (list: T[]) => void; // 返回每次拿到的新数据
  beforeCallback?: () => void; // 加载之前的callback
  afterCallback?: () => void; // 加载之后的callback
}

interface LoadStateType<T> {
  refreshing: boolean;
  pageLoading: boolean;
  isLoading: boolean;
  loadingType: LoadIngType;
  queryParams: PageParam;
  dataList: T[];
}

export const useLoading = <T, Q = AnyObject>(props: LoadPropsType<T, Q>) => {
  const {
    searchParams = ref({}),
    staticParams = {},
    pageSize = 20,
    isChangeLoadmore,
    addPosition = false,
    order = 'asc',
    filterCallback = dataList => dataList,
    loadingCallback = async () => {},
    beforeCallback = async () => 1,
    afterCallback = async () => 1
  } = props;
  let getLoadList = props.getLoadList;
  const state = reactive({
    refreshing: true,
    pageLoading: true,
    isLoading: false,
    loadingType: 'loadmore',
    queryParams: {
      pageSize,
      pageNo: 1,
      order: order
    },
    dataList: []
  }) as LoadStateType<T>;

  const resetLoadingHooks = (loadCallback: any) => {
    state.refreshing = true;
    state.pageLoading = true;
    state.isLoading = false;
    state.loadingType = 'loadmore';
    state.queryParams.pageNo = 1;
    state.dataList = [];
    getLoadList = loadCallback;
  };

  const { refreshing, pageLoading, queryParams, loadingType, isLoading, dataList } = toRefs(state);
  const scrolltolower = () => {
    if (loadingType.value !== 'nomore' && isLoading.value) {
      queryParams.value.pageNo++;
      getLoadDataList();
    }
  };

  const resetPageSize = async () => {
    queryParams.value.pageSize = pageSize;
    queryParams.value.pageNo = 1;
    await getLoadDataList(true);
  };

  const finished = computed(() => loadingType.value === 'nomore');

  const calculateLoadmore = (total = 0): LoadIngType => {
    const { pageNo } = queryParams.value;
    if (pageNo >= 1 && dataList.value.length === total) {
      return 'nomore';
    }
    return 'loadmore';
  };

  const renderDataList = () => {
    isLoading.value = true;
    pageLoading.value = false;
    refreshing.value = false;
  };

  const refreshingEvent = async () => {
    refreshing.value = true;
    await resetPageSize();
  };

  const getLoadDataList = (isReset = false, addList: any[] = []): Promise<T[]> => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<T[]>(async resolve => {
      try {
        pageLoading.value = true;
        isLoading.value = false;
        loadingType.value = 'loading';
        await beforeCallback();
        const res = await getLoadList({
          ...queryParams.value,
          ...staticParams,
          ...(searchParams.value as Q)
        });
        res.list;
        const records = filterCallback(res?.list as any);
        if (isReset) dataList.value = [];
        if (order === 'desc') records.reverse();
        dataList.value = addPosition ? [...records, ...dataList.value, ...addList] : [...dataList.value, ...records];
        loadingCallback(dataList.value);
        loadingType.value = isChangeLoadmore ? isChangeLoadmore(records) : calculateLoadmore(res.total);
        renderDataList();
        await afterCallback();
        resolve(dataList.value);
      } catch (error) {
        console.log(error);
      } finally {
        pageLoading.value = false;
        refreshing.value = false;
      }
    });
  };

  const resetloadMixin = () => {};

  return {
    refreshing,
    finished,
    pageLoading,
    dataList,
    loadingType,
    queryParams,
    refreshingEvent,
    resetPageSize,
    scrolltolower,
    calculateLoadmore,
    getLoadDataList,
    resetloadMixin,
    resetLoadingHooks
  };
};
