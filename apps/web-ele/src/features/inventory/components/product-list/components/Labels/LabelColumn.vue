<script setup>
import { computed, ref } from 'vue';

import { ElButton, ElDialog, ElIcon, ElInput } from '@igourd/common-ui';

import { Search } from '@element-plus/icons-vue';

// 定义组件的props
const props = defineProps({
  // 当前行的标签列表
  rowLabels: {
    type: Array,
    default: () => [],
  },
  // 所有可选标签列表
  allLabels: {
    type: Array,
    default: () => [],
  },
  // 当前行的ID
  rowId: {
    type: [String, Number],
    required: true,
  },
});

// 定义组件的emit事件
const emit = defineEmits([
  'update-labels', // 更新标签时触发
  'fetch-all-labels', // 需要获取所有标签时触发
]);

// 组件内部状态
const selectedLabels = ref([]); // 当前选中的标签
const dialogVisible = ref(false);
const searchKeyword = ref('');

// 搜索结果
const searchResults = computed(() => {
  if (!searchKeyword.value) return props.allLabels;
  return props.allLabels.filter((label) =>
    label.name.toLowerCase().includes(searchKeyword.value.toLowerCase()),
  );
});

// 检查标签是否被选中
const isSelected = (label) => {
  return selectedLabels.value.some((l) => l?.id === label?.id);
};

// 选择标签
const selectLabel = (label) => {
  if (isSelected(label)) {
    removeLabel(label);
  } else {
    selectedLabels.value.push(label);
  }
};

// 移除标签
const removeLabel = (label) => {
  const index = selectedLabels.value.findIndex((l) => l.id === label.id);
  if (index !== -1) {
    selectedLabels.value.splice(index, 1);
  }
};

// 打开选择对话框并初始化数据
const openLabelDialog = async (labels) => {
  selectedLabels.value = labels.filter((label) => label !== null);
  emit('fetch-all-labels'); // 触发获取所有标签的事件

  dialogVisible.value = true;
};

// 确认选择
const handleConfirm = () => {
  emit('update-labels', {
    rowId: props.rowId,
    labels: selectedLabels.value,
  });
  dialogVisible.value = false;
};
</script>

<template>
  <div class="label-column">
    <div class="flex items-center">
      <!-- 显示前两个标签 -->

      <template v-if="rowLabels && rowLabels.length > 0">
        <span v-for="(label, index) in rowLabels" :key="label?.id">
          <span
            v-if="label && index <= 1"
            class="label-item"
            @click="openLabelDialog(rowLabels)"
          >
            {{ label?.name }}
          </span>
        </span>
      </template>

      <!-- 显示更多标签的按钮 -->
      <span
        v-if="rowLabels?.length > 0"
        class="label-other"
        @click="openLabelDialog(rowLabels)"
      >
        {{ rowLabels?.length > 2 ? `+${rowLabels.length - 2}` : '+' }}
      </span>
    </div>

    <!-- 标签选择对话框 -->
    <ElDialog
      v-model="dialogVisible"
      :append-to-body="true"
      title="Customer Label"
      width="400px"
    >
      <div class="label-common">
        <!-- 已选标签显示区域 -->
        <div class="selected-labels">
          <el-tag
            v-for="label in selectedLabels"
            :key="label?.id"
            class="selected-label"
            closable
            @close="removeLabel(label)"
          >
            {{ label?.name }}
          </el-tag>
        </div>

        <!-- 搜索框 -->
        <div class="search-box">
          <ElInput
            v-model="searchKeyword"
            placeholder="Search"
            class="search-input"
          >
            <template #prefix>
              <ElIcon><Search /></ElIcon>
            </template>
          </ElInput>
          <ElButton type="primary" :icon="Search"> search </ElButton>
        </div>
      </div>

      <!-- 搜索结果列表 -->
      <div class="label-common">
        <div class="search-results">
          <div
            v-for="label in searchResults"
            :key="label.id"
            class="search-result-item"
            :class="{ selected: isSelected(label) }"
            @click="selectLabel(label)"
          >
            {{ label?.name }}
            <i class="iconfont icon-SURE" v-if="isSelected(label)"></i>
          </div>
          <div v-if="searchResults?.length === 0" class="no-value">
            No Value
          </div>
        </div>

        <!-- 确认按钮 -->
        <div class="flex justify-end">
          <ElButton type="primary" @click="handleConfirm"> determine </ElButton>
        </div>
      </div>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.label-selector {
  width: 100%;
}

.main-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.label {
  max-width: 200px;
  padding: 6px 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #409eff;
  white-space: nowrap;
  background-color: #ecf5ff;
  border-radius: 4px;
}

.more-label {
  padding: 6px 12px;
  color: white;
  cursor: pointer;
  background-color: #409eff;
  border-radius: 4px;
}

.selected-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.search-box {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
}

.search-results {
  height: 188px;
  margin-bottom: 15px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  cursor: pointer;
}

.search-result-item:hover {
  background-color: #f5f7fa;
}

.search-result-item.selected {
  color: #409eff;
  background-color: #ecf5ff;
  border-radius: 5px;
}

.check-icon {
  color: #409eff;
}

.labelCommon {
  box-sizing: border-box;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.noValue {
  padding-top: 20px;
  text-align: center;
}

.label-item {
  display: inline-block;
  width: 100px;
  height: 30px;
  margin-top: 5px;
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 30px;
  color: #0d99ff;
  text-align: center;
  white-space: nowrap;
  background: #c7e3ff;
  border-radius: 5px;
}

.label-other {
  display: inline-block;
  width: 50px;
  height: 30px;
  margin-left: 5px;
  line-height: 30px;
  color: #0d99ff;
  text-align: center;
  background: #c7e3ff;
  border-radius: 5px;
}

:deep(.el-dialog) {
  box-sizing: border-box;
  padding: 10px;
  border-radius: 10px;
}
</style>
