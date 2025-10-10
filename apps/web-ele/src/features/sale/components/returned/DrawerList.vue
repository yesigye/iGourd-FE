<!--
  @description: 自定义列表组件
  @params:
    subject = "CL_damai"; 项目名称以CL开头，以项目名称结尾，中间以_分割
    cacheKey = "tableFields"; 自定义列表table的key值
    version = "1.0.0";  版本号，如果版本号不一致，则会重新处理数据；版本号为-1时，不进行版本号校验，直接处理数据
    list = []; 传入的table列表数据
    drawerInfoShow = false; 是否显示抽屉
  @methods:
    const emit = defineEmits(["close-tk", "confirm-list"]);
    handleClose(); 关闭抽屉
    saveTableFieldsFn(); 保存按钮点击事件
    checkBoxIndexFn(e, index); 左侧列表点击事件
    deleteFn(item, index); 右侧列表点击事件
    getCheckList(value); 获取本地存储的数据
  @return:
    emit("confirm-list", checkDrawList.value); 返回处理后的数据
  @建议：
  version
  可以使用外层项目的package.json中的version字段，
  如果不使用package.json中的version字段，则可以在main中生成一个随机uuid，
  保证在项目不刷新的情况下，版本号一致，避免多次重复去处理数据
-->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import {
  ElButton,
  ElCheckbox,
  ElDrawer,
  vuedraggable,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { ElMessage } from 'element-plus';

const props = defineProps({
  subject: {
    type: String,
    default: 'CL',
  },
  list: {
    type: Array,
    default: () => {
      return [];
    },
  },
  drawerInfoShow: {
    type: Boolean,
    default: true,
  },
  cacheKey: {
    type: String,
    default: '',
  },
  version: {
    type: String,
    default: '1.0.0',
  },
});

const emit = defineEmits(['close-tk', 'confirm-list']);

const { t } = useI18n();

//

interface Item {
  label: string; // 显示的中文名称
  enlabel: string; // 显示的英文名称
  prop: string; // 唯一标识
  isSelect: boolean; // 是否选中
  disabled: boolean; // 是否禁用不允许操作
  'show-overflow-tooltip': boolean;
  width: number; // 宽度
  tips: string; // 提示信息
}
const currentList: any = ref([]);
onMounted(() => {
  if (!props.cacheKey) {
    ElMessage.error('请传入cacheKey');
    return;
  }
  currentList.value = JSON.parse(JSON.stringify(props.list));
  getCheckList(currentList.value);
});
// 关闭抽屉
const handleClose = () => {
  // 取消重置数据
  currentList.value = JSON.parse(JSON.stringify(props.list));
  getCheckList(currentList.value);
  emit('close-tk');
};
const checkBoxIndexFn = (item: any, index: number | string) => {
  // 从原始数据中读取显示隐藏状态
  // item.isSelect = !item.isSelect
  currentList.value.splice(index, 1, item);
  const _drawIndex = checkDrawList.value.findIndex((e) => {
    return e.prop == item.prop;
  });
  checkDrawList.value[_drawIndex].isSelect =
    !checkDrawList.value[_drawIndex].isSelect;
};
const deleteFn = (item: Item, index: number) => {
  item.isSelect = !item.isSelect;
  checkDrawList.value.splice(index, 1, item);
  const _drawIndex = currentList.value.findIndex((e: Item) => {
    return e.prop == item.prop;
  });
  currentList.value[_drawIndex].isSelect =
    !currentList.value[_drawIndex].isSelect;
};
const saveTableFieldsFn = () => {
  ElMessage.success(t('common.saveSuccess'));
  console.log(
    '保存的数据啊啊啊啊啊',
    JSON.parse(JSON.stringify(checkDrawList.value)),
  );
  emit('confirm-list', JSON.parse(JSON.stringify(checkDrawList.value)));
  if (props.cacheKey) {
    const CL_local = JSON.parse(localStorage.getItem(props.subject) || '{}');
    CL_local[props.cacheKey] = CL_local[props.cacheKey] || {};
    // 改变本地版本号
    if (CL_local[props.cacheKey].version != props.version) {
      CL_local[props.cacheKey].version = props.version;
    }
    CL_local[props.cacheKey].list = checkDrawList.value;
    localStorage.setItem(props.subject, JSON.stringify(CL_local));
  }
};
const checkDrawList = ref([] as Item[]);
const getCheckList = (value: Item[]) => {
  const CL_local = JSON.parse(localStorage.getItem(props.subject) || '{}');
  CL_local[props.cacheKey] = CL_local[props.cacheKey] || {};
  if (CL_local[props.cacheKey].version) {
    const _checkDrawList = CL_local[props.cacheKey].list;
    const arrayA = JSON.parse(JSON.stringify(currentList.value));
    const arrayB = JSON.parse(JSON.stringify(_checkDrawList));
    if (
      CL_local[props.cacheKey].version != props.version ||
      props.version == '-1'
    ) {
      // 版本号不匹配则重新处理数据
      // 由于版本号进行了变更，先进行字符串数组对比，如果数组属性相同，则不予处理；
      const newAddList = [] as Item[]; // 新增的数据
      arrayA.forEach((itemA: Item) => {
        const _obj = arrayB.find((itemB: Item) => itemA.prop === itemB.prop);
        if (_obj) {
          itemA.isSelect = _obj.isSelect;
        } else {
          newAddList.push(itemA);
        }
      });
      const newArrayB = []; // 删除原始数据中已经被删除的数据
      arrayB.forEach((itemB: Item) => {
        const _obj = arrayA.find((itemA: Item) => itemA.prop === itemB.prop);
        if (_obj) {
          let _itemB = JSON.parse(JSON.stringify(itemB));
          _itemB = _obj;
          _itemB.isSelect = itemB.isSelect;
          newArrayB.push(_itemB);
        }
      });
      newArrayB.push(...newAddList);
      currentList.value = arrayA;
      checkDrawList.value = newArrayB;
    } else {
      // 版本号相等，则右侧数据读取本地数据
      // 左侧数据要拿原始数据进行和右侧匹配，更改相应的状态
      arrayA.forEach((itemA: Item) => {
        const _index = arrayB.findIndex(
          (itemB: Item) => itemA.prop === itemB.prop,
        );
        const _obj = arrayB[_index];
        if (_obj) {
          itemA.isSelect = _obj.isSelect;
          arrayB[_index].label = itemA.label; // 防止名称变更
        }
      });
      currentList.value = arrayA;
      checkDrawList.value = arrayB;
    }
    // 数据变更后，进行自动存储
    CL_local[props.cacheKey].version = props.version;
    CL_local[props.cacheKey].list = checkDrawList.value;
    localStorage.setItem(props.subject, JSON.stringify(CL_local));
  } else {
    // 不存在版本号则是新用户
    checkDrawList.value = JSON.parse(JSON.stringify(value));
  }
};
const leftColumnList = computed(() => {
  const midPoint = Math.ceil(currentList.value.length / 2);
  return currentList.value.slice(0, midPoint);
});

const rightColumnList = computed(() => {
  const midPoint = Math.ceil(currentList.value.length / 2);
  return currentList.value.slice(midPoint);
});
// 全选操作
const selectAll = ref(false);
const selectableList = computed(() =>
  currentList.value.filter((item) => !item.disabled),
);
const disabledList = computed(() =>
  currentList.value.filter((item) => item.disabled),
);

// 全选/取消全选处理函数
const handleSelectAll = (val: boolean) => {
  // 更新左侧可选项的选择状态
  selectableList.value.forEach((item) => {
    item.isSelect = val;
  });

  // 更新右侧列表
  if (val) {
    // 全选时，将所有可选项添加到右侧列表
    checkDrawList.value = [
      ...disabledList.value, // 保留禁用的选项
      ...selectableList.value.map((item) => ({
        ...item,
        isSelect: true,
      })),
    ];
  } else {
    // 取消全选时，仅保留禁用的选项
    checkDrawList.value = checkDrawList.value.filter((item) => item.disabled);
  }

  // 同步更新 currentList 中的选择状态
  currentList.value = currentList.value.map((item) => ({
    ...item,
    isSelect: item.disabled ? item.isSelect : val,
  }));
};

// 监听各个选项的变化来更新全选状态
watch(
  () => selectableList.value.map((item) => item.isSelect),
  (newValues) => {
    selectAll.value = newValues.every((val) => val === true);
  },
  { deep: true },
);
// 监听cacheKey变化，更新本地存储数据
watch(
  () => props.cacheKey,
  (newvlaue) => {
    if (newvlaue) {
      currentList.value = JSON.parse(JSON.stringify(props.list));

      getCheckList(currentList.value);
    }
  },
);
</script>

<template>
  <div class="drawerlist-box">
    <ElDrawer
      size="45%"
      :model-value="props.drawerInfoShow"
      :append-to-body="true"
      :with-header="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      custom-class="custom-drawer-class"
    >
      <div class="close45" @click="handleClose">
        <i class="iconfont icon-guanbi"></i>
      </div>
      <div class="content">
        <div class="title">{{ t('common.fields') }}</div>
        <div class="wrap_box">
          <div class="left_box">
            <div class="select-all">
              <ElCheckbox v-model="selectAll" @change="handleSelectAll">
                {{ t('common.selectAll') }}
              </ElCheckbox>
            </div>
            <div class="el-checkbox-group">
              <div class="checkbox-column">
                <ElCheckbox
                  v-for="(child, l) in leftColumnList"
                  :key="l"
                  v-model="child.isSelect"
                  :disabled="child.disabled"
                  :checked="child.isSelect"
                  @click.stop="checkBoxIndexFn(child, l)"
                >
                  <span class="checkbox-label">{{
                    t(`${child.key}.${child.localKey}`)
                  }}</span>
                </ElCheckbox>
              </div>
              <div class="checkbox-column" v-if="rightColumnList.length > 0">
                <ElCheckbox
                  v-for="(child, l) in rightColumnList"
                  :key="l + leftColumnList.length"
                  v-model="child.isSelect"
                  :disabled="child.disabled"
                  :checked="child.isSelect"
                  @click.stop="
                    checkBoxIndexFn(child, l + leftColumnList.length)
                  "
                >
                  {{ t(`${child.key}.${child.localKey}`) }}
                </ElCheckbox>
              </div>
            </div>
            <div class="btn_group">
              <ElButton class="cancel-btn" @click="handleClose">
                {{ t(`common.cancelBtn`) }}
              </ElButton>
              <ElButton class="save-btn" @click="saveTableFieldsFn">
                {{ t('common.save') }}
              </ElButton>
            </div>
          </div>
          <div class="right_box">
            <div class="r_title">
              <p>{{ t('common.selectedFields') }}</p>
              <p class="drag-hint">
                {{ t('common.supportsDragAndDropSorting') }}
              </p>
            </div>
            <div class="item_list" ref="draggableBox">
              <vuedraggable
                :list="checkDrawList"
                item-key="label"
                animation="300"
              >
                <template #item="{ element, index }">
                  <div
                    class="item"
                    v-if="!element.disabled && element.isSelect"
                  >
                    <span class="iconfont icon-tuodong"></span>
                    <span class="item-text">{{
                      t(`${element.key}.${element.localKey}`)
                    }}</span>
                    <span
                      class="iconfont icon-guanbi"
                      @click="deleteFn(element, index)"
                    ></span>
                  </div>
                </template>
              </vuedraggable>
            </div>
          </div>
        </div>
      </div>
    </ElDrawer>
  </div>
</template>
<style lang="scss" scoped>
.drag-hint {
  font-size: 12px;
  color: rgb(69 151 246);
}

.content {
  height: 100%;
  padding: 20px 20px 38px;
  background-color: #fff;

  .title {
    position: absolute;
    height: 44px;
    font-size: 18px;
    line-height: 24px;
    color: #131523;
  }

  .wrap_box {
    display: flex;
    justify-content: space-between;
    height: 96%;
    margin-top: 44px;
    overflow: auto;
    background: #fff;
    border-radius: 8px;

    .left_box {
      position: relative; // 相对定位
      display: flex; // 弹性布局
      flex-direction: column; // 垂直方向排列
      width: 60%;
      min-width: 300px;
      padding: 20px;
      margin-right: 20px;
      background-color: #fff;
      border: 1px solid #eee;
      border-radius: 8px;

      .detail_box {
        height: 100%;

        .content_detail {
          position: relative;
          height: 100%;
          background-color: #fff;

          .itembox {
            display: flex;
            margin-bottom: 30px;

            .el-checkbox {
              width: 155px;
              margin-top: 10px;

              &:nth-of-type(1) {
                margin-top: 0 !important;
              }
            }
          }
        }
      }
    }

    .right_box {
      width: 40%;
      min-width: 250px;
      padding: 20px 10px 20px 20px;
      background: #fff;
      border: 1px solid #eee;
      border-radius: 8px;

      .r_title {
        height: auto;
        // line-height: 24px;
        margin-bottom: 10px;
        font-size: 16px;
        color: #3a3f63;
      }

      .item_list {
        max-height: calc(100% - 60px);
        padding-right: 10px;
        overflow: auto;

        .item {
          position: relative;
          display: flex;
          align-items: center;
          height: 40px;
          padding-left: 15px;
          margin: 0 auto 10px;
          font-size: 14px;
          background: #f5f5fa;
          border-radius: 8px;

          .item-text {
            flex: 1;
            margin: 0 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .icon-tuodong {
            position: absolute;
            top: 50%;
            left: 10px;
            color: #7e84a3;
            cursor: move;
            transform: translateY(-50%);
          }

          .icon-guanbi {
            position: absolute;
            top: 50%;
            right: 15px;
            font-size: 12px;
            color: #7e84a3;
            cursor: pointer;
            transform: translateY(-50%) scale(0.9);
          }
        }
      }
    }
  }
}

.btn_group {
  position: absolute;
  bottom: 20px;
  left: 50%;
  display: flex;
  gap: 10px; // 按钮之间的间距
  justify-content: center;
  transform: translateX(-50%);

  .cancel-btn,
  .save-btn {
    width: 130px;
    height: 40px;
  }
}

.el-checkbox-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-height: calc(100% - 150px); // 调整高度,为按钮和全选留出空间
  padding-right: 10px;
  overflow-y: auto;

  .checkbox-column {
    display: flex;
    flex-direction: column;
    width: 48%; // 或者使用具体的像素值

    .el-checkbox {
      margin-bottom: 10px;

      .checkbox-label {
        display: inline-block;
        // max-width: 98%; // 调整宽度
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: bottom; // 确保文本垂直对齐
        white-space: nowrap;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

// 确保按钮组不会被滚动内容遮挡
.btn_group {
  position: absolute;
  bottom: 20px;
  left: 50%;
  display: flex;
  gap: 10px;
  justify-content: center;
  width: 100%;
  padding: 10px 0;
  background-color: #fff;
  transform: translateX(-50%);
}

// 调整左侧盒子的样式以适应新的布局
.left_box {
  display: flex;
  flex-direction: column;
  padding-bottom: 80px; // 为底部按钮留出空间
}

.icon-tuodong {
  opacity: 0;
}

.select-all {
  margin-bottom: 10px;
  border-bottom: 1px solid #d4e1f1;
}

.disabled-options {
  padding-top: 10px;
  margin-top: 20px;
  border-top: 1px solid #eee;

  h4 {
    margin-bottom: 10px;
    color: #606266;
  }
}

.item {
  cursor: move;
}

.sortable-chosen {
  background-color: #eeeef7 !important;

  .icon-tuodong {
    opacity: 1 !important;
  }
}

.item:hover {
  background-color: #eeeef7 !important;

  .icon-tuodong {
    opacity: 1 !important;
  }
}

.close {
  position: absolute;
  top: 50%;
  left: -10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 70px;
  cursor: pointer;
  background: #9598ae;
  border-radius: 2px;
  transform: translateY(-50%);

  &::after {
    position: absolute;
    inset: -15px;
    content: '';
  }

  .icon-guanbi {
    font-size: 12px;
    color: #fff;
  }
}

:deep(.close) {
  color: #fff;
  background: #9598ae;

  i {
    color: #fff;
  }
}
</style>
