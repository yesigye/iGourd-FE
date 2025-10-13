<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { ElButton, ElCheckbox, ElDrawer } from '@igourd/common-ui';

import Draggable from 'vuedraggable';

const props = defineProps({
  drawerInfoShow: Boolean,
  list: Object,
  cacheKey: String,
  subject: String,
  version: String,
});

const emit = defineEmits(['close-tk', 'confirm-list']);

const { t } = useI18n();

const currentList = reactive(props.list);

const checkAllList = ref({
  vectorCheck: {
    checkAll: true,
    indeterminate: false,
    checkedValue: [],
  },
  basicInfo: {
    checkAll: true,
    indeterminate: false,
    checkedValue: [],
  },
  customerInfo: {
    checkAll: true,
    indeterminate: false,
    checkedValue: [],
  },
  contactInfo: {
    checkAll: true,
    indeterminate: false,
    checkedValue: [],
  },
  financialInfo: {
    checkAll: true,
    indeterminate: false,
    checkedValue: [],
  },
});

const handleClose = () => {
  Object.assign(currentList, props.list);
  emit('close-tk');
};

const saveTableFieldsFn = () => {
  emit('confirm-list', currentList);
  emit('close-tk');
};

const isAllChecked = ref(false);
const isIndeterminate = ref(false);

const handleCheckAll = (val) => {
  const allItems = [
    ...(currentList.formItems || []),
    ...(currentList.customizedInfo || []),
    ...(currentList.contact_items || []),
    ...(currentList.financialItems || []),
  ];

  allItems.forEach((item) => {
    if (!item.required) {
      item.isSelect = val;
    }
  });

  // 同步更新所有分组的选中值
  Object.keys(checkAllList.value).forEach((key) => {
    if (key !== 'vectorCheck') {
      const groupItems = currentList[groupMap[key]] || [];
      checkAllList.value[key].checkedValue = val
        ? groupItems.filter((item) => !item.required).map((item) => item.label)
        : [];
    }
  });

  isIndeterminate.value = false;
  updateAllCheckedStatus();
};

const groupMap = {
  basicInfo: 'formItems',
  customerInfo: 'customizedInfo',
  contactInfo: 'contact_items',
  financialInfo: 'financialItems',
};

// 分组配置
const groupConfig = {
  basicInfo: {
    title: 'purchase.basicInformaion',
    items: 'formItems',
  },
  customerInfo: {
    title: 'purchase.customizedInformation',
    items: 'customizedInfo',
  },
  contactInfo: {
    title: 'purchase.contactInformation',
    items: 'contact_items',
  },
  financialInfo: {
    title: 'purchase.financialInformation',
    items: 'financialItems',
  },
};

// 获取分组选中状态
const getGroupCheckedStatus = (groupKey) => {
  const items = currentList[groupMap[groupKey]] || [];
  const availableItems = items.filter((item) => !item.required);
  const checkedItems = items.filter((item) => item.isSelect && !item.required);

  return {
    checked:
      checkedItems.length === availableItems.length &&
      availableItems.length > 0,
    indeterminate:
      checkedItems.length > 0 && checkedItems.length < availableItems.length,
  };
};

// 处理分组全选
const handleGroupCheckAll = (val, groupKey) => {
  const items = currentList[groupMap[groupKey]];
  if (!items) return;

  items.forEach((item) => {
    if (!item.required) {
      item.isSelect = val;
    }
  });

  checkAllList.value[groupKey].checkedValue = val
    ? items.filter((item) => !item.required).map((item) => item.label)
    : [];

  updateAllCheckedStatus();
};

// 修改原有的handleGroupChange方法
const handleGroupChange = (val, type) => {
  const items = currentList[groupMap[type]];
  if (!items) return;

  items.forEach((item) => {
    if (!item.required) {
      item.isSelect = val.includes(item.label);
    }
  });

  // 更新分组的选中状态
  const groupStatus = getGroupCheckedStatus(type);
  checkAllList.value[type].checkAll = groupStatus.checked;
  checkAllList.value[type].indeterminate = groupStatus.indeterminate;

  updateAllCheckedStatus();
};

// 更新全选状态
const updateAllCheckedStatus = () => {
  // 添加空值检查
  if (
    !currentList.formItems ||
    !currentList.customizedInfo ||
    !currentList.contact_items ||
    !currentList.financialItems
  ) {
    return;
  }

  const allItems = [
    ...currentList.formItems,
    ...currentList.customizedInfo,
    ...currentList.contact_items,
    ...currentList.financialItems,
  ].filter((item) => !item.required);

  const checkedItems = allItems.filter((item) => item.isSelect);

  isAllChecked.value = checkedItems.length === allItems.length;
  isIndeterminate.value =
    checkedItems.length > 0 && checkedItems.length < allItems.length;

  // 更新各分组的选中值，添加空值检查
  checkAllList.value.basicInfo.checkedValue =
    currentList.formItems
      ?.filter((item) => item.isSelect)
      .map((item) => item.label) || [];
  checkAllList.value.customerInfo.checkedValue =
    currentList.customizedInfo
      ?.filter((item) => item.isSelect)
      .map((item) => item.label) || [];
  checkAllList.value.contactInfo.checkedValue =
    currentList.contact_items
      ?.filter((item) => item.isSelect)
      .map((item) => item.label) || [];
  checkAllList.value.financialInfo.checkedValue =
    currentList.financialItems
      ?.filter((item) => item.isSelect)
      .map((item) => item.label) || [];

  // 特别处理动态模块的选中值
  if (currentList.customizedInfo?.length > 0) {
    checkAllList.value.customerInfo.checkedValue = currentList.customizedInfo
      .filter((item) => item.isSelect || item.isSelect === undefined) // 处理未定义的情况
      .map((item) => item.label);
  }
};

// 获取分组内的选中项目
const getGroupItems = (groupKey) => {
  const items = currentList[groupMap[groupKey]] || [];
  return items
    .filter((item) => shouldBeSelected(item))
    .map((item) => ({
      ...item,
      id: `${groupKey}-${item.label}`,
    }));
};

// 处理拖拽结束事件
const handleDragEnd = (evt, groupKey) => {
  const { oldIndex, newIndex } = evt;
  if (oldIndex === newIndex) return;

  // 获取当前分组的数据
  const targetGroup = currentList[groupMap[groupKey]];
  const selectedIndices = targetGroup
    .map((item, index) => (item.isSelect ? index : -1))
    .filter((index) => index !== -1);

  // 更新原数组中选中项的顺序
  const oldRealIndex = selectedIndices[oldIndex];
  const newRealIndex = selectedIndices[newIndex];

  if (oldRealIndex !== undefined && newRealIndex !== undefined) {
    const [movedItem] = targetGroup.splice(oldRealIndex, 1);
    targetGroup.splice(newRealIndex, 0, movedItem);
  }
};

// 添加数据初始化保护
watch(
  () => props.list,
  (newVal) => {
    if (newVal) {
      // 保存之前的动态模块选中状态
      const previousCustomized =
        currentList.customizedInfo?.map((item) => ({
          label: item.label,
          isSelect: item.isSelect,
        })) || [];

      // 更新所有模块
      currentList.formItems = newVal.formItems || [];
      currentList.customizedInfo = newVal.customizedInfo || [];
      currentList.contact_items = newVal.contact_items || [];
      currentList.financialItems = newVal.financialItems || [];

      // 特殊处理动态模块：恢复选中状态或设置默认选中
      if (currentList.customizedInfo.length > 0) {
        currentList.customizedInfo.forEach((item) => {
          const previousItem = previousCustomized.find(
            (prev) => prev.label === item.label,
          );
          // 如果之前存在该项，使用之前的选中状态，否则默认选中
          item.isSelect = previousItem ? previousItem.isSelect : true;
        });
      }

      updateAllCheckedStatus();
    }
  },
  { immediate: true },
);

// 添加一个工具函数来检查项目是否应该被选中
const shouldBeSelected = (item) => {
  // 动态模块，如果 isSelect 未定义，默认为选中
  if (
    item.isSelect === undefined &&
    currentList.customizedInfo?.includes(item)
  ) {
    return true;
  }
  return item.isSelect;
};

// 组件挂载时进行初始化
onMounted(() => {
  if (props.list) {
    updateAllCheckedStatus();
  }
});
</script>

<template>
  <div class="drawerlist-box">
    <ElDrawer
      size="60%"
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
          <div class="checkboxGroup">
            <div class="checkboxAll">
              <div class="checkRoot">
                <ElCheckbox
                  v-model="isAllChecked"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAll"
                >
                  {{ t('common.selectAll') }}
                </ElCheckbox>
              </div>
              <div v-for="(group, groupKey) in groupConfig" :key="groupKey">
                <div class="section-title">
                  <ElCheckbox
                    :model-value="getGroupCheckedStatus(groupKey).checked"
                    :indeterminate="
                      getGroupCheckedStatus(groupKey).indeterminate
                    "
                    @change="(val) => handleGroupCheckAll(val, groupKey)"
                  >
                    {{ t(group.title) }}
                  </ElCheckbox>
                </div>
                <el-checkbox-group
                  v-model="checkAllList[groupKey].checkedValue"
                  @change="(val) => handleGroupChange(val, groupKey)"
                >
                  <ElCheckbox
                    v-for="(child, l) in currentList[group.items]"
                    :key="l"
                    :disabled="child.required"
                    :label="child.label"
                    class="checkboxList"
                  >
                    {{ t(child.label) }}
                  </ElCheckbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="btn_group">
              <ElButton @click="handleClose">
                {{ t(`common.cancelBtn`) }}
              </ElButton>
              <ElButton type="primary" @click="saveTableFieldsFn">
                {{ t('common.save') }}
              </ElButton>
            </div>
          </div>

          <div class="right_box">
            <div class="r_title">
              <p>{{ t('common.selectedFields') }}</p>
              <p style="font-size: 12px; color: #005cff">
                (* {{ t('common.supportsDragAndDropSorting') }})
              </p>
            </div>
            <div class="item_list" ref="draggableBox">
              <div
                v-for="(group, groupKey) in groupConfig"
                :key="groupKey"
                class="drag-group"
              >
                <div
                  class="group-title"
                  v-if="getGroupItems(groupKey).length > 0"
                >
                  {{ t(group.title) }}
                </div>
                <Draggable
                  :list="getGroupItems(groupKey)"
                  :group="groupKey"
                  item-key="id"
                  animation="300"
                  @end="(evt) => handleDragEnd(evt, groupKey)"
                >
                  <template #item="{ element }">
                    <div class="item">
                      <span class="iconfont icon-tuodong"></span>
                      {{ t(element.label) }}
                    </div>
                  </template>
                </Draggable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ElDrawer>
  </div>
</template>

<style lang="scss" scoped>
.el-checkbox-group {
  margin-left: 20px;
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
  }
}

.checkboxGroup {
  position: relative;
  box-sizing: border-box;
  width: 50%;
  margin-right: 7px;
  overflow: hidden;
  overflow-y: scroll;
  border: 1px solid #eee;
  border-radius: 8px;
}

.checkboxAll {
  padding: 10px;
}

.btn_group {
  position: sticky;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  justify-content: space-around;
  padding-bottom: 10px;
  background-color: #fff;
}

.checkRoot {
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.right_box {
  width: 50%;
  padding: 10px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;

  .r_title {
    height: 24px;
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 24px;
    color: #3a3f63;
  }

  .item_list {
    max-height: calc(100% - 44px);
    padding-right: 10px;
    overflow: auto;

    .item {
      position: relative;
      display: flex;
      align-items: center;
      height: 40px;
      padding-left: 30px;
      margin: 0 auto 10px;
      font-size: 14px;
      cursor: move;
      background: #f5f5fa;
      border-radius: 8px;

      &:hover {
        background-color: #eeeef7;

        .icon-tuodong {
          opacity: 1;
        }
      }

      .icon-tuodong {
        position: absolute;
        top: 50%;
        left: 10px;
        color: #7e84a3;
        opacity: 0;
        transform: translateY(-50%);
      }
    }
  }
}

.close45 {
  right: calc(60% - 30px) !important;
}

.checkboxList {
  display: block;
}

.section-title {
  display: flex;
  align-items: center;
  margin: 10px 0;
  font-size: 14px;
  color: #606266;
}

.drag-group {
  margin-bottom: 20px;

  .group-title {
    padding-left: 8px;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #606266;
    border-left: 3px solid #005cff;
  }
}
</style>
