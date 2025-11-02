<script lang="ts" setup>
import type {
  VxeGridDefines,
  VxeGridInstance,
  VxeGridListeners,
  VxeGridPropTypes,
  VxeGridProps as VxeTableGridProps,
  VxeToolbarPropTypes,
} from 'vxe-table';

import type { SetupContext } from 'vue';

import type { ExtendedVxeGridApi, VxeGridProps } from './types';

import {
  computed,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  toRaw,
  unref,
  useSlots,
  useTemplateRef,
} from 'vue';

import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElRadioButton,
  ElRadioGroup,
  ElText,
  FormButtonGroup,
  PrintDrawer,
  Submit,
  useTableSearchForm,
} from '@igourd/common-ui';
import { usePriorityValues } from '@igourd/hooks';
import {
  ArrayDown,
  EmptyIcon,
  Export,
  Import,
  Print,
  RefreshRight,
} from '@igourd/icons';
import { $t, useI18n } from '@igourd/locales';
import { usePreferences } from '@igourd/preferences';
import {
  cloneDeep,
  cn,
  isBoolean,
  isEqual,
  mergeWithArrayOverride,
} from '@igourd/utils';

import { IgourdHelpTooltip, IgourdLoading } from '@igourd-core/shadcn-ui';

import { VxeButton } from 'vxe-pc-ui';
import { VxeGrid, VxeUI } from 'vxe-table';

import { extendProxyOptions } from './extends';

import 'vxe-table/styles/cssvar.scss';
import 'vxe-pc-ui/styles/cssvar.scss';
import './style.css';

interface Props extends VxeGridProps {
  api: ExtendedVxeGridApi;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits(['update:tabsActiveKey']);
// const FORM_SLOT_PREFIX = 'form-';

const TOOLBAR_ACTIONS = 'toolbar-actions';
const TOOLBAR_TOOLS = 'toolbar-tools';
const TABLE_TITLE = 'table-title';

const gridRef = useTemplateRef<VxeGridInstance>('gridRef');

const state = props.api?.useStore?.();

const {
  gridOptions,
  class: className,
  gridClass,
  gridEvents,
  formOptions,
  tableTitle,
  tableTitleHelp,
  showSearchForm,
  separator,
  tabs,
  tabsOption,
  searchFormAppendTo,
  tabsActiveKey,
  tabsAppenTo,
} = usePriorityValues(props, state);

const showTableTabs = computed(() => {
  return !!unref(tabs);
});
const tabActiveKey = ref();
const tabsValue = computed({
  get() {
    return (
      unref(tabsActiveKey) ??
      tabActiveKey.value ??
      unref(tabsOption)?.defaultActiveValue
    );
  },
  set(value) {
    tabActiveKey.value = value;
    emit('update:tabsActiveKey', value);
  },
});

// const tabsValue = ref(tabsOption.value?.defaultActiveValue);
const { isMobile } = usePreferences();
const isSeparator = computed(() => {
  if (
    !formOptions.value ||
    showSearchForm.value === false ||
    separator.value === false
  ) {
    return false;
  }
  if (separator.value === true || separator.value === undefined) {
    return true;
  }
  return separator.value.show !== false;
});
const separatorBg = computed(() => {
  return !separator.value ||
    isBoolean(separator.value) ||
    !separator.value.backgroundColor
    ? undefined
    : separator.value.backgroundColor;
});
const slots: SetupContext['slots'] = useSlots();

const { Form, formAPI: formApi } = useTableSearchForm({
  useI18n,
  schema: formOptions.value?.schema || {},
  submitOnEnter: true,
  ...formOptions.value,
});

async function handleTabsChange(name: any) {
  tabsValue.value = name;
  if (unref(options).proxyConfig?.autoLoad) {
    handleSubmit();
  }
}

async function handleSubmit() {
  const formValues = formApi.values;
  if (unref(showTableTabs)) {
    return await props.api.reload({
      ...formValues,
      [unref(tabsOption)!.formKey]: unref(tabsValue),
    });
  }
  return await props.api.reload(formValues);
}
async function handleReset() {
  const prevValues = formApi.values;

  // 如果有自定义的初始值重置逻辑，优先使用
  if (
    formOptions.value?.onReset &&
    typeof formOptions.value.onReset === 'function'
  ) {
    await formOptions.value.onReset(formApi);
  } else if (
    formOptions.value?.resetToInitialValues &&
    formOptions.value?.initialValues
  ) {
    // 重置到指定的初始值
    formApi.setInitialValues(formOptions.value.initialValues);
    await formApi.reset();
  } else {
    // 默认重置行为
    await formApi.reset();
  }

  const formValues = formApi.values;
  tabsValue.value = unref(tabsOption)?.defaultActiveValue;

  if (isEqual(prevValues, formValues) || !formOptions.value?.submitOnChange) {
    await (unref(showTableTabs)
      ? props.api.reload({
          ...formValues,
          [unref(tabsOption)!.formKey]: unref(tabsValue),
        })
      : props.api.reload(formValues));
  }
}

const showTableTitle = computed(() => {
  return !!slots[TABLE_TITLE]?.() || tableTitle.value || unref(showTableTabs);
});

const showToolbar = computed(() => {
  return (
    !!slots[TOOLBAR_ACTIONS]?.() ||
    !!slots[TOOLBAR_TOOLS]?.() ||
    showTableTitle.value
  );
});

const toolbarOptions = computed(() => {
  const slotActions = slots[TOOLBAR_ACTIONS]?.();
  const slotTools = slots[TOOLBAR_TOOLS]?.();
  const searchBtn: VxeToolbarPropTypes.ToolConfig = {
    code: 'search',
    icon: 'vxe-icon-search',
    circle: true,
    status: showSearchForm.value ? 'primary' : undefined,
    title: showSearchForm.value
      ? $t('common.hide-search-panel')
      : $t('common.show-search-panel'),
  };
  // 将搜索按钮合并到用户配置的toolbarConfig.tools中
  const toolbarConfig: VxeGridPropTypes.ToolbarConfig = {
    tools: (gridOptions.value?.toolbarConfig?.tools ??
      []) as VxeToolbarPropTypes.ToolConfig[],
  };
  if (gridOptions.value?.toolbarConfig?.search && !!formOptions.value) {
    toolbarConfig.tools = Array.isArray(toolbarConfig.tools)
      ? [...toolbarConfig.tools, searchBtn]
      : [searchBtn];
  }

  if (!showToolbar.value) {
    return { toolbarConfig };
  }

  toolbarConfig.slots = {
    ...(slotActions || showTableTitle.value
      ? { buttons: TOOLBAR_ACTIONS }
      : {}),
    ...(slotTools ? { tools: TOOLBAR_TOOLS } : {}),
  };
  return { toolbarConfig };
});

const options = computed(() => {
  const globalGridConfig = VxeUI?.getConfig()?.grid ?? {};

  const mergedOptions: VxeTableGridProps = cloneDeep(
    mergeWithArrayOverride(
      toRaw(toolbarOptions.value),
      toRaw(gridOptions.value),
      globalGridConfig,
    ),
  );

  if (mergedOptions.proxyConfig) {
    const { ajax } = mergedOptions.proxyConfig;
    mergedOptions.proxyConfig.enabled = !!ajax;
    // 不自动加载数据, 由组件控制
    // mergedOptions.proxyConfig.autoLoad = false;
  }

  if (mergedOptions.pagerConfig) {
    const mobileLayouts = [
      'PrevJump',
      'PrevPage',
      'Number',
      'NextPage',
      'NextJump',
    ] as any;
    const layouts = [
      'Total',
      'Sizes',
      'Home',
      ...mobileLayouts,
      'End',
    ] as readonly string[];
    mergedOptions.pagerConfig = mergeWithArrayOverride(
      {},
      mergedOptions.pagerConfig,
      {
        pageSize: 20,
        background: true,
        pageSizes: [10, 20, 30, 50, 100, 200],
        className: 'mt-2 w-full',
        layouts: isMobile.value ? mobileLayouts : layouts,
        size: 'mini' as const,
      },
    );
  }
  if (mergedOptions.formConfig) {
    mergedOptions.formConfig.enabled = false;
  }
  return mergedOptions;
});

function onToolbarToolClick(event: VxeGridDefines.ToolbarToolClickEventParams) {
  if (event.code === 'search') {
    onSearchBtnClick();
  }
  (
    gridEvents.value?.toolbarToolClick as VxeGridListeners['toolbarToolClick']
  )?.(event);
}

function onSearchBtnClick() {
  props.api?.toggleSearchForm?.();
}

const events = computed(() => {
  return {
    ...gridEvents.value,
    toolbarToolClick: onToolbarToolClick,
  };
});

const delegatedSlots = computed(() => {
  const resultSlots: string[] = [];

  for (const key of Object.keys(slots)) {
    if (
      !['empty', 'form', 'loading', TOOLBAR_ACTIONS, TOOLBAR_TOOLS].includes(
        key,
      )
    ) {
      resultSlots.push(key);
    }
  }
  return resultSlots;
});

const showDefaultEmpty = computed(() => {
  // 检查是否有原生的 VXE Table 空状态配置
  const hasEmptyText = options.value.emptyText !== undefined;
  const hasEmptyRender = options.value.emptyRender !== undefined;

  // 如果有原生配置，就不显示默认的空状态
  return !hasEmptyText && !hasEmptyRender;
});
const printRef = ref();

async function init() {
  await nextTick();
  const globalGridConfig = VxeUI?.getConfig()?.grid ?? {};
  const defaultGridOptions: VxeTableGridProps = mergeWithArrayOverride(
    {},
    toRaw(gridOptions.value),
    toRaw(globalGridConfig),
  );
  // 内部主动加载数据，防止form的默认值影响
  const autoLoad = defaultGridOptions.proxyConfig?.autoLoad;
  const enableProxyConfig = options.value.proxyConfig?.enabled;
  if (enableProxyConfig && autoLoad) {
    if (unref(showTableTabs)) {
      const queryData = {
        ...formApi.values,
        [unref(tabsOption)!.formKey]: unref(tabsValue),
      };
      props.api.grid.commitProxy?.('query', queryData);
    } else {
      const queryData = formApi.values;
      props.api.grid.commitProxy?.('query', queryData);
    }
  }
  const formConfig = gridOptions.value?.formConfig;
  if (formConfig && formConfig.enabled) {
    console.warn(
      '[Igourd Vxe Table]: The formConfig in the grid is not supported, please use the `formOptions` props',
    );
  }
  props.api?.setState?.({ gridOptions: defaultGridOptions });
  // form 由 igourd-form 代替，所以需要保证query相关事件可以拿到参数
  extendProxyOptions(props.api, defaultGridOptions, () => {
    if (unref(showTableTabs)) {
      return {
        ...formApi.values,
        [unref(tabsOption)!.formKey]: unref(tabsValue),
      };
    }
    return formApi.values;
  });
}
const { params } = inject(Symbol.for('PageGrid'), {
  params: () => {
    return {};
  },
});
async function handleCommand(command: string) {
  if (command === 'print') {
    printRef.value.open(options.value.printConfig);
  }
  if (command === 'export') {
    // @ts-ignore
    gridOptions.value.loading = true;
    const exportParams = Object.assign(params() || {}, formApi.values);
    if (
      // @ts-ignore
      exportParams[unref(tabsOption)!.formKey] ===
      unref(tabsOption)?.defaultActiveValue
    ) {
      // @ts-ignore
      delete exportParams[unref(tabsOption)!.formKey];
    }
    await gridRef.value?.exportData({ params: exportParams });

    return;
  }
  await gridRef.value?.commitProxy(command);
}
const footerHeight = inject(Symbol.for('Page.FooterHeight'), ref(0));

onMounted(() => {
  props.api?.mount?.(gridRef.value, formApi);
  init();
});

onUnmounted(() => {
  props.api?.unmount?.();
});

const openMoreActions = computed(() => {
  return (
    options.value.toolbarConfig?.import ||
    options.value.toolbarConfig?.export ||
    options.value.toolbarConfig?.print ||
    (Array.isArray(options.value.toolbarConfig?.tools) &&
      options.value.toolbarConfig?.tools.length > 0)
  );
});

const confirmPrintConfig = async (cfg) => {
  props.api.setGridOptions({
    printConfig: { ...cfg },
  });
  const { html } = await props.api.grid.getPrintHtml();
  console.log(html);
  props.api.grid.closePrint();
};
</script>

<template>
  <div
    :class="cn('bg-card rounded-md', className)"
    :style="{ height: `calc(100% - ${footerHeight}px - 0.25rem)` }"
  >
    <PrintDrawer
      v-if="options.printConfig"
      ref="printRef"
      :print-config="options.printConfig"
    />
    <VxeGrid
      ref="gridRef"
      :class="
        cn(
          'px-3',
          {
            'pt-0': showToolbar && !formOptions,
          },
          gridClass,
        )
      "
      v-bind="options"
      v-on="events"
    >
      <!-- <template #printDefault> -->
      <template #printFooter="{ options: printCfg }">
        <ElButton type="primary" @click="confirmPrintConfig(printCfg)">
          {{ $t('common.confirm') }}
        </ElButton>
      </template>
      <!-- </template> -->
      <!-- 左侧操作区域或者title -->
      <template v-if="showToolbar" #toolbar-actions="slotProps">
        <slot v-if="showTableTitle" name="table-title">
          <div v-if="tableTitle" class="mr-1 pl-1 text-[1rem]">
            {{ tableTitle }}
            <IgourdHelpTooltip v-if="tableTitleHelp" trigger-class="pb-1">
              {{ tableTitleHelp }}
            </IgourdHelpTooltip>
          </div>
          <div v-else-if="showTableTabs">
            <Teleport :disabled="!tabsAppenTo" :to="tabsAppenTo" defer>
              <ElRadioGroup
                class="tw-tabs-line"
                @change="handleTabsChange"
                v-model="tabsValue"
              >
                <ElRadioButton
                  :key="btn.value"
                  :value="btn.value"
                  v-for="btn in tabs"
                >
                  {{ $t(btn.label) }}
                </ElRadioButton>
              </ElRadioGroup>
            </Teleport>
          </div>
        </slot>
        <slot name="toolbar-actions" v-bind="slotProps"> </slot>
      </template>

      <!-- 继承默认的slot -->
      <template
        v-for="slotName in delegatedSlots"
        :key="slotName"
        #[slotName]="slotProps"
      >
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
      <template #toolbar-tools="slotProps">
        <slot name="toolbar-tools" v-bind="slotProps"></slot>
        <VxeButton
          icon="vxe-icon-search"
          circle
          class="ml-2"
          v-if="gridOptions?.toolbarConfig?.search && !!formOptions"
          :status="showSearchForm ? 'primary' : undefined"
          :title="$t('common.search')"
          @click="onSearchBtnClick"
        />
      </template>

      <!-- form表单 -->
      <template #form>
        <Teleport
          defer
          :disabled="!searchFormAppendTo"
          :to="searchFormAppendTo"
        >
          <div
            v-if="formOptions"
            v-show="showSearchForm !== false"
            :class="cn('relative rounded')"
          >
            <div class="flex h-9 items-center justify-between align-middle">
              <div class="flex gap-x-1">
                <slot name="form">
                  <Form
                    :use-i18n="useI18n"
                    :scope="props.formOptions?.scope || {}"
                  >
                    <FormButtonGroup :gutter="0">
                      <Submit @submit="formApi.submit(handleSubmit)">
                        {{ $t('common.search') }}
                      </Submit>
                      <ElButton text bg @click="handleReset()">
                        {{ $t('common.reset') }}
                      </ElButton>
                    </FormButtonGroup>
                  </Form>
                </slot>
              </div>
              <div class="flex justify-end gap-x-1">
                <ElText
                  v-if="gridOptions?.toolbarConfig?.refresh"
                  :title="$t('common.refresh')"
                  @click="handleSubmit()"
                >
                  <RefreshRight class="mr-4 size-4 cursor-pointer" />
                </ElText>
                <slot name="table-actions"> </slot>
                <ElDropdown v-if="openMoreActions" @command="handleCommand">
                  <ElButton type="primary">
                    {{ $t('common.action') }}
                    <ArrayDown class="el-icon--right" />
                  </ElButton>
                  <template #dropdown>
                    <ElDropdownMenu>
                      <ElDropdownItem
                        :icon="Import"
                        command="import"
                        v-if="options.toolbarConfig?.import"
                      >
                        {{ $t('common.import') }}
                      </ElDropdownItem>
                      <ElDropdownItem
                        v-if="options.toolbarConfig?.export"
                        command="export"
                        :icon="Export"
                      >
                        {{ $t('common.export') }}
                      </ElDropdownItem>
                      <ElDropdownItem
                        v-if="options.toolbarConfig?.print"
                        command="print"
                        :icon="Print"
                      >
                        {{ $t('common.print') }}
                      </ElDropdownItem>
                      <ElDropdownItem
                        :command="value.code"
                        :key="value.code"
                        :icon="value.iconRender"
                        v-for="value in toolbarOptions.toolbarConfig.tools"
                      >
                        {{ $t(value.name!) }}
                      </ElDropdownItem>
                    </ElDropdownMenu>
                  </template>
                </ElDropdown>
              </div>
            </div>
            <div
              v-if="isSeparator"
              :style="{
                ...(separatorBg ? { backgroundColor: separatorBg } : undefined),
              }"
              class="bg-background-deep h-2 w-full overflow-hidden md:bottom-1 md:h-1"
            ></div>
          </div>
        </Teleport>
      </template>
      <!-- loading -->
      <template #loading>
        <slot name="loading">
          <IgourdLoading :spinning="true" />
        </slot>
      </template>
      <!-- 统一控状态 -->
      <template v-if="showDefaultEmpty" #empty>
        <slot name="empty">
          <EmptyIcon class="mx-auto" />
          <div class="mt-2">{{ $t('common.no-data') }}</div>
        </slot>
      </template>
    </VxeGrid>
  </div>
</template>
