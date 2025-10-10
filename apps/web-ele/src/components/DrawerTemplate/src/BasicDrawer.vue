<script lang="ts" setup>
import type { CSSProperties } from 'vue';

import type { DrawerInstance, DrawerProps } from './typing';

import {
  computed,
  getCurrentInstance,
  nextTick,
  ref,
  toRaw,
  unref,
  watch,
} from 'vue';

import { ElDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useAttrs } from '#/common/hooks/core/useAttrs';
import { useDesign } from '#/common/hooks/web/useDesign';
import { deepMerge } from '#/common/utils';
import { isFunction, isNumber } from '#/common/utils/is';
import { ScrollContainer } from '#/components/Container/index';

// import { ElDrawer } from 'element-plus';
import DrawerClose from './components/DrawerClose.vue';
import DrawerFooter from './components/DrawerFooter.vue';
import DrawerHeader from './components/DrawerHeader.vue';
import { basicProps } from './props';
// import { WaterMark } from '@/components/WaterMark';

defineOptions({ inheritAttrs: false });

const props = defineProps(basicProps);

const emit = defineEmits(['open-change', 'ok', 'close', 'register']);

const openRef = ref(false);
const attrs = useAttrs();
const propsRef = ref<Partial<DrawerProps | null>>(null);

const { t } = useI18n();
const { prefixVar, prefixCls } = useDesign('basic-drawer');

const drawerInstance: DrawerInstance = {
  getDrawerProps: getDrawerProps as any,
  setDrawerProps: setDrawerProps as any,
  emitOpen: undefined,
};

const instance = getCurrentInstance();

instance && emit('register', drawerInstance, instance.uid);

const getMergeProps: any = computed((): DrawerProps => {
  return deepMerge(toRaw(props), unref(propsRef)) as any;
});

const getProps = computed((): DrawerProps => {
  const opt = {
    placement: 'right',
    ...unref(attrs),
    ...unref(getMergeProps),
    modelValue: unref(openRef),
  };
  opt.title = undefined;
  const { isDetail, size, wrapClassName, getContainer } = opt;
  if (isDetail) {
    if (!size) opt.size = '100%';
    opt.size = size;
    const detailCls = `${prefixCls}__detail`;
    opt.rootClassName = wrapClassName
      ? `${wrapClassName} ${detailCls}`
      : detailCls;

    if (!getContainer) opt.getContainer = `.${prefixVar}-layout-content`;
  }
  return opt as DrawerProps;
});

const getBindValues = computed((): DrawerProps => {
  return {
    ...attrs,
    ...unref(getProps),
  };
});

// Custom implementation of the bottom button,
const getFooterHeight = computed(() => {
  const { footerHeight, showFooter } = unref(getProps);
  if (showFooter && footerHeight) {
    return isNumber(footerHeight)
      ? `${footerHeight}px`
      : `${(footerHeight as string).replace('px', '')}px`;
  }
  return `0px`;
});

const getScrollContentStyle = computed((): CSSProperties => {
  const footerHeight = unref(getFooterHeight);
  return {
    position: 'relative',
    height: `calc(100% - ${footerHeight})`,
  };
});

const getLoading = computed(() => {
  return !!unref(getProps)?.loading;
});

watch(
  () => props.open,
  (newVal, oldVal) => {
    if (newVal !== oldVal) openRef.value = newVal;
  },
  { deep: true },
);

watch(
  () => openRef.value,
  (open) => {
    nextTick(() => {
      emit('open-change', open);
      instance && drawerInstance.emitOpen?.(open, instance.uid);
    });
  },
);

// Cancel event
async function onClose() {
  const { closeFunc } = unref(getProps);
  if (closeFunc && isFunction(closeFunc)) {
    const res = await closeFunc();
    openRef.value = !res;
    emit('close');
    return;
  }
  openRef.value = false;
  emit('close');
}

function getDrawerProps(): Partial<DrawerProps> {
  return getProps.value;
}

function setDrawerProps(props: Partial<DrawerProps>): void {
  // Keep the last setDrawerProps
  propsRef.value = deepMerge(unref(propsRef) || ({} as any), props);

  if (Reflect.has(props, 'open')) openRef.value = !!props.open;
}

function handleOk() {
  emit('ok');
}
</script>

<template>
  <ElDrawer v-bind="getBindValues" :class="prefixCls" :before-close="onClose">
    <template v-if="!$slots.title" #header>
      <DrawerHeader
        :title="getMergeProps.title"
        :help-message="getMergeProps.helpMessage"
        :is-detail="isDetail"
        :show-detail-back="showDetailBack"
        @close="onClose"
      >
        <template #titleToolbar>
          <slot name="titleToolbar"></slot>
        </template>
      </DrawerHeader>
    </template>
    <template v-else #title>
      <slot name="title"></slot>
    </template>
    <DrawerClose @close="onClose" />
    <!-- <WaterMark :gap="[40, 40]" :font="{ fontSize: 18 }"> -->
    <ScrollContainer
      v-loading="getLoading"
      :style="getScrollContentStyle"
      :loading-tip="loadingText || t('messages.elementPlus.loadingText')"
      :view-style="scrollViewStyle"
    >
      <slot></slot>
    </ScrollContainer>
    <!-- </WaterMark> -->
    <DrawerFooter
      v-bind="getProps"
      :is-detail="isDetail"
      :height="getFooterHeight"
      @close="onClose"
      @ok="handleOk"
    >
      <template v-for="item in Object.keys($slots)" #[item]="data">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </DrawerFooter>
    <template #extra>
      <slot name="extra"></slot>
    </template>
  </ElDrawer>
</template>

<style lang="scss">
$header-height: 60px;
$detail-header-height: 40px;
$prefix-cls: 'hly-basic-drawer';
$prefix-cls-detail: 'hly-basic-drawer__detail';

.hly-basic-drawer {
  position: relative;
  overflow: visible !important;

  .el-drawer__header {
    padding: 15px 35px;
    margin: 0;
    border-bottom: 1px solid #eee;
  }

  .el-drawer__body {
    height: calc(100% - $header-height);
    padding: 0;
    background-color: var(--component-background);

    .scrollbar__wrap {
      padding: 16px !important;
      margin-bottom: 0 !important;
    }

    > .scrollbar > .scrollbar__bar.is-horizontal {
      display: none;
    }
  }
}

.hly-basic-drawer__detail {
  position: absolute;

  .el-drawer__header {
    box-sizing: border-box;
    width: 100%;
    height: $detail-header-height;
    padding: 0;
    border-top: 1px solid;
  }

  .scrollbar__wrap {
    padding: 0 !important;
  }
}

.basic-drawer.ant-drawer-bottom {
  .ant-drawer-body {
    .scrollbar__wrap {
      .scrollbar__view {
        height: 100%;
      }
    }
  }
}
</style>
