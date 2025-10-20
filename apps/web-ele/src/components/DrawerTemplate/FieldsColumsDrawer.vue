<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue';

import { vuedraggable as Draggable } from '@igourd/common-ui';
import { map, orderBy } from '@igourd/utils';

import { BasicDrawer, useDrawerInner } from '#/components/DrawerTemplate';

const emits = defineEmits(['register', 'updateColumns']);

const staticColumns = ref<any[]>([]);

const [registerModal, { closeDrawer }] = useDrawerInner(
  ({ columns, columnsTable }) => {
    staticColumns.value = columns;
    renderColumns(columns, columnsTable);
  },
);

const checkAll = ref<boolean>(false);
const checkedCities = ref<any[]>([]);
const draggableList = ref<any[]>([]);

watch(
  () => checkedCities.value,
  (values) => {
    draggableList.value = [...draggableList.value].map((item) => {
      item.show = values.includes(item.field);
      return item;
    });
  },
);

function renderColumns(values, columnsTable) {
  const columnsArray = map(columnsTable, 'field');
  const { keyList, valueList } = values.reduce(
    (aur, cur) => {
      const ind = columnsArray.indexOf(cur.field);
      if (ind !== -1) {
        cur.ind = ind;
        aur.keyList.push(cur.field);
      }
      aur.valueList.push(cur);
      return aur;
    },
    { keyList: [], valueList: [] },
  );
  checkedCities.value = keyList;
  draggableList.value = [...orderBy(valueList, ['ind'], ['asc'])];
  checkAll.value = checkedCities.value?.length === values.length;
}

const handleCheckAllChange = (val: boolean) => {
  checkedCities.value = val
    ? staticColumns.value.map((item) => item.field)
    : [];
  handleSave();
};

const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === staticColumns.value.length;
  handleSave();
};

const removeChecked = (item) => {
  checkedCities.value = [...checkedCities.value].filter(
    (value) => value !== item.field,
  );
  handleSave();
};

const onDragEnd = () => {
  handleSave();
};

const handleSave = () => {
  nextTick(() => {
    emits('updateColumns', draggableList.value);
  });
  // handleCancel();
};

function handleCancel() {
  closeDrawer();
}
</script>

<template>
  <BasicDrawer
    v-bind="$attrs"
    :size="750"
    :min-height="500"
    :title="$t('messages.elementPlus.columnsFieldsTitle')"
    ok-text="提交"
    :show-footer="false"
    @register="registerModal"
    @close="handleCancel"
  >
    <el-row class="Col" justify="space-around" :span="24" :gutter="10">
      <el-col :span="16">
        <div class="Col-border">
          <div class="Col-header">
            <el-checkbox v-model="checkAll" @change="handleCheckAllChange">
              {{ $t('common.select-all') }}
            </el-checkbox>
          </div>

          <div class="Col-body">
            <el-checkbox-group
              v-model="checkedCities"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="(item, index) in staticColumns"
                :key="index"
                :label="item.value"
                :value="item.field"
              >
                {{ $t(item.label) }}
              </el-checkbox>
            </el-checkbox-group>
            <!-- <el-button type="primary" @click="handleSave">Save</el-button> -->
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="Col-border">
          <div class="Col-right">
            <div class="Col-right-title">{{ $t('common.selected-fields') }}</div>
            <div class="Col-right-subtitle">
              {{ $t('common.supports-drag-and-drop-sorting') }}
            </div>
          </div>
          <Draggable
            :list="draggableList"
            item-key="label"
            animation="300"
            @end="onDragEnd"
          >
            <template #item="{ element }">
              <div class="Col-item">
                <div v-if="element.show" class="Col-item-content">
                  <span
                    class="Col-item-content__icon iconfont icon-tuodong"
                  ></span>
                  <span class="Col-item-content__text">
                    {{ $t(`${element.label}`) }}
                  </span>
                  <span
                    class="Col-item-content__close iconfont icon-guanbi"
                    @click="removeChecked(element)"
                  ></span>
                </div>
              </div>
            </template>
          </Draggable>
        </div>
      </el-col>
    </el-row>
  </BasicDrawer>
</template>

<style lang="scss" scoped>
.Col {
  position: relative;
  z-index: 200;
  width: 100%;
  height: calc(100vh - 130px);

  &-border {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 4px;
  }

  &-header {
    width: 185px;
    padding-bottom: 10px;
    border-bottom: 1px solid #d4e1f1;
  }

  :deep(.el-checkbox) {
    width: 50%;
    padding-left: 20px;
    margin-top: 10px;
    margin-right: 0;
  }

  &-item {
    &-content {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      height: 30px;
      padding: 0 8px;
      margin-bottom: 5px;
      background-color: #f9f9f9;
      border-radius: 4px;

      &:hover {
        background-color: #f1f1f1;

        .Col-item-content__icon {
          visibility: visible;
        }
      }

      &__icon {
        visibility: hidden;
      }

      &__text {
        flex: 1;
      }

      &__close {
        font-size: 12px;
        color: #5e7987;
      }
    }
  }

  &-right {
    padding-top: 5px;
    padding-bottom: 10px;

    &-title {
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
    }

    &-subtitle {
      font-size: 12px;
      font-weight: 400;
      line-height: 22px;
      color: #005cff;
    }
  }
}
</style>
