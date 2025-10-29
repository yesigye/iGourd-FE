/**
 * @file 带搜索 分页的下拉选项
 */

import type {
  SearchSelectOptions,
  SearchSelectPagination,
  SearchSelectProps,
} from './type';

import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  toRaw,
  toRef,
  useId,
  watch,
  watchEffect,
} from 'vue';
import { useLoadMore } from 'vue-request';

import { connect, ElOption, ElSelect, mapProps } from '@igourd/common-ui';
import { uniqBy } from '@igourd/utils';

export const SearchSelect = defineComponent<SearchSelectProps>({
  name: 'SearchSelect',
  props: {
    onSearch: {
      type: Function,
      required: true,
    },
    value: {
      type: Array,
      default: () => [],
    },
    defaultOptions: {
      type: Array,
      default: () => [],
    },
  },
  setup: (props, context) => {
    const propRef = toRef(props);
    const selectValue = ref<string[]>(propRef.value?.value || []);
    const compId = useId();
    const itemClassName = computed(() => `select-item-${compId}`);
    const params = ref<SearchSelectPagination>({
      page_num: 1,
      page_size: 20,
      total: 0,
      keywords: '',
    });
    const isMultiple = computed(() => {
      if (typeof context.attrs?.multiple === 'boolean') {
        return context.attrs?.multiple;
      }
      return true;
    });
    /** * 最后一个显示的options元素 */
    const endRef = ref<HTMLDivElement>();
    /** * IntersectionObserver 实例 */
    const observer = ref<IntersectionObserver | null>(null);
    /** * 下拉框容器引用 */
    const selectRef = ref<InstanceType<typeof ElSelect>>();
    /** * 保存的滚动位置 */
    const savedScrollTop = ref<number>(0);

    watchEffect(() => {
      if (endRef.value) {
        endRef.value.style.height = '0px';
      }
    });

    // 获取滚动容器
    const getScrollContainer = () => {
      if (!selectRef.value) return null;
      //  当前下来框中的元素 找到父级滚动元素
      const scrollContainer = document
        .querySelector(`.${itemClassName.value}`)
        ?.closest('.el-vl__window.el-select-dropdown__list');
      return scrollContainer as HTMLElement;
    };

    // 保存滚动位置
    const saveScrollPosition = () => {
      const container = getScrollContainer();
      if (container) {
        savedScrollTop.value = container.scrollTop;
      }
    };

    // 恢复滚动位置
    const restoreScrollPosition = () => {
      const container = getScrollContainer();
      if (container && savedScrollTop.value > 0) {
        // 使用 nextTick 确保 DOM 更新完成
        setTimeout(() => {
          container.scrollTop = savedScrollTop.value;
        }, 50);
      }
    };

    // 初始化 IntersectionObserver
    onMounted(() => {
      observer.value = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !loading.value && !noMore.value) {
              // 在加载更多数据前保存滚动位置
              saveScrollPosition();
              loadMore();
            }
          });
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.1,
        },
      );
    });

    // 清理 observer
    onBeforeUnmount(() => {
      if (observer.value) {
        observer.value.disconnect();
      }
    });

    // 监听 endRef 元素
    watchEffect(() => {
      if (observer.value && endRef.value) {
        observer.value.observe(endRef.value);
      }
    });

    const { noMore, loading, loadMore, refresh, data } = useLoadMore(
      async (args) => {
        let searchArgs = {
          ...params.value,
        };
        if (args?.page_num || args?.page_size) {
          searchArgs = {
            ...searchArgs,
            page_num: args.page_num ?? searchArgs.page_num,
            page_size: args.page_size ?? searchArgs.page_size,
          };
        }
        const result = await propRef.value.onSearch(searchArgs);

        // 数据加载完成后恢复滚动位置
        setTimeout(() => {
          restoreScrollPosition();
        }, 100);

        return {
          ...searchArgs,
          // 下次加载使用的值
          page_num: searchArgs.page_num + 1,
          list: [...result.list],
          total: result.total,
        };
      },
      {
        isNoMore: (d) => {
          if (!d?.total) return false;
          return (d?.page_num - 1) * d?.page_size >= d?.total;
        },
      },
    );
    /**
     * 当前选中的值，防止搜索时被清除影响显示
     */
    const selectOptions = ref<SearchSelectOptions<any>[]>([]);
    const opts = computed(() =>
      uniqBy(
        [...(data.value?.list || []), ...toRaw(selectOptions.value)],
        'value',
      ),
    );
    /** 选中的原始数据值 */
    const selectRawValue = computed(() => {
      if (!selectValue.value || selectValue.value.length === 0)
        return undefined;
      if (Array.isArray(selectValue.value)) {
        return opts.value.filter((opt) =>
          selectValue.value.includes(opt.value),
        );
      }
      return opts.value.find((opt) => selectValue.value === opt.value);
    });
    // 选中值变化，更新 selectOptions
    watch(
      selectValue,
      (newVal) => {
        if (!newVal || newVal.length === 0) {
          selectOptions.value = [];
        } else if (Array.isArray(newVal)) {
          selectOptions.value = newVal.map((item) => {
            const targetOpt = opts.value.find((opt) => opt.value === item);
            return {
              ...targetOpt,
            };
          });
        } else {
          selectOptions.value = opts.value.filter(
            (opt) => newVal === opt.value,
          );
        }
      },
      { immediate: true },
    );

    // 设置默认值
    watch(
      propRef,
      (newVal) => {

        const defaultOptions = newVal.defaultOptions || [];
        const value = newVal.value;

        // 设置 value 默认值
        if (isMultiple.value) {
          selectValue.value = value || [];
        } else {
          // @ts-ignore
          selectValue.value = value;
        }

        if (defaultOptions.length > 0) {
          selectOptions.value = defaultOptions;
        }
      },
      { deep: true },
    );

    return () => (
      <ElSelect
        ref={selectRef}
        {...{
          ...context.attrs,
          multiple: isMultiple.value,
          filterable: true,
          remote: true,
          value: selectValue.value,
        }}
        // loading={loading.value}
        onUpdate:modelValue={(v) => {
          selectValue.value = v
          context.emit('change', selectValue.value, selectRawValue.value);
        }}
        remoteMethod={(kwd) => {
          if (kwd !== params.value.keywords) {
            params.value.keywords = kwd;
            // 搜索时重置滚动位置
            savedScrollTop.value = 0;
            refresh();
          }
        }}
        // options={opts.value}
        v-model={selectValue.value}
        v-slots={{
          default: () => {
            return (
              <>
                {opts.value.map((item, idx) => (
                  <>
                    <ElOption key={item.value} {...item}>
                      {item.label}
                    </ElOption>
                    {idx >= opts.value.length - 7 && (
                      <div class="end" ref={endRef}></div>
                    )}
                  </>
                ))}
              </>
            );
          },
        }}
      />
    );
  },
});

/** formily 使用组件 */
export const FormilySearchSelect = connect(
  SearchSelect,
  mapProps(
    {
      dataSource: 'defaultOptions',
    },
    (attr, formField) => {
      return { ...attr, formField, value: formField?.value };
    },
  ),
);
