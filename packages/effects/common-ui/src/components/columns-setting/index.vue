<!-- eslint-disable no-unused-vars -->
<!-- /**
 * @file 列设置组件
 * @description 用于设置表格的列排序、显示隐藏、固定列
 * copy from 何老师写的 ag-grid-table 的列设置组件
 */ -->
<script lang="ts" setup>
import type { ColumnsSettingProps, ElTableSettingColumns } from './types';

import { nextTick, ref, watchEffect } from 'vue';

import { useBodyWidth, useClickOutside } from '@igourd/hooks';
import { useI18n } from '@igourd/locales';

import {
  ElCheckbox,
  ElCheckboxGroup,
  ElLink,
  ElMessage,
  ElPopover,
} from 'element-plus';
import * as Draggable from 'vuedraggable';

// 定义子组件传递参数，设置默认值
const props = withDefaults(
  defineProps<Pick<ColumnsSettingProps, 'columns' | 'hideFixed'>>(),
  {
    columns: () => [],
    hideFixed: () => false,
  },
);

const emits = defineEmits(['updateColumns']);

const { t } = useI18n();

const visible = ref(false);

const columnPopoverRef = ref<Element | null>(null);
const popoverContent = ref<Element | null>(null);
useClickOutside(visible, popoverContent, (contains) => {
  if (visible.value && !contains) {
    visible.value = false;
  }
});

function renderColumnsInnner() {
  renderColumns(props.columns);
  visible.value = !visible.value;
}

defineExpose({
  showPop: renderColumnsInnner,
});

const checkAll = ref<boolean>(false);
const checkedCities = ref<string[]>([]);
const draggableList = ref<ElTableSettingColumns[]>([]);

function renderColumns(columnsTable: ElTableSettingColumns[]) {
  const values = props.columns;
  // eslint-disable-next-line unicorn/no-array-reduce
  const { keyList, valueList } = columnsTable.reduce(
    (aur, cur) => {
      if (!cur.hide) aur.keyList.push(cur.prop);
      aur.valueList.push(cur);
      return aur;
    },
    { keyList: [] as string[], valueList: [] as ElTableSettingColumns[] },
  );

  checkedCities.value = keyList;
  draggableList.value = [...valueList];
  checkAll.value = checkedCities.value?.length === values.length;
}

const handleCheckAllChange = (isCheckedAll: boolean) => {
  const sortDisabledList = props.columns
    .filter((item) => item?.actions?.disableUncheck)
    .map((item) => item.prop);
  checkedCities.value = isCheckedAll
    ? props.columns.map((item) => item.prop)
    : sortDisabledList;
  handleSave();
};

const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === props.columns.length;
  handleSave();
};
// @ts-ignore
function handleFiexd(element, position) {
  if (element?.sortDisabled) {
    return ElMessage.warning('该选项被禁用');
  }
  if (element.fixed) {
    element.fixed = element.fixed === position ? null : position;
  } else {
    element.fixed = position;
  }
  handleSave();
}

const onDragEnd = () => {
  handleSave();
};

const handleSave = () => {
  const newColumns = [...draggableList.value].map((item) => {
    const { _, ...other } = item;
    return { ...other, hide: !checkedCities.value.includes(item.prop) };
  });

  nextTick(() => {
    emits('updateColumns', newColumns);
  });
};
const { bodyWidth } = useBodyWidth();
const popoverContentWidth = ref('400px');
enum popoverContentWidthEnum {
  auto = 'auto',
  px = '400px',
}
watchEffect(() => {
  if (popoverContent.value) {
    if (bodyWidth.value < 400) {
      if (popoverContentWidth.value === popoverContentWidthEnum.auto) {
        // 避免重复操作dom
        return;
      }
      popoverContentWidth.value = popoverContentWidthEnum.auto;
      // @ts-ignore
      popoverContent.value.style.width = popoverContentWidthEnum.auto;
    } else {
      if (popoverContentWidth.value === popoverContentWidthEnum.px) {
        // 避免重复操作dom
        return;
      }
      popoverContentWidth.value = popoverContentWidthEnum.px;
      // @ts-ignore
      popoverContent.value.style.width = popoverContentWidthEnum.px;
    }
  }
});
const handleChangeMove = () => {
  /*
    evt.dragged; // 被拖拽的对象
    evt.draggedRect; // 被拖拽的对象所在区域 {left, top, right, bottom}
    evt.related; // 被替换的对象
    evt.relatedRect; // DOMRect
    evt.willInsertAfter; // 是在被替换对象的前面还是后面
    originalEvent.clientY; // 鼠标的位置
  */
  // document.getElementById("msg1").innerHTML = "你正在拖动：" + evt.dragged.dataset.id + ",替换了：" + evt.related.dataset.id + ";time：" + (new Date()).toLocaleString();
  handleSave();
  return true;
};
</script>

<template>
  <ElPopover
    ref="columnPopoverRef"
    width="auto"
    placement="bottom-end"
    popper-class="cs-popver"
    :visible="visible"
    overlay-class-name="column-setting__cloumn-list"
  >
    <div class="cs" ref="popoverContent">
      <div class="cs-top">
        <ElCheckbox v-model="checkAll" @change="handleCheckAllChange">
          {{ t('common.select-all') }}
        </ElCheckbox>
      </div>
      <div class="cs-center">
        <ElCheckboxGroup
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <Draggable
            filter=".disabled"
            :list="draggableList"
            item-key="prop"
            animation="300"
            @end="onDragEnd"
            @move="handleChangeMove"
          >
            <template #item="{ element }">
              <div
                class="cs-block"
                :class="[{ disabled: element?.sortDisabled }]"
              >
                <div class="cs-block-left">
                  <ElCheckbox
                    :label="element.label"
                    :value="element.prop"
                    :disabled="element?.actions?.disableUncheck"
                  >
                    {{ element.label }}
                  </ElCheckbox>
                  <span
                    class="iconfont icon-tuodongbingdianzhentuodongpaixu"
                  ></span>
                </div>
                <div v-if="!props.hideFixed" class="cs-block-right">
                  <span
                    class="cs-block-fiexd cs-block-fiexd--left"
                    :class="[{ active: element.fixed === 'left' }]"
                    @click.stop="handleFiexd(element, 'left')"
                  >
                    <i class="iconfont icon-fix"></i>
                  </span>
                  <span
                    class="cs-block-fiexd cs-block-fiexd--right"
                    :class="[{ active: element.fixed === 'right' }]"
                    @click.stop="handleFiexd(element, 'right')"
                  >
                    <i class="iconfont icon-fix"></i>
                  </span>
                </div>
              </div>
            </template>
          </Draggable>
        </ElCheckboxGroup>
      </div>
    </div>
    <template #reference>
      <slot>
        <ElLink
          class="cs-filed-action"
          @click="renderColumnsInnner"
          :underline="false"
        >
          <i class="iconfont icon-liebiaoshezhixianshi"> </i>
        </ElLink>
      </slot>
    </template>
  </ElPopover>
</template>

<style lang="scss">
.cs-popver {
  padding: 0 !important;
}
</style>

<style lang="scss" scoped>
.cs {
  width: 400px;

  &-top {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    height: 34px;
    padding: 0 20px;
    border-bottom: solid 1px #e4e7ed;
  }

  &-center {
    box-sizing: border-box;
    padding: 10px 20px;

    :deep(.is-checked):not(.is-disabled) {
      .el-checkbox__label {
        color: #0d99ff;
      }
    }

    .disabled {
      .cs-block-fiexd {
        color: #a8abb2 !important;
      }
    }
  }

  &-block {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-left {
      .iconfont {
        margin-left: 10px;
      }
    }

    &-fiexd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      margin-left: 10px;

      &.active {
        color: #0d99ff;
      }

      &--right {
        transform: rotate(-90deg);
      }
    }
  }

  &-footer {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 47px;
    padding: 0 20px;
    border-top: solid 1px #e4e7ed;
  }
}
</style>
